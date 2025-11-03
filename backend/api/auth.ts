import fastifyJwt from "@fastify/jwt";
import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { TokenPayload } from "./types/authTypes";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    authenticate(req: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}

async function auth(app: FastifyInstance, options: FastifyPluginOptions) {
  if (!process.env.MY_SECRET_KEY) {
    throw new Error("secret key for jwt is undefined");
  }
  
  await app.register(fastifyJwt, {
    secret: process.env.MY_SECRET_KEY,
    cookie: {
      cookieName: "refreshToken",
      signed: false
    }
  });
  app.decorate(
    "authenticate",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await req.jwtVerify()
      } catch (err) {
        return reply.status(401).send({ message: "Not authorized" });
      }
    }
  );
}
export default fp(auth, {
  name: "auth",
});
