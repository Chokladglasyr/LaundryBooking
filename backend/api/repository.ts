import PostgresConnection from "./db";
import { UserDatabaseModel } from "./types/authTypes";

export async function saveUser(user: UserDatabaseModel) {
    const {id, name, email, password, apt_nr, created_at} = user
    PostgresConnection.runQuery(
        `INSERT INTO users (id, name, email, password, apt_nr, created_at)
        VALUES ('${id}', '${name}', '${email}', '${password}', '${apt_nr}', '${created_at}')`
    )
}
