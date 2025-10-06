import { FastifyInstance, FastifyPluginOptions } from "fastify";

async function routes(server: FastifyInstance, options: FastifyPluginOptions) {
    server.route({
        method: "GET",
        url: '/',
        handler: (req, reply) =>{
            console.log("hello")
        }
    })
}

export default routes