import fastify from "fastify";
import routes from "./routes";
import auth from "./auth";

const server = fastify();

const start = async () => {
  try {
    const PORT = 3000;
    await server.register(auth);

    await server.register(routes, {});
    
    await server.listen({ port: PORT });
    console.log("Listening on port ", PORT);
  } catch (err) {
    console.error("Server failed: ", err);
    process.exit(1);
  }
};
start();
