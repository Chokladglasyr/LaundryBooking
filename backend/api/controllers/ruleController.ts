import { FastifyReply, FastifyRequest } from "fastify";
import { idRequest, rulesAndMsgsRequest } from "../types/requestTypes";
import PostgresConnection from "../db";
import { insertRule, updateRule } from "../repository";

export async function getAllRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const text = `SELECT * FROM rules`;
    const allRules = await PostgresConnection.runQuery(text);
    if (!allRules || allRules.length === 0) {
      return reply.status(404).send({ message: "No rules found." });
    }
    reply.status(200).send({ message: "All rules fetched", rules: allRules });
  } catch (err) {
    console.error("Error fetching rules: ", err);
  }
}

export async function getOneRule(
  req: FastifyRequest<{ Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    if (!id) {
      return reply.status(400).send({ message: "Missing parameters." });
    }
    const text = `SELECT * FROM rules WHERE id = $1`;
    const values = [id];
    const rule = await PostgresConnection.runQuery(text, values);
    if (!rule || rule.length === 0) {
      return reply.status(400).send({ message: "No rule found." });
    }
    reply.status(200).send({ message: "Rule fetched", rule: rule[0] });
  } catch (err) {
    console.error("Error when fetching rule: ", err);
  }
}

export async function createRule(
  req: FastifyRequest<{ Body: rulesAndMsgsRequest }>,
  reply: FastifyReply
) {
  try {
    if (!req.body.title || !req.body.description) {
      return reply.status(400).send({ message: "Missing required fields." });
    }
    const newRule = {
      id: crypto.randomUUID(),
      title: req.body.title,
      description: req.body.description,
    };
    await insertRule(newRule);
    const text = `SELECT * FROM rules WHERE id = $id`;
    const values = [newRule.id];
    const created = await PostgresConnection.runQuery(text, values);
    if (!created) {
      return reply.status(404).send({ message: "Error fetching new rule" });
    }
    reply
      .status(201)
      .send({ message: "New rule created", created_rule: created[0] });
  } catch (err) {
    console.error("Error inserting new rule: ", err);
  }
}

export async function updateOneRule(
  req: FastifyRequest<{ Body: rulesAndMsgsRequest; Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    if (!id) {
      return reply.status(400).send({ message: "Missing parameters." });
    }
    if (!req.body.description || !req.body.title) {
      return reply.status(400).send({ message: "Missing required fields." });
    }
    const ruleToUpdate = {
      title: req.body.title,
      description: req.body.description,
      updated_at: new Date().toISOString(),
    };
    await updateRule(ruleToUpdate, id);
    const text = `SELECT * FROM rules WHERE id = $1`;
    const values = [id];
    const updatedRule = await PostgresConnection.runQuery(text, values);
    if (!updatedRule || updatedRule.length === 0) {
      return reply
        .status(404)
        .send({ message: "Error fetching updated rule." });
    }
    reply.status(200).send({ message: "Rule updated", rule: updatedRule });
  } catch (err) {
    console.error("Error updating rule: ", err);
  }
}

export async function deleteRule(
  req: FastifyRequest<{ Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    if (!id) {
      return reply.status(400).send({ message: "Missing parameters." });
    }
    const text = `DELETE FROM rules WHERE id = $1`;
    const values = [id];
    await PostgresConnection.runQuery(text, values);
    reply.status(200).send({ message: `Rule with id: ${id} deleted` });
  } catch (err) {
    console.error("Error deleting rule: ", err);
  }
}
