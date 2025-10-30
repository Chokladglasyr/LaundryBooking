import fastify, { FastifyReply, FastifyRequest } from "fastify";
import routes from "./routes";
import auth from "./auth";
import PostgresConnection from "./db";
import fastifyCors from "@fastify/cors";
import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";

const app = fastify({});

await app.register(fastifyCors, {
  origin: ["https://laundry-booking-gamma.vercel.app", "http://localhost:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

const start = async () => {
  try {
    await PostgresConnection.initTables();
    await PostgresConnection.createAdmin();

    await app.register(fastifyCookie, {
      parseOptions: {},
    });
    await app.register(auth);
    await app.register(routes, {});

    if (process.env.NODE_ENV !== "production") {
      const PORT = Number(process.env.PORT) || 3000;
      await app.listen({ port: PORT, host: "0.0.0.0" });
      console.log("Listening on port ", PORT);
    }
  } catch (err) {
    console.error("Server failed: ", err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "production") {
  start();
}
