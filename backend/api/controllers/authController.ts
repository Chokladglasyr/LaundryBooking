import fastify, { FastifyReply, FastifyRequest } from "fastify";
import {
  LoginRequest,
  SignupRequest,
  TokenPayload,
  User,
  UserDatabaseModel,
} from "../types/authTypes";
import { saveUser } from "../repository";
import PostgresConnection from "../db";

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
    const isSecure = process.env.NODE_ENV === "production" ? "Secure" : "";
    reply.setCookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
    reply.setCookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
    reply.status(200).send({
      message: "Logged in",
      user: { name: user[0].name, email: user[0].email },
    });
  } catch (err) {
    console.error("Error when logging in: ", err);
    return reply
      .status(500)
      .send({ message: "Something went wrong, ", error: err });
  }
}
