import { FastifyReply, FastifyRequest } from "fastify";
import { idRequest, rulesAndMsgsRequest } from "../types/requestTypes";
import { insertMessage, updateMessage } from "../repository";
import PostgresConnection from "../db";
import { MessageUpdateModel } from "../types/databaseModelTypes";

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

export async function updateOneMessage(req: FastifyRequest<{Body: rulesAndMsgsRequest, Querystring: idRequest}>, reply: FastifyReply) {
    const {id} = req.query
    const messageToUpdate = {
        title: req.body.title,
        description: req.body.description,
        updated_at: new Date().toISOString()
    }
    await updateMessage(messageToUpdate, id)
    const updatedMessage = await PostgresConnection.runQuery(`SELECT * FROM messages WHERE id = '${id}'`)
    reply.status(200).send({message: "Message updated", updated_message: updatedMessage})
}

export async function deleteMessage(req: FastifyRequest<{Querystring: idRequest}>, reply: FastifyReply) {
    const {id} = req.query
    await PostgresConnection.runQuery(`DELETE FROM messages WHERE id = '${id}'`)
    reply.status(200).send({message: `Message with id: ${id} was deleted succesfully.`})
}