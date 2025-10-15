import fastify, { FastifyReply, FastifyRequest } from "fastify";
import {
  LoginRequest,
  SignupRequest,
  TokenPayload,
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
    if (!user) {
      return reply
        .status(404)
        .send({ message: `User with id: '${newUser.id}' not found` });
    }
    return reply.status(200).send({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      user: user,
    });
  } catch (err) {
    console.error("Error with signup: ", err);
  }
}

export async function login(
  req: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply
) {
  try {
    if (!req.body) {
      return reply.status(400).send("Required fields missing input.");
    }
    const { email, password } = req.body;
    const text = `SELECT * FROM users WHERE email = $1`;
    const values = [email];
    const user = await PostgresConnection.runQuery(text, values);
    if (!user) {
      return reply
        .status(404)
        .send({ message: `User with email: '${email}' not found` });
    }
    const match = await Bun.password.verify(password, user[0].password);
    if (!match) {
      return reply.status(402).send("Incorrect credentials");
    }
    reply.status(201).send({
      message: "Logged in",
      user: { name: user[0].name, email: user[0].email },
    });
  } catch (err) {
    console.error("Error when logging in: ", err);
  }
}
