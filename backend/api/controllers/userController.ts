import { FastifyReply, FastifyRequest } from "fastify";
import PostgresConnection from "../db";
import { idRequest, searchRequest, userRequest } from "../types/requestTypes";
import { TokenPayload, UserUpdateModel } from "../types/authTypes";
import { saveUser, updateUser } from "../repository";

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

export async function createUser(
  req: FastifyRequest<{ Body: userRequest }>,
  reply: FastifyReply
) {
  try {
    if (!req.body) {
      reply.status(400).send({ message: "Missing required fields" });
    }

    const text1 = `SELECT * FROM users WHERE email = $1`;
    const values1 = [req.body.email];
    const existing = await PostgresConnection.runQuery(text1, values1);
    if (existing[0]) {
      return reply
        .status(400)
        .send({ message: "User with email already exists" });
    }
    const { name, email, apt_nr, password, role } = req.body;
    const newUser = {
      id: crypto.randomUUID(),
      name: name,
      email: email,
      password: await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 10,
      }),
      apt_nr: apt_nr,
      role: role,
    };
    await saveUser(newUser);
    const text = `SELECT * FROM users WHERE id=$1`;
    const values = [newUser.id];
    const created = await PostgresConnection.runQuery(text, values);
    if (!created || created.length === 0) {
      return reply.status(404).send({ message: "Error fetching new user" });
    }
    reply
      .status(201)
      .send({
        message: "New user created",
        user: {
          name: created[0].name,
          email: created[0].email,
          apt_nr: created[0].apt_nr,
          role: created[0].role,
        },
      });
  } catch (err) {
    console.error("Error inserting new user: ", err);
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

export async function searchUser(
  req: FastifyRequest<{ Querystring: searchRequest }>,
  reply: FastifyReply
) {
  if (!req.query) {
    return reply.status(400).send({ message: "Missing parameters." });
  }
  const { name, column } = req.query;
  const allowedColumns = ["name", "email", "apt_nr"];
  if (!allowedColumns.includes(column)) {
    return reply
      .status(404)
      .send({ message: `No columns found in database called ${column}` });
  }
  const text = `SELECT * FROM users WHERE ${column} ~* $1`;
  const values = [name];
  const users = await PostgresConnection.runQuery(text, values);
  if (!users || users.length === 0) {
    return reply.status(404).send("No users found.");
  }
  reply.status(200).send({ message: "Users found", users: users });
}

export async function getLoggedIn(req: FastifyRequest, reply: FastifyReply) {
  try {
    const decoded = await req.jwtVerify();
    const token = decoded as TokenPayload;
    const text = `SELECT * FROM users WHERE id=$1`;
    const values = [token.user_id];
    const user = await PostgresConnection.runQuery(text, values);
    if (!user || user.length === 0) {
      return reply.status(404).send({ message: "No logged in user found" });
    }
    return reply
      .status(200)
      .send({ message: "Logged in user found.", user: user });
  } catch (err) {
    console.error("Error fetching logged in user: ", err);
    return reply
      .status(500)
      .send({ message: "Error fetching logged in user: ", err });
  }
}
