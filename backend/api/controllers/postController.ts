import { FastifyReply, FastifyRequest } from "fastify";
import { idRequest, rulesAndMsgsRequest } from "../types/requestTypes";
import { insertpost, updatepost } from "../repository";
import postgresConnection from "../db";

export async function getAllposts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const text = `SELECT * FROM posts`;
    const allposts = await postgresConnection.runQuery(text);
    if (!allposts || allposts.length === 0) {
      reply.status(404).send({ post: "No posts found." });
    }
    reply
      .status(200)
      .send({ post: "posts fetched", posts: allposts });
  } catch (err) {
    console.error("Error fetching posts.");
  }
}

export async function getOnePost(
  req: FastifyRequest<{ Querystring: idRequest }>,
  reply: FastifyReply
) {
  const { id } = req.query;
  if (!id) {
    reply.status(400).send({ post: "Missing parameters." });
  }
  const text = `SELECT * FROM posts WHERE id = $1`;
  const values = [id];
  const post = await postgresConnection.runQuery(text, values);
  if (!post || post.length === 0) {
    reply.status(404).send({ post: `No post found with id: ${id}` });
  }
  reply
    .status(200)
    .send({ post: "post fetched", fetched_post: post[0] });
}

export async function createPost(
  req: FastifyRequest<{ Body: rulesAndMsgsRequest }>,
  reply: FastifyReply
) {
  try {
    if (!req.body.title || !req.body.description) {
      reply.status(400).send({ post: "Missing required fields." });
    }
    const newMsg = {
      id: crypto.randomUUID(),
      title: req.body.title,
      description: req.body.description,
    };
    await insertpost(newMsg);
    const text = `SELECT * FROM posts WHERE id = $1`;
    const values = [newMsg.id];
    const created = await postgresConnection.runQuery(text, values);
    if (!created || created.length === 0) {
      return reply.status(404).send({ post: "Error fetching new post." });
    }
    reply
      .status(201)
      .send({ post: "New post created", created_post: created[0] });
  } catch (err) {
    console.error("Error inserting new post: ", err);
  }
}

export async function updateOnepost(
  req: FastifyRequest<{ Body: rulesAndMsgsRequest; Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    if (!id) {
      reply.status(400).send({ post: "Missing parameters." });
    }
    if (!req.body.title || !req.body.description) {
      reply.status(400).send({ post: "Missing required fields." });
    }
    const postToUpdate = {
      title: req.body.title,
      description: req.body.description,
      updated_at: new Date().toISOString(),
    };
    await updatepost(postToUpdate, id);
    const text = `SELECT * FROM posts WHERE id = $1`;
    const values = [id];
    const updatedpost = await postgresConnection.runQuery(text, values);
    if (!updatedpost || updatedpost.length === 0) {
      reply.status(404).send({ post: "Updated post cannot be found." });
    }
    reply
      .status(200)
      .send({ post: "post updated", updated_post: updatedpost });
  } catch (err) {
    console.error("Error updating post: ", err);
  }
}

export async function deletepost(
  req: FastifyRequest<{ Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    if (!id) {
      reply.status(400).send({ post: "Missing parameters." });
    }
    await postgresConnection.runQuery(
      `DELETE FROM posts WHERE id = '${id}'`
    );
    reply
      .status(200)
      .send({ post: `post with id: ${id} was deleted succesfully.` });
  } catch (err) {
    console.error("Error deleting post: ", err);
  }
}
