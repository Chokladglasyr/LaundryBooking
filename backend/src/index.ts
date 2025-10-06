import fastify from "fastify";
import routes from "./routes";

const server = fastify()

const start = async() => {
    await server.register(routes, {})
    await server.listen({port:3000})
    console.log("Listening on port 3000")
}
start()