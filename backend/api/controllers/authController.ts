import fastify, { FastifyReply, FastifyRequest } from "fastify";
import {
  LoginRequest,
  SignupRequest,
  TokenPayload,
  UserDatabaseModel,
} from "../types/authTypes";
import { saveUser } from "../repository";
import PostgresConnection from "../db";

const app = fastify()

export async function signup(
  req: FastifyRequest<{ Body: SignupRequest }>,
  reply: FastifyReply
) {
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  console.log(newUser);
  await saveUser(newUser);

  const tokenPayload: TokenPayload = {
    user_id: newUser.id,
    email: newUser.email,
    type: "",
  };
  console.log(tokenPayload);
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
  return reply.status(200).send({
    access_token: newAccessToken,
    refresh_token: newRefreshToken,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      apt_nr: newUser.apt_nr,
      created_at: newUser.created_at,
    },
  });
}

export async function login(
  req: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply
) {
  if (!req.body.email || !req.body.password) {
    return reply.status(400).send("Required fields missing input.");
  }
  const {email, password } = req.body
  const user = await PostgresConnection.runQuery(`SELECT * FROM users WHERE email = '${email}'`)

  const match = await Bun.password.verify(password, user[0].password)
  if(!match){
    return reply.status(402).send("Incorrect credentials")
  }

  reply.status(201).send({message: "Logged in", user:{ name: user[0].name, email: user[0].email}})
}
