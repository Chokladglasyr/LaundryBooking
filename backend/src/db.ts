import { Client } from "pg";

class PostgresConnection {
  private static dbClient: Client;

  private constructor() {}
  static async getDbClient(): Promise<Client> {
    if (!this.dbClient) {
      this.dbClient = new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: 5432,
        database: process.env.DB_DATABASE,
      });
      await this.dbClient.connect();
    }
    return this.dbClient;
  }
  static async initTables() {
    const dbClient = await this.getDbClient();
    const query = `
    CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, 
    name TEXT NOT NULL, 
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users (id) ON DELETE CASCADE,
    room_id TEXT REFERENCES rooms (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS rules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `
    await dbClient.query(query)
    console.log("Tables initialized")
  }
  static async createAdmin() {
    const dbClient = await this.getDbClient()
    const query = `
    INSERT INTO users (id, name, email, password)
    VALUES (1, 'admin', 'admin@admin.com', '$2a$12$UC8e731ozxX4mPIntr5N/.FPY3fZLiJGwq8iF5U5DsOoMQ0QDY1O.')
    ON CONFLICT (email) DO NOTHING;
    `
    await dbClient.query(query)
    console.log("Admin exists")
  }
}
export default PostgresConnection;
