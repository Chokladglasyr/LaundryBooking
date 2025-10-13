import { FastifyReply, FastifyRequest } from "fastify";
import { rulesAndMsgsRequest } from "../types/requestTypes";
import PostgresConnection from "../db";
import { insertRule } from "../repository";

export async function getAllRules(req: FastifyRequest, reply: FastifyReply) {
    const allRules = await PostgresConnection.runQuery(`SELECT * FROM rules;`)
    reply.status(200).send({message: "All rules fetched", rules: allRules})
}

export async function createRule(req: FastifyRequest<{Body: rulesAndMsgsRequest}>, reply: FastifyReply) {
    const newRule = {
        id: crypto.randomUUID(),
        title: req.body.title,
        description: req.body.description
    }

    await insertRule(newRule)
    const created = await PostgresConnection.runQuery(`SELECT * FROM rules WHERE id = '${newRule.id}'`)
    reply.status(201).send({message: "New rule created", created_rule: created[0]})
}
export function updateRule(req:FastifyRequest, reply: FastifyReply) {

}

