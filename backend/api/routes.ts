import { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as authController from "./controllers/authController";
import * as ruleController from "./controllers/ruleController";
import * as postController from "./controllers/postController";
import * as userController from "./controllers/userController";
import * as roomController from "./controllers/roomController";
import * as bookingController from "./controllers/bookingController";
import fp from "fastify-plugin";

async function routes(server: FastifyInstance, options: FastifyPluginOptions) {
  server.route({
    method: "GET",
    url: "/",
    preHandler: server.authenticate,
    handler: async (req, reply) => {
      return { post: "Welcome to my backend" };
    },
  });
  server.route({
    method: "POST",
    url: "/login",
    handler: authController.login,
  });
  server.route({
    method: "GET",
    url: "/logout",
    preHandler: server.authenticate,
    handler: authController.logout,
  });
  server.route({
    method: "POST",
    url: "/signup",
    handler: authController.signup,
  });
  server.route({
    method: "GET",
    url: "/me",
    preHandler: server.authenticate,
    handler: userController.getLoggedIn,
  });
  server.route({
    method: "GET",
    url: "/users",
    preHandler: server.authenticate,
    handler: userController.getAllUsers,
  });
  server.route({
    method: "GET",
    url: "/user",
    preHandler: server.authenticate,
    handler: userController.getOneUser,
  });
  server.route({
    method: "POST",
    url: "/user",
    preHandler: server.authenticate,
    handler: userController.createUser,
  });
  server.route({
    method: "PUT",
    url: "/user",
    preHandler: server.authenticate,
    handler: userController.updateOneUser,
  });
  server.route({
    method: "DELETE",
    url: "/user",
    preHandler: server.authenticate,
    handler: userController.deleteUser,
  });
  server.route({
    method: "GET",
    url: "/search",
    preHandler: server.authenticate,
    handler: userController.searchUser,
  });

  server.route({
    method: "GET",
    url: "/rules",
    preHandler: server.authenticate,
    handler: ruleController.getAllRules,
  });
  server.route({
    method: "GET",
    url: "/rule",
    preHandler: server.authenticate,
    handler: ruleController.getOneRule,
  });
  server.route({
    method: "POST",
    url: "/rule",
    preHandler: server.authenticate,
    handler: ruleController.createRule,
  });
  server.route({
    method: "PUT",
    url: "/rule",
    preHandler: server.authenticate,
    handler: ruleController.updateOneRule,
  });
  server.route({
    method: "DELETE",
    url: "/rule",
    preHandler: server.authenticate,
    handler: ruleController.deleteRule,
  });

  server.route({
    method: "GET",
    url: "/posts",
    preHandler: server.authenticate,
    handler: postController.getAllPosts,
  });
  server.route({
    method: "GET",
    url: "/post",
    preHandler: server.authenticate,
    handler: postController.getOnePost,
  });
  server.route({
    method: "POST",
    url: "/post",
    preHandler: server.authenticate,
    handler: postController.createPost,
  });
  server.route({
    method: "PUT",
    url: "/post",
    preHandler: server.authenticate,
    handler: postController.updateOnePost,
  });
  server.route({
    method: "DELETE",
    url: "/post",
    preHandler: server.authenticate,
    handler: postController.deletePost,
  });
  server.route({
    method: "GET",
    url: "/rooms",
    preHandler: server.authenticate,
    handler: roomController.getAllRooms,
  });
  server.route({
    method: "GET",
    url: "/room",
    preHandler: server.authenticate,
    handler: roomController.getOneRoom,
  });
  server.route({
    method: "POST",
    url: "/room",
    preHandler: server.authenticate,
    handler: roomController.createRoom,
  });
  server.route({
    method: "PUT",
    url: "/room",
    preHandler: server.authenticate,
    handler: roomController.updateOneRoom,
  });
  server.route({
    method: "DELETE",
    url: "/room",
    preHandler: server.authenticate,
    handler: roomController.deleteRoom,
  });
  server.route({
    method: "GET",
    url: "/bookings",
    preHandler: server.authenticate,
    handler: bookingController.getAllBookings,
  });
  server.route({
    method: "GET",
    url: "/booking",
    preHandler: server.authenticate,
    handler: bookingController.getOneBooking,
  });
  server.route({
    method: "POST",
    url: "/booking",
    preHandler: server.authenticate,
    handler: bookingController.createBooking,
  });
  server.route({
    method: "DELETE",
    url: "/booking",
    preHandler: server.authenticate,
    handler: bookingController.deleteBooking,
  });
  server.route({
    method: "GET",
    url: "/booking/health",
    preHandler: server.authenticate,
    handler: bookingController.hasBooking,
  });
  server.route({
    method: "POST",
    url: "/getpasswordreset",
    handler: authController.requestReset
  })
  server.route({
    method: 'POST',
    url: '/resetpassword',
    handler: authController.resetPassword
  })
}

export default fp(routes, {
  name: "routes",
});
