import { FastifyReply, FastifyRequest } from "fastify";
import { idRequest, rulesAndPostsRequest } from "../types/requestTypes";
import { insertPost, updatePost } from "../repository";
import postgresConnection from "../db";
import PostgresConnection from "../db";
import { PostDatabaseModel } from "../types/databaseModelTypes";

export async function getAllPosts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const text = `SELECT * FROM posts ORDER BY updated_at DESC`;
    const allPosts = await postgresConnection.runQuery(text);
    if (!allPosts || allPosts.length === 0) {
      reply.status(404).send({ message: "No posts found." });
    }
    reply
      .status(200)
      .send({ message: "posts fetched", posts: allPosts });
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
    reply.status(400).send({ message: "Missing parameters." });
  }
  const text = `SELECT * FROM posts WHERE id = $1`;
  const values = [id];
  const post = await postgresConnection.runQuery(text, values);
  if (!post || post.length === 0) {
    reply.status(404).send({ message: `No post found with id: ${id}` });
  }
  reply
    .status(200)
    .send({ message: "post fetched", post: post[0] });
}

export async function createPost(
  req: FastifyRequest<{ Body: rulesAndPostsRequest }>,
  reply: FastifyReply
) {
  try {
    if (!req.body.title || !req.body.description) {
      reply.status(400).send({ message: "Missing required fields." });
    }
    const newPost = {
      id: crypto.randomUUID(),
      title: req.body.title,
      description: req.body.description,
    };
    await insertPost(newPost);
    const text = `SELECT * FROM posts WHERE id = $1`;
    const values = [newPost.id];
    const created = await postgresConnection.runQuery(text, values);
    if (!created || created.length === 0) {
      return reply.status(404).send({ message: "Error fetching new post." });
    }
    reply
      .status(201)
      .send({ message: "New post created", post: created[0] });
  } catch (err) {
    console.error("Error inserting new post: ", err);
  }
}

export async function updateOnePost(
  req: FastifyRequest<{ Body: rulesAndPostsRequest; Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    let {title, description } = req.body
    if (!id) {
      reply.status(400).send({ message: "Missing parameters." });
    }
    if (!title && !description) {
      reply.status(400).send({ message: "Missing required fields." });
    }
    const text1 = `SELECT * FROM posts WHERE id=$1`
    const values1 = [id]
    const res = await PostgresConnection.runQuery(text1, values1)
    const untouchedPost = res[0] as PostDatabaseModel;
    if(!title) {
      title = untouchedPost.title
    }
    if(!description) {
      description = untouchedPost.description
    }
    const postToUpdate = {
      title: title,
      description: description,
      updated_at: new Date().toISOString(),
    };
    await updatePost(postToUpdate, id);
    const text = `SELECT * FROM posts WHERE id = $1`;
    const values = [id];
    const updatedPost = await postgresConnection.runQuery(text, values);
    if (!updatedPost || updatedPost.length === 0) {
      reply.status(404).send({ message: "Updated post cannot be found." });
    }
    reply
      .status(200)
      .send({ message: "Post updated", updated_post: updatedPost });
  } catch (err) {
    console.error("Error updating post: ", err);
  }
}

export async function deletePost(
  req: FastifyRequest<{ Querystring: idRequest }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.query;
    if (!id) {
      reply.status(400).send({ message: "Missing parameters." });
    }
    await postgresConnection.runQuery(
      `DELETE FROM posts WHERE id = '${id}'`
    );
    reply
      .status(200)
      .send({ message: `Post with id: ${id} was deleted succesfully.` });
  } catch (err) {
    console.error("Error deleting post: ", err);
  }
}
