import PostgresConnection from "./db";
import { UserDatabaseModel, UserUpdateModel } from "./types/authTypes";
import {
  MessageDatabaseModel,
  MessageUpdateModel,
  RuleDatabaseModel,
  RuleUpdateModel,
} from "./types/databaseModelTypes";

export async function saveUser(user: UserDatabaseModel) {
  try {
    const { id, name, email, password, apt_nr } = user;
    const text = `INSERT INTE users (id, name, email, password, apt_nr)`;
    const values = [id, name, email, password, apt_nr];
    await PostgresConnection.runQuery(text, values);
  } catch (err) {
    console.error("Error while inserting user: ", err);
  }
}
export async function updateUser(user: UserUpdateModel, id: string) {
  try {
    const { name, email, password, updated_at } = user;
    const text = `UPDATE users SET name = $1, email = $2, password = $3, updated_at = $4 WHERE id = $5`;
    const values = [name, email, password, updated_at, id];
    await PostgresConnection.runQuery(text, values);
  } catch (err) {
    console.error("Error while updating user: ", err);
  }
}
export async function insertRule(rule: RuleDatabaseModel) {
  try {
    const { id, title, description } = rule;
    const text = `INSERT INTO rules (id, title, description) VALUES($1, $2, $3)`;
    const values = [id, title, description];
    await PostgresConnection.runQuery(text, values);
  } catch (err) {
    console.error("Error while inserting new rule: ", err);
  }
}
export async function updateRule(rule: RuleUpdateModel, id: string) {
  try {
    const { title, description, updated_at } = rule;
    const text = `UPDATE rules SET title = $1, description = $2, updated_at = $3 WHERE id = $4`;
    const values = [title, description, updated_at, id];
    await PostgresConnection.runQuery(text, values);
  } catch (err) {
    throw new Error("Could not update rule.");
  }
}
export async function insertMessage(message: MessageDatabaseModel) {
  try {
    const { id, title, description } = message;
    const text = `INSERT INTO messages (id, title, description) VALUES($1, $2, $3)`;
    const values = [id, title, description];
    await PostgresConnection.runQuery(text, values);
  } catch (err) {
    console.error("Error while inserting new message: ", err);
  }
}
export async function updateMessage(message: MessageUpdateModel, id: string) {
  try {
    const { title, description, updated_at } = message;
    const text = `UPDATE messages SET title = $1, description = $2, updated_at = $3 WHERE id =$4`;
    const values = [title, description, updated_at, id];
    await PostgresConnection.runQuery(text, values);
  } catch (err) {
    console.error("Error updating message: ", err);
    throw new Error("Could not update message.");
  }
}
