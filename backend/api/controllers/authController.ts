import { FastifyReply, FastifyRequest } from "fastify";
import {
  SignupRequest,
  TokenPayload,
  UserDatabaseModel,
} from "../types/authTypes";
import { saveUser } from "../repository";

export async function signup(
  req: FastifyRequest<{ Body: SignupRequest }>,
  reply: FastifyReply
) {
    if(!req.body.name || !req.body.email || !req.body.password || !req.body.apt_nr) {
        reply.status(400).send("Required fields missing input.")
    }
  const newUser: UserDatabaseModel = {
    id: crypto.randomUUID(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    apt_nr: req.body.apt_nr,
    created_at: new Date().toISOString(),
  };
  console.log(newUser)
  saveUser(newUser)

  const tokenPayload: TokenPayload = {
    user_id: newUser.id,
    email: newUser.email,
    type: "",
  };
  const newAccessToken = await reply.jwtSign(
    {
      ...tokenPayload,
      type: "acess_token",
    },
    {
      expiresIn: "3600s",
    }
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
        created_at: newUser.created_at
    }
  })
}
