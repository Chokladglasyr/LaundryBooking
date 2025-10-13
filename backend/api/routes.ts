import { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as authController from './controllers/authController'
import * as ruleController from './controllers/ruleController'

async function routes(server: FastifyInstance, options: FastifyPluginOptions) {
    server.route({
        method: "GET",
        url: '/',
        preHandler: server.authenticate,
        handler: async(req, reply) =>{
            return {"message": "Welcome to my backend"}
        }
    });
    server.route({
        method: "POST",
        url: "/login",
        handler:authController.login
    })
    server.route({
        method: 'POST',
        url: '/signup',
        handler: authController.signup
    })
    server.route({
        method: 'POST',
        url: '/rule',
        handler: ruleController.createRule
    })
}

export default routes