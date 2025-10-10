import fastify from "fastify";
import routes from "./routes";
import auth from "./auth";
import PostgresConnection from "./db";

const app = fastify();

const start = (async () => {
  try {
    await PostgresConnection.initTables();
    await PostgresConnection.createAdmin();

    await app.register(auth);
    await app.register(routes, {});
    console.log("Running")
    // const PORT = 3000;
    // await server.listen({ port: PORT });
    // console.log("Listening on port ", PORT);
  } catch (err) {
    console.error("Server failed: ", err);
    process.exit(1);
  }
})();

export default async function handler(req: any, res: any) {
  await app.ready()
  app.server.emit('request', req, res)
}