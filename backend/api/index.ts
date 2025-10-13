import fastify, { FastifyReply, FastifyRequest } from "fastify";
import routes from "./routes";
import auth from "./auth";
import PostgresConnection from "./db";
import fastifyJwt from "@fastify/jwt";
import { TokenPayload } from "./types/authTypes";

const app = fastify();
  if (!process.env.MY_SECRET_KEY) {
    throw new Error("secret key for jwt is undefined");
  }
  await app.register(fastifyJwt, {
    secret: process.env.MY_SECRET_KEY,
  });
    app.decorate(
    "authenticate",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await req.jwtVerify<TokenPayload>();
      } catch (err) {
        return reply.status(401).send({message: "Not authorized"});
      }
    }
  );

const start = async () => {
  try {
    await PostgresConnection.initTables();
    await PostgresConnection.createAdmin();

    await app.register(auth);
    await app.register(routes, {});

    if (process.env.NODE_ENV !== "production") {
      const PORT = 3000;
      await app.listen({ port: PORT });
      console.log("Listening on port ", PORT);
    }
  } catch (err) {
    console.error("Server failed: ", err);
    process.exit(1);
  }
};

if(process.env.NODE_ENV !== "production"){
  start()
}

// export default async function handler(req: any, res: any) {
//   await start();
//   await app.ready();
//   app.server.emit("request", req, res);
// }
