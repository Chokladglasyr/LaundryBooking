import { FastifyInstance, FastifyPluginOptions } from "fastify";

async function routes(server: FastifyInstance, options: FastifyPluginOptions) {
    server.route({
        method: "GET",
        url: '/',
        preHandler: server.authenticate,
        handler: async(req, reply) =>{
            return {"message": "Welcome to my backend"}
        }
    }),
    server.route({
        method: "POST",
        url: "/login",
        handler: (req, reply) => {}
    })
}

export default routes