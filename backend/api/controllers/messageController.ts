import { FastifyReply, FastifyRequest } from "fastify";
import { rulesAndMsgsRequest } from "../types/requestTypes";
import { insertMessage } from "../repository";
import PostgresConnection from "../db";

export async function createMessage(req: FastifyRequest<{Body: rulesAndMsgsRequest}>, reply: FastifyReply) {
    const newMsg = {
        id: crypto.randomUUID(),
        title: req.body.title,
        description: req.body.description
    }
    await insertMessage(newMsg)
    const created = await PostgresConnection.runQuery(`SELECT * FROM messages WHERE id = '${newMsg.id}'`)
    reply.status(201).send({message: "New message created", created_message: created[0]})
}