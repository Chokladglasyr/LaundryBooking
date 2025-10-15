import { FastifyReply, FastifyRequest } from "fastify";
import PostgresConnection from "../db";
import { idRequest } from "../types/requestTypes";

export async function getAllBookings(req: FastifyRequest, reply: FastifyReply) {
    try {
        const text = `SELECT * FROM bookings`
        const bookings = await PostgresConnection.runQuery(text)
        if(!bookings || bookings.length === 0) {
            return reply.status(404).send({message: "No bookings found."})
        }
        reply.status(200).send({message: "Fetched bookings succesfully: ", bookings: bookings})

    } catch(err) {
        console.error("Error fetching bookings.")
    }
}
export async function getOneBooking(req: FastifyRequest<{Querystring: idRequest}>, reply: FastifyReply) {
    try {
        const {id} = req.query
        if(!id) {
            return reply.status(400).send({message: "Missing parameters."})
        }
        const text = `SELECT * FROM bookings WHERE id = $1`
        const values = [id]
        const booking = await PostgresConnection.runQuery(text, values)
        if(!booking || booking.length === 0) {
            return reply.status(404).send({message: `Booking not found with id: ${id}'`})
        }
        reply.status(200).send({message: "Fetched booking succesfully.", booking: booking})
    } catch(err) {
        console.error("Error fetching booking.")
    }
}
export async function createBooking(req: FastifyRequest, reply: FastifyReply) {
    try {

    } catch(err) {
        console.error("Error creating booking.")
    }
}
export async function updateOneBooking(req: FastifyRequest, reply: FastifyReply) {
    try {

    } catch(err) {
        console.error("Error updating booking.")
    }
}
export async function deleteBooking(req: FastifyRequest, reply: FastifyReply) {
    try {

    } catch(err) {
        console.error("Error deleting booking.")
    }
}