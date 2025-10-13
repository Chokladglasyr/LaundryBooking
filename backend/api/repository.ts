import PostgresConnection from "./db";
import { UserDatabaseModel } from "./types/authTypes";
import { RuleDatabaseModel, rulesRequest } from "./types/requestTypes";

export async function saveUser(user: UserDatabaseModel) {
  const { id, name, email, password, apt_nr, created_at } = user;
  PostgresConnection.runQuery(
    `INSERT INTO users (id, name, email, password, apt_nr, created_at)
        VALUES ('${id}', '${name}', '${email}', '${password}', '${apt_nr}', '${created_at}')`
  );
}

export async function insertRule(rule: RuleDatabaseModel) {
  await PostgresConnection.runQuery(
    `INSERT INTO rules (id, title, description) VALUES('${rule.id}', '${rule.title}', '${rule.description}')`
  );


}
