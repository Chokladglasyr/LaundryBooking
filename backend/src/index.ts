import fastify from "fastify";
import routes from "./routes";

const server = fastify();

const start = async () => {
  try {
    const PORT = 3000
    await server.register(routes, {});
    await server.listen({ port: PORT });
    console.log("Listening on port ", PORT);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
