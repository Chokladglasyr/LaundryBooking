import { FastifyReply, FastifyRequest } from "fastify";
import { idRequest, rulesAndMsgsRequest } from "../types/requestTypes";
import { insertMessage, updateMessage } from "../repository";
import PostgresConnection from "../db";

export async function getAllMessages(req: FastifyRequest, reply: FastifyReply) {
  try {
    const text = `SELECT * FROM messages`;
    const allMessages = await PostgresConnection.runQuery(text);
    if (!allMessages || allMessages.length === 0) {
      reply.status(404).send({ message: "No messages found." });
    }
    reply
      .status(200)
      .send({ message: "Messages fetched", messages: allMessages });
  } catch (err) {
    console.error("Error fetching messages.");
  }
}

export async function getOneMessage(
  req: FastifyRequest<{ Querystring: idRequest }>,
  reply: FastifyReply
) {
  const { id } = req.query;
  if (!id) {
    reply.status(400).send({ message: "Missing parameters." });
  }
  const text = `SELECT * FROM messages WHERE id = $1`;
  const values = [id];
  const message = await PostgresConnection.runQuery(text, values);
  if (!message || message.length === 0) {
    reply.status(404).send({ message: `No message found with id: ${id}` });
  }
  reply
    .status(200)
    .send({ message: "Message fetched", fetched_message: message[0] });
}

export async function createMessage(
  req: FastifyRequest<{ Body: rulesAndMsgsRequest }>,
  reply: FastifyReply
) {
  try {
    if (!req.body.title || !req.body.description) {
      reply.status(400).send({ message: "Missing required fields." });
    }
    const newMsg = {
      id: crypto.randomUUID(),
      title: req.body.title,
      description: req.body.description,
    };
    await insertMessage(newMsg);
    const text = `SELECT * FROM messages WHERE id = $1`;
    const values = [newMsg.id];
    const created = await PostgresConnection.runQuery(text, values);
    if (!created || created.length === 0) {
      return reply.status(404).send({ message: "Error fetching new message." });
    }
    reply
      .status(201)
      .send({ message: "New message created", created_message: created[0] });
  } catch (err) {
    console.error("Error inserting new message: ", err);
  }
}

export async function updateOneMessage(
  req: FastifyRequest<{ Body: rulesAndMsgsRequest; Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    if (!id) {
      reply.status(400).send({ message: "Missing parameters." });
    }
    if (!req.body.title || !req.body.description) {
      reply.status(400).send({ message: "Missing required fields." });
    }
    const messageToUpdate = {
      title: req.body.title,
      description: req.body.description,
      updated_at: new Date().toISOString(),
    };
    await updateMessage(messageToUpdate, id);
    const text = `SELECT * FROM messages WHERE id = $id`;
    const values = [id];
    const updatedMessage = await PostgresConnection.runQuery(text, values);
    if (!updatedMessage || updatedMessage.length === 0) {
      reply.status(404).send({ message: "Updated message cannot be found." });
    }
    reply
      .status(200)
      .send({ message: "Message updated", updated_message: updatedMessage });
  } catch (err) {
    console.error("Error updating message: ", err);
  }
}

export async function deleteMessage(
  req: FastifyRequest<{ Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    if (!id) {
      reply.status(400).send({ message: "Missing parameters." });
    }
    await PostgresConnection.runQuery(
      `DELETE FROM messages WHERE id = '${id}'`
    );
    reply
      .status(200)
      .send({ message: `Message with id: ${id} was deleted succesfully.` });
  } catch (err) {
    console.error("Error deleting message: ", err);
  }
}
