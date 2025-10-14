import { FastifyReply, FastifyRequest } from "fastify";
import PostgresConnection from "../db";

export async function getAllUsers(req: FastifyRequest, reply: FastifyReply) {
    const allUsers = await PostgresConnection.runQuery(`SELECT * FROM users;`)
    reply.status(200).send({message: "Users fetched", users: allUsers})
}