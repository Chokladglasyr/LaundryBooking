import PostgresConnection from "./db";
import { UserDatabaseModel, UserUpdateModel } from "./types/authTypes";
import { RuleDatabaseModel, RuleUpdateModel } from "./types/databaseModelTypes";
import { idRequest } from "./types/requestTypes";


export async function saveUser(user: UserDatabaseModel) {
  const { id, name, email, password, apt_nr, created_at } = user;
  await PostgresConnection.runQuery(
    `INSERT INTO users (id, name, email, password, apt_nr, created_at)
        VALUES ('${id}', '${name}', '${email}', '${password}', '${apt_nr}', '${created_at}')`
  );
}
export async function updateUser(user: UserUpdateModel, id: string) {
    const {name, email, password, updated_at} = user
    await PostgresConnection.runQuery(
        `UPDATE users SET name = '${name}', email = '${email}', password = '${password}', updated_at = '${updated_at}' WHERE id = '${id}'`
    )
}
export async function insertRule(rule: RuleDatabaseModel) {
  await PostgresConnection.runQuery(
    `INSERT INTO rules (id, title, description) VALUES('${rule.id}', '${rule.title}', '${rule.description}')`
  );
}
export async function updateRule(rule: RuleUpdateModel, id: string) {
    const {title, description, updated_at} = rule
    await PostgresConnection.runQuery(
        `UPDATE rules SET title = '${title}', description = '${description}', updated_at = '${updated_at}' WHERE id = '${id}'`
    )
}
export async function insertMessage(rule: RuleDatabaseModel) {
  await PostgresConnection.runQuery(
    `INSERT INTO messages (id, title, description) VALUES('${rule.id}', '${rule.title}', '${rule.description}')`
  );
}
