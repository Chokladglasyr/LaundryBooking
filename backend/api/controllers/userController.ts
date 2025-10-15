import { FastifyReply, FastifyRequest } from "fastify";
import PostgresConnection from "../db";
import { idRequest } from "../types/requestTypes";
import { UserUpdateModel } from "../types/authTypes";
import { updateUser } from "../repository";

export async function getAllUsers(req: FastifyRequest, reply: FastifyReply) {
  try {
    const text = `SELECT * FROM users`;
    const allUsers = await PostgresConnection.runQuery(text);
    reply.status(200).send({ message: "Users fetched", users: allUsers });
  } catch (err) {
    console.error("Error fetching users: ", err);
  }
}

export async function getOneUser(
  req: FastifyRequest<{ Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    if (!id) {
      return reply.status(400).send({ message: "Missing parameters." });
    }
    const text = `SELECT * FROM users WHERE id = $1`;
    const values = [id];
    const user = await PostgresConnection.runQuery(text, values);
    if (!user || user.length === 0) {
      return reply
        .status(404)
        .send({ message: `No user found with id: ${id}` });
    }
    reply.status(200).send({ message: "User fetched", user: user });
  } catch (err) {
    console.error("Error fetching user: ", err);
  }
}

export async function updateOneUser(
  req: FastifyRequest<{ Querystring: idRequest; Body: UserUpdateModel }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    if (!id) {
      return reply.status(400).send({ message: "Missing parameters." });
    }
    if (!req.body.email || !req.body.name || !req.body.password) {
      return reply.status(400).send({ message: "Missing required fields" });
    }
    const userToUpdate = {
      name: req.body.name,
      email: req.body.email,
      password: await Bun.password.hash(req.body.password, {
        algorithm: "bcrypt",
        cost: 10,
      }),
      updated_at: new Date().toISOString(),
    };
    await updateUser(userToUpdate, id);
    const text = `SELECT * FROM users WHERE id = $1`;
    const values = [id];
    const updatedUser = await PostgresConnection.runQuery(text, values);
    if (!updatedUser || updatedUser.length === 0) {
      return reply
        .status(404)
        .send({ message: "Error fetching updated user." });
    }
    reply.status(200).send({ message: "User updated", updatedUser });
  } catch (err) {
    console.error("Error updating user: ", err);
  }
}

export async function deleteUser(
  req: FastifyRequest<{ Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    if (!id) {
      return reply.status(400).send({ message: "Missing parameters." });
    }
    const text = `DELETE FROM users WHERE id = $1`;
    const values = [id];
    await PostgresConnection.runQuery(text, values);
    reply.status(200).send({ message: `User with id: ${id} is deleted.` });
  } catch (err) {
    console.error("Error deleting user: ", err);
  }
}
