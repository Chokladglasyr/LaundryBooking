import { FastifyReply, FastifyRequest } from "fastify";
import { idRequest, rulesAndMsgsRequest } from "../types/requestTypes";
import { insertMessage, updateMessage } from "../repository";
import PostgresConnection from "../db";
import { MessageUpdateModel } from "../types/databaseModelTypes";

export async function getAllMessages(req: FastifyRequest, reply: FastifyReply) {
    const allMessages = await PostgresConnection.runQuery(`SELECT * FROM messages;`)
    if(!allMessages || allMessages.length === 0) {
        reply.status(404).send({message: "No messages found"})
    }
    reply.status(200).send({message: "Messages fetched", messages: allMessages})
}

export async function getOneMessage(req: FastifyRequest<{Querystring: idRequest}>, reply: FastifyReply) {
    const {id} = req.query
    if(!id) {
        reply.status(400).send({message: "Missing parameters."})
    }
    const message = await PostgresConnection.runQuery(`SELECT * FROM messages WHERE id = '${id}'`)
    if(!message || message.length === 0) {
        reply.status(404).send({message: `No message found with id: ${id}`})
    }
    reply.status(200).send({message: "Message fetched", fetched_message: message[0]})
}

export async function createMessage(req: FastifyRequest<{Body: rulesAndMsgsRequest}>, reply: FastifyReply) {
    if(!req.body) {
        reply.status(400).send({message: "No body found"})
    }
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
    if(!id) {
        reply.status(400).send({message: "Missing parameters."})
    }
    if(!req.body) {
        reply.status(400).send({message: "No body found."})
    }
    const messageToUpdate = {
        title: req.body.title,
        description: req.body.description,
        updated_at: new Date().toISOString()
    }
    await updateMessage(messageToUpdate, id)
    const updatedMessage = await PostgresConnection.runQuery(`SELECT * FROM messages WHERE id = '${id}'`)
    if(!updatedMessage || updatedMessage.length === 0) {
        reply.status(404).send({message: "Updated message cannot be found."})
    }
    reply.status(200).send({message: "Message updated", updated_message: updatedMessage})
}

export async function deleteMessage(req: FastifyRequest<{Querystring: idRequest}>, reply: FastifyReply) {
    const {id} = req.query
    if(!id) {
        reply.status(400).send({message: "Missing parameters."})
    }
    await PostgresConnection.runQuery(`DELETE FROM messages WHERE id = '${id}'`)
    reply.status(200).send({message: `Message with id: ${id} was deleted succesfully.`})
}