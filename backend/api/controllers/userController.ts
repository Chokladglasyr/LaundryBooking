import { FastifyReply, FastifyRequest } from "fastify";
import PostgresConnection from "../db";
import { idRequest, rulesAndMsgsRequest } from "../types/requestTypes";
import { UserDatabaseModel, UserUpdateModel } from "../types/authTypes";
import { updateUser } from "../repository";

export async function getAllUsers(req: FastifyRequest, reply: FastifyReply) {
    const allUsers = await PostgresConnection.runQuery(`SELECT * FROM users;`)
    reply.status(200).send({message: "Users fetched", users: allUsers})
}

export async function getOneUser(req: FastifyRequest<{Querystring: idRequest}>, reply: FastifyReply) {

    const { id } = req.query

    const user = await PostgresConnection.runQuery(`SELECT * FROM users WHERE id = '${id}'`)
    reply.status(200).send({message: "User fetched", user: user})
}

export async function deleteUser(req: FastifyRequest<{Querystring: idRequest}>, reply: FastifyReply) {
    const { id } = req.query

    await PostgresConnection.runQuery(`DELETE FROM users WHERE id = '${id}'`)
    reply.status(200).send({message: `${id} is deleted.`})
}
export async function updateOneUser(req: FastifyRequest<{Querystring:idRequest, Body: UserUpdateModel}>, reply: FastifyReply) {
    const {id} = req.query
    const userToUpdate = {
    name: req.body.name,
    email: req.body.email,
    password: await Bun.password.hash(req.body.password, {
      algorithm: "bcrypt",
      cost: 10,
    }),
    updated_at: new Date().toISOString(),
    }
    await updateUser(userToUpdate, id)
    reply.status(200).send({message: "User updated", userToUpdate})
}