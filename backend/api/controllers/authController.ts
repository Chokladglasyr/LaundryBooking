import fastify, { FastifyReply, FastifyRequest } from "fastify";
import {
  LoginRequest,
  Password,
  SignupRequest,
  TokenPayload,
  User,
  UserDatabaseModel,
} from "../types/authTypes";
import {
  deleteResetRequest,
  findUser,
  saveUser,
  updateUserPassword,
} from "../repository";
import PostgresConnection from "../db";
import { idRequest, requestResetPassword } from "../types/requestTypes";
import { resetPasswordDatabaseModel } from "../types/databaseModelTypes";
import { sendEmail } from "../mailer";

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
      maxAge: 60 * 60,
    });
    reply.setCookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
    reply.status(200).send({
      message: "Logged in",
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        apt_nr: user[0].apt_nr,
        role: user[0].role,
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
    reply.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    reply.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    return reply.status(200).send({ message: "Succesfully logged out." });
  } catch (err) {
    console.error("Something went wrong logging out, ", err);
    return reply
      .status(500)
      .send({ message: "Something went wrong logging out, ", error: err });
  }
}
export async function requestReset(
  req: FastifyRequest<{ Querystring: idRequest }>,
  reply: FastifyReply
) {
  const baseUrl = "http://localhost:5173";
  // const baseUrl = 'https://fantastic-dragon-d3d623.netlify.app'
  try {
    const { id } = req.query;
    if (!id) {
      return reply.status(400).send({ message: "Missing parameters" });
    }
    const existingUser = await findUser(id);
    if (existingUser.message) {
      return reply.status(404).send({ message: existingUser.message });
    }
    const user = existingUser as UserDatabaseModel;
    const newResetRequest = {
      id: crypto.randomUUID(),
      user_id: id,
      user_email: user.email,
    };
    const text = `INSERT INTO resets (id, user_id, user_email) VALUES ($1, $2, $3)`;
    const values = [
      newResetRequest.id,
      newResetRequest.user_id,
      newResetRequest.user_email,
    ];
    await PostgresConnection.runQuery(text, values);
    const text2 = `SELECT * FROM resets WHERE user_id =$1 ORDER BY created_at DESC LIMIT 1`;
    const values2 = [newResetRequest.user_id];
    const res = await PostgresConnection.runQuery(text2, values2);
    const resetRequest = res[0] as resetPasswordDatabaseModel;
    await sendEmail({
      to: resetRequest.user_email,
      subject: "Ditt konto för bokning av tvättstuga är skapad",
      html: `  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 30px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="padding: 30px;">
        <h2 style="font-weight: 600; margin-bottom: 20px;">Hej!</h2>
        <p style="line-height: 1.6;">
          Styrelsen har skapat ett konto åt dig i bostadsföreningens bokningssystem för tvättstugan.
        </p>
        <p style="line-height: 1.6;">
          Klicka på knappen nedan för att skapa ditt eget lösenord:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}/reset?id=${resetRequest.id}"
            style="background-color: #2c9ce2; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-weight: bold;">
            Skapa lösenord
          </a>
        </div>
        <p style="font-size: 14px; line-height: 1.6;">
          Länken är giltig i 24 timmar.<br><br>
          Om du inte känner igen detta mejl eller inte bor i föreningen kan du ignorera det.
        </p>
        <p style="font-weight: 500;">Vänliga hälsningar,<br><br><strong>Styrelsen</strong></p>
      </div>
    </div>
  </div>`,
    });
    return reply.status(201).send({
      message: "New request to reset password created.",
      request: resetRequest,
    });
  } catch (err) {
    console.error("Something went wrong with requestReset: ", err);
    return reply
      .status(500)
      .send({ message: "Something went wrong requestReset: ", error: err });
  }
}
export async function resetPassword(
  req: FastifyRequest<{ Body: Password; Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    const { password } = req.body;
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });
    const text = `SELECT * FROM resets WHERE id = $1 AND (created_at + INTERVAL '30 minutes') >= CURRENT_TIMESTAMP`;
    const values = [id];
    const res = await PostgresConnection.runQuery(text, values);
    if (!res || res.length === 0) {
      return reply.status(404).send({ message: "No active request found." });
    }
    const user = res[0] as resetPasswordDatabaseModel;
    await updateUserPassword(hashedPassword, user.user_id);
    await deleteResetRequest(id);
    return reply.status(200).send({ message: "Password updated succesfully!" });
  } catch (err) {
    console.error("Something went wrong with resetPassword: ", err);
    return reply.status(500).send({
      message: "Something went wrong with resetPassword: ",
      error: err,
    });
  }
}
