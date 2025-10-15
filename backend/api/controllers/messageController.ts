import { FastifyReply, FastifyRequest } from "fastify";
import { idRequest, rulesAndMsgsRequest } from "../types/requestTypes";
import { insertMessage } from "../repository";
import PostgresConnection from "../db";

export async function getAllMessages(req: FastifyRequest, reply: FastifyReply) {
    const allMessages = await PostgresConnection.runQuery(`SELECT * FROM messages;`)
    reply.status(200).send({message: "Messages fetched", messages: allMessages})
}

export async function getOneMessage(req: FastifyRequest<{Querystring: idRequest}>, reply: FastifyReply) {
    const {id} = req.query
    const message = await PostgresConnection.runQuery(`SELECT * FROM messages WHERE id = '${id}'`)
    reply.status(200).send({message: "Message fetched", fetched_message: message[0]})
}

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