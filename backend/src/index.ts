import fastify from "fastify";
import routes from "./routes";
import auth from "./auth";
import PostgresConnection from "./db";

const server = fastify();

const start = async () => {
  try {
    await PostgresConnection.initTables();
    await PostgresConnection.createAdmin();

    await server.register(auth);
    await server.register(routes, {});

    const PORT = 3000;
    await server.listen({ port: PORT });
    console.log("Listening on port ", PORT);
  } catch (err) {
    console.error("Server failed: ", err);
    process.exit(1);
  }
};
start();
