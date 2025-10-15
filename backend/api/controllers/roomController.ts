import { FastifyReply, FastifyRequest } from "fastify";
import PostgresConnection from "../db";
import { idRequest } from "../types/requestTypes";

export async function getAllRooms(req: FastifyRequest, reply: FastifyReply) {
  try {
    const text = `SELECT * FROM rooms;`;
    const rooms = await PostgresConnection.runQuery(text);
    if (!rooms || rooms.length === 0) {
      return reply.status(404).send({ message: "No rooms found." });
    }
    reply
      .status(200)
      .send({ message: "Rooms fetched succesfully", rooms: rooms });
  } catch (err) {
    console.error("Error fetching rooms: ", err);
  }
}

export async function getOneRoom(
  req: FastifyRequest<{ Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query
    if(!id) {
        return reply.status(400).send({message: `Room with id: ${id} not found.`})
    }
  } catch (err) {
    console.error("Error fetching room: ", err);
  }
}
