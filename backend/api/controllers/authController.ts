import fastify, { FastifyReply, FastifyRequest } from "fastify";
import {
  LoginRequest,
  SignupRequest,
  TokenPayload,
  User,
  UserDatabaseModel,
} from "../types/authTypes";
import { findUser, saveUser, updateUserPassword } from "../repository";
import PostgresConnection from "../db";
import { idRequest, requestResetPassword } from "../types/requestTypes";
import { resetPasswordDatabaseModel } from "../types/databaseModelTypes";

export async function signup(
  req: FastifyRequest<{ Body: SignupRequest }>,
  reply: FastifyReply
) {
  try {
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.password ||
      !req.body.apt_nr
    ) {
      return reply.status(400).send("Required fields missing input.");
    }

    const newUser: UserDatabaseModel = {
      id: crypto.randomUUID(),
      name: req.body.name,
      email: req.body.email,
      password: await Bun.password.hash(req.body.password, {
        algorithm: "bcrypt",
        cost: 10,
      }),
      apt_nr: req.body.apt_nr,
    };

    await saveUser(newUser);

    const tokenPayload: TokenPayload = {
      user_id: newUser.id,
      email: newUser.email,
      type: "",
    };

    const newAccessToken = await reply.jwtSign(
      { ...tokenPayload, type: "access_token" },
      { expiresIn: "3600s" }
    );

    const newRefreshToken = await reply.jwtSign(
      {
        ...tokenPayload,
        type: "refresh_token",
      },
      {
        expiresIn: "30d",
      }
    );
    const text = `SELECT * FROM users WHERE id = $1`;
    const values = [newUser.id];
    const user = await PostgresConnection.runQuery(text, values);
    if (!user || user.length === 0) {
      return reply
        .status(404)
        .send({ message: `User with id: '${newUser.id}' not found` });
    }
    return reply.status(201).send({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      user: user[0],
    });
  } catch (err) {
    console.error("Error with signup: ", err);
    return reply.status(500).send({ error: err });
  }
}

export async function login(
  req: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply
) {
  try {
    if (!req.body.email && !req.body.password) {
      return reply.status(400).send("Required fields missing input.");
    }
    const { email, password } = req.body;
    const text = `SELECT * FROM users WHERE email = $1`;
    const values = [email];
    const userRows = await PostgresConnection.runQuery(text, values);
    const user = userRows as User[];
    if (!user || user.length === 0) {
      return reply
        .status(404)
        .send({ message: `User with email: '${email}' not found` });
    }
    const match = await Bun.password.verify(password, user[0].password);
    if (!match) {
      return reply.status(401).send("Incorrect credentials");
    }

    const tokenPayload: TokenPayload = {
      user_id: user[0].id,
      email: user[0].email,
      type: "",
    };

    const newAccessToken = await reply.jwtSign(
      { ...tokenPayload, type: "access_token" },
      { expiresIn: "3600s" }
    );

    const newRefreshToken = await reply.jwtSign(
      {
        ...tokenPayload,
        type: "refresh_token",
      },
      {
        expiresIn: "30d",
      }
    );
    reply.setCookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60*60
    });
    reply.setCookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 30*24*60*60
    });
    reply.status(200).send({
      message: "Logged in",
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        apt_nr: user[0].apt_nr,
        role: user[0].role
      },
    });
  } catch (err) {
    console.error("Error when logging in: ", err);
    return reply
      .status(500)
      .send({ message: "Something went wrong, ", error: err });
  }
}
export async function logout(req: FastifyRequest, reply: FastifyReply) {
  try {
    reply.clearCookie("accessToken", {httpOnly: true, secure: true, sameSite: "none", path: "/"});
    reply.clearCookie("refreshToken", {httpOnly: true, secure: true, sameSite: "none", path: "/"});
    return reply.status(200).send({ message: "Succesfully logged out." });
  } catch (err) {
    console.error("Something went wrong logging out, ", err);
    return reply
      .status(500)
      .send({ message: "Something went wrong logging out, ", error: err });
  }
}
export async function requestReset(req: FastifyRequest<{Querystring: idRequest}>, reply: FastifyReply) {
  try {
    const { id } = req.query
    if(!id) {
      return reply.status(400).send({message: "Missing parameters"})
    }
    const existingUser = await findUser(id)
    if(existingUser.message) {
      return reply.status(404).send({message: existingUser.message})
    }
    const newResetRequest = {
      id: crypto.randomUUID(),
      user_id: id,
    }
    const text = `INSERT INTO resets (id, user_id) VALUES ($1, $2)`
    const values = [newResetRequest.id, newResetRequest.user_id]
    await PostgresConnection.runQuery(text, values)
    const text2 = `SELECT * FROM resets WHERE user_id =$1 ORDER BY created_at DESC LIMIT 1`
    const values2 = [newResetRequest.user_id]
    const resetRequest = await PostgresConnection.runQuery(text2, values2)
    return reply.status(201).send({message: "New request to reset password created.", request: resetRequest})
  } catch(err) {
    console.error("Something went wrong with requestReset: ", err)
    return reply.status(500).send({message: "Something went wrong requestReset: ", error: err})
  }
}
export async function resetPassword(req: FastifyRequest<{Body: requestResetPassword, Querystring: idRequest}>, reply: FastifyReply) {
  try {
     const {id} = req.query
     const {password} = req.body
     const hashedPassword = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 10,
      })
     const text = `SELECT * FROM resets WHERE id = $1 AND (created_at + INTERVAL '30 minutes') >= CURRENT_TIMESTAMP`
     const values = [id]
     const res = await PostgresConnection.runQuery(text, values)
    if(!res || res.length === 0){
      return reply.status(404).send({message: 'No active request found.'})
    }
    const user = res[0] as resetPasswordDatabaseModel

    await updateUserPassword(hashedPassword, user.user_id)
    return reply.status(200).send({message: "Password updated succesfully!"})
  } catch(err) {
    console.error("Something went wrong with resetPassword: ", err)
    return reply.status(500).send({message: "Something went wrong with resetPassword: ", error: err})
  }
}