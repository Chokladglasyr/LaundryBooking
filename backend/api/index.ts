import fastify, { FastifyReply, FastifyRequest } from "fastify";
import routes from "./routes";
import auth from "./auth";
import PostgresConnection from "./db";
import fastifyCors from "@fastify/cors";
import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import fastifySchedule from "@fastify/schedule";
import { cleanUpBooking, cleanUpReset, job } from "./jobs";

const app = fastify({});

await app.register(fastifyCors, {
  origin: [
    "https://laundry-booking-gamma.vercel.app",
    "http://localhost:5173",
    "https://fantastic-dragon-d3d623.netlify.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
});

const start = async () => {
  try {
    await PostgresConnection.initTables();
    await PostgresConnection.createAdmin();

    await app.register(fastifySchedule)
    await app.register(fastifyCookie, {
      parseOptions: {},
    });
    await app.register(auth);
    await app.register(routes, {});

    app.ready().then(() => {
      app.scheduler.addSimpleIntervalJob(cleanUpBooking)
      console.log("Cleanup for bookings in database set for every week.")

      app.scheduler.addSimpleIntervalJob(cleanUpReset)
      console.log("Cleanup for reset requests in database set for every second day")
    })
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


setInterval(
  async () => {
    try {
      const res = await fetch("https://laundrybooking.onrender.com");
      console.log(`Self ping OK: ${res.status}`);
    } catch (error) {
      console.error("Could not self ping:", error);
    }
  },
  14 * 60 * 1000
);

if (process.env.NODE_ENV !== "production") {
  start();
}
