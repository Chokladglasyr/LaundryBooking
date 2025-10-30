import { FastifyReply, FastifyRequest } from "fastify";
import PostgresConnection from "../db";
import { idRequest, roomRequest } from "../types/requestTypes";
import { insertRoom, updateRoom } from "../repository";
import { RoomDatabaseModel } from "../types/databaseModelTypes";

export async function getAllRooms(req: FastifyRequest, reply: FastifyReply) {
  try {
    const text = `SELECT * FROM rooms ORDER BY updated_at DESC;`;
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
    const { id } = req.query;
    if (!id) {
      return reply
        .status(400)
        .send({ message: `Room with id: ${id} not found.` });
    }
    const text = `SELECT * FROM rooms WHERE id = $1`
    const values = [id]
    const room = await PostgresConnection.runQuery(text, values)
    reply.status(200).send({message: "Room fetched succesfully.", room: room})
  } catch (err) {
    console.error("Error fetching room: ", err);
  }
}

export async function createRoom(
  req: FastifyRequest<{ Body: roomRequest }>,
  reply: FastifyReply
) {
  try {
    if (!req.body.description || !req.body.name) {
      return reply.status(400).send({ message: "Missing required fields." });
    }
    const newRoom = {
      id: crypto.randomUUID(),
      name: req.body.name,
      description: req.body.description,
    };
    await insertRoom(newRoom);
    const text = `SELECT * FROM rooms WHERE id = $1`;
    const values = [newRoom.id];
    const createdRoom = await PostgresConnection.runQuery(text, values);
    if (!createdRoom || createdRoom.length === 0) {
      return reply.status(404).send({ message: "Error fetching new room." });
    }
    reply.status(201).send({ message: "New room created:", room: createdRoom });
  } catch (err) {
    console.error("Error inserting new room: ", err);
  }
}

export async function updateOneRoom(
  req: FastifyRequest<{ Body: roomRequest; Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    let {name, description} = req.body
    if (!id) {
      return reply.status(400).send({ message: "Missing parameters." });
    }
    if (!description && !name) {
      return reply.status(400).send({ message: "Missing required fields." });
    }
    const text1 = `SELECT * FROM rooms WHERE id= $1`
    const values1 = [id]
    const res = await PostgresConnection.runQuery(text1, values1)
    const untouchedRoom = res[0] as RoomDatabaseModel;
    if(!name){
      name = untouchedRoom.name
    }
    if(!description) {
      description = untouchedRoom.description
    }
    const roomToUpdate = {
      id: id,
      name: name,
      description: description,
      updated_at: new Date().toISOString(),
    };
    await updateRoom(roomToUpdate, id);
    const text = `SELECT * FROM rooms WHERE id = $1`;
    const values = [id];
    const updatedRoom = await PostgresConnection.runQuery(text, values);
    if (!updatedRoom || updatedRoom.length === 0) {
      return reply.status(404).send({ message: "Error fetching updated room" });
    }
    reply.status(200).send({ message: "Room updated.", room: updatedRoom });
  } catch (err) {
    console.error("Error updating room.");
  }
}

export async function deleteRoom(
  req: FastifyRequest<{ Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    if (!id) {
      return reply.status(400).send({ message: "Missing parameters." });
    }
    const text = `DELETE FROM rooms WHERE id = $1`;
    const values = [id];
    await PostgresConnection.runQuery(text, values);
    reply.status(200).send({message: `Deleted room with id: ${id}`})
  } catch (err) {
    console.error("Error deleting room.");
  }
}
