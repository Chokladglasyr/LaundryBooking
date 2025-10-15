import { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as authController from './controllers/authController'
import * as ruleController from './controllers/ruleController'
import * as messageController from './controllers/messageController'
import * as userController from './controllers/userController'
import * as roomController from './controllers/roomController'
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
        method: 'PUT',
        url:'/user',
        preHandler: server.authenticate,
        handler: userController.updateOneUser
    })
    server.route({
        method: 'DELETE',
        url: '/user',
        preHandler: server.authenticate,
        handler: userController.deleteUser
    })

    server.route({
        method: 'GET',
        url: '/rules',
        preHandler: server.authenticate,
        handler: ruleController.getAllRules
    })
    server.route({
        method: 'GET',
        url: '/rule',
        preHandler: server.authenticate,
        handler: ruleController.getOneRule
    })
    server.route({
        method: 'POST',
        url: '/rule',
        preHandler: server.authenticate,
        handler: ruleController.createRule
    })
    server.route({
        method: 'PUT',
        url: '/rule',
        preHandler: server.authenticate,
        handler: ruleController.updateOneRule
    })
    server.route({
        method: 'DELETE',
        url:'/rule',
        preHandler: server.authenticate,
        handler: ruleController.deleteRule
    })

    server.route({
        method:'GET',
        url: '/messages',
        preHandler: server.authenticate,
        handler: messageController.getAllMessages
    })
    server.route({
        method:'GET',
        url: '/message',
        preHandler: server.authenticate,
        handler: messageController.getOneMessage
    })
    server.route({
        method:'POST',
        url: '/message',
        preHandler: server.authenticate,
        handler:messageController.createMessage
    })
    server.route({
        method: 'PUT',
        url: '/message',
        preHandler: server.authenticate,
        handler: messageController.updateOneMessage
    })
    server.route({
        method: 'DELETE',
        url: '/message',
        preHandler: server.authenticate,
        handler: messageController.deleteMessage    
    })
    server.route({
        method: 'GET',
        url: '/rooms',
        preHandler: server.authenticate,
        handler: roomController.getAllRooms
    })
    server.route({
        method: 'GET',
        url: '/room',
        preHandler: server.authenticate,
        handler: roomController.getOneRoom
    })
    server.route({
        method: 'POST',
        url: '/room',
        preHandler: server.authenticate,
        handler: roomController.createRoom
    })
    server.route({
        method:'PUT',
        url: '/room',
        preHandler: server.authenticate,
        handler: roomController.updateOneRoom
    })
    server.route({
        method: 'DELETE',
        url: '/room',
        preHandler: server.authenticate,
        handler: roomController.deleteRoom
    })
}

export default fp(routes, {
    name: 'routes'
})