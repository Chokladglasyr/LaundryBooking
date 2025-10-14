import { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as authController from './controllers/authController'
import * as ruleController from './controllers/ruleController'
import * as messageController from './controllers/messageController'
import * as userController from './controllers/userController'
import fp from "fastify-plugin"

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
        method: 'GET',
        url: '/users',
        preHandler: server.authenticate,
        handler: userController.getAllUsers
    })
    server.route({
        method: 'GET',
        url: '/user',
        preHandler: server.authenticate,
        handler: userController.getOneUser
    })
    server.route({
        method: 'GET',
        url: '/rules',
        preHandler: server.authenticate,
        handler: ruleController.getAllRules
    })
    server.route({
        method: 'POST',
        url: '/rule',
        preHandler: server.authenticate,
        handler: ruleController.createRule
    })
    server.route({
        method:'GET',
        url: '/messages',
        preHandler: server.authenticate,
        handler: messageController.getAllMessages
    })
    server.route({
        method:'POST',
        url: '/message',
        preHandler: server.authenticate,
        handler:messageController.createMessage
    })
}

export default fp(routes, {
    name: 'routes'
})