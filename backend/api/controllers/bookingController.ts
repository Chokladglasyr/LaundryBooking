import { FastifyReply, FastifyRequest } from "fastify";
import PostgresConnection from "../db";
import { bookingRequest, deleteRequest, idRequest } from "../types/requestTypes";
import { checkForBooking, insertBooking } from "../repository";
import { BookingDatabaseModel } from "../types/databaseModelTypes";

export async function getAllBookings(req: FastifyRequest, reply: FastifyReply) {
  try {
    const text = `SELECT * FROM bookings`;
    const bookings = await PostgresConnection.runQuery(text);
    if (!bookings || bookings.length === 0) {
      return reply.status(404).send({ message: "No bookings found." });
    }
    reply
      .status(200)
      .send({ message: "Fetched bookings succesfully: ", bookings: bookings });
  } catch (err) {
    console.error("Error fetching bookings.");
  }
}
export async function getOneBooking(
  req: FastifyRequest<{ Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    if (!id) {
      return reply.status(400).send({ message: "Missing parameters." });
    }
    const text = `SELECT * FROM bookings WHERE id = $1`;
    const values = [id];
    const booking = await PostgresConnection.runQuery(text, values);
    if (!booking || booking.length === 0) {
      return reply
        .status(404)
        .send({ message: `Booking not found with id: ${id}'` });
    }
    reply
      .status(200)
      .send({ message: "Fetched booking succesfully.", booking: booking });
  } catch (err) {
    console.error("Error fetching booking.");
  }
}
export async function createBooking(
  req: FastifyRequest<{ Body: bookingRequest }>,
  reply: FastifyReply
) {
  try {
    if (
      !req.body.booking_date ||
      !req.body.room_id ||
      !req.body.user_id ||
      !req.body.booking_timeslot
    ) {
      return reply.status(400).send({ message: "Missing required fields." });
    }
    const existing = await checkForBooking(req.body.user_id, req.body.room_id, req.body.booking_timeslot, req.body.booking_date);
    if (!existing) {
      return reply
        .status(400)
        .send({ message: "Error when checking existing booking." });
    }
    if (existing.status === 409) {
      return reply
        .status(409)
        .send({ message: existing.post});
    } else {
      const newBooking = {
        id: crypto.randomUUID(),
        user_id: req.body.user_id,
        room_id: req.body.room_id,
        booking_date: new Date(req.body.booking_date).toLocaleDateString('sv-SE'),
        booking_timeslot: req.body.booking_timeslot,
      };
      await insertBooking(newBooking);
      const text = `SELECT * FROM bookings WHERE id = $1`;
      const values = [newBooking.id];
      const createdBooking = await PostgresConnection.runQuery(text, values);
      if (!createdBooking || createdBooking.length === 0) {
        return reply
          .status(404)
          .send({ message: "Error fetching new booking." });
      }
      reply
        .status(201)
        .send({ message: "New booking created.", booking: createdBooking });
    }
  } catch (err) {
    console.error("Error creating booking.");
  }
}

export async function deleteBooking(
  req: FastifyRequest<{ Body: deleteRequest}>,
  reply: FastifyReply
) {
  try {
    const { user_id, room_id, booking_date, booking_timeslot } = req.body;
    if (!req.body) {
      return reply.status(400).send({ message: "Missing parameters." });
    }
    const text = `DELETE FROM bookings WHERE user_id = $1 AND room_id = $2 AND booking_date = $3 AND booking_timeslot = $4`;
    const values = [user_id, room_id, new Date(booking_date), booking_timeslot];
    await PostgresConnection.runQuery(text, values);
    reply.status(200).send({ message: `Deleted booking succesfully.` });
  } catch (err) {
    console.error("Error deleting booking.");
  }
}

export async function hasBooking(
  req: FastifyRequest<{ Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    if (!id) {
      return reply.status(400).send({ message: "Missing parameters." });
    }
    const text = `SELECT * FROM bookings WHERE user_id = $1 AND booking_date >= (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Stockholm')::date`;
    const values = [id];
    const existingBooking = (await PostgresConnection.runQuery(text, values)) as BookingDatabaseModel[]
    if(!existingBooking || existingBooking.length === 0) {
      return reply.status(409).send({ message: "User has no active bookings." });
    }
    if (existingBooking) {
      const text = `SELECT * FROM rooms WHERE id=$1`
      const values = [existingBooking[0].room_id]
      const room = await PostgresConnection.runQuery(text, values)
      return reply
        .status(200)
        .send({ message: "User already has an active booking.", booking: existingBooking, room: room });
    }
  } catch (err) {
    console.error("Error fetching an ongoing booking, ", err);
  }
}
