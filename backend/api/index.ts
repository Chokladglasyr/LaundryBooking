import fastify, { FastifyReply, FastifyRequest } from "fastify";
import routes from "./routes";
import auth from "./auth";
import PostgresConnection from "./db";
import fastifyJwt from "@fastify/jwt";
import { TokenPayload } from "./types/authTypes";

const app = fastify();

const start = async () => {
  try {
    await PostgresConnection.initTables();
    await PostgresConnection.createAdmin();

    await app.register(auth);
    await app.register(routes, {});
  } catch (err) {
    console.error("Server failed: ", err);
    process.exit(1);
  }
};
await start()
// if(process.env.NODE_ENV !== "production"){
//   start()
// }

    if (process.env.NODE_ENV !== "production") {
      const PORT = Number(process.env.PORT) || 3000;
      await app.listen({ port: PORT });
      console.log("Listening on port ", PORT);
    }

export default async function handler(req: any, res: any) {
  await start();
  await app.ready();
  app.server.emit("request", req, res);
}
