import { postgres } from "bun";
import PostgresConnection from "./db";
import { UserDatabaseModel, UserUpdateModel } from "./types/authTypes";
import {
  BookingDatabaseModel,
  MessageDatabaseModel,
  MessageUpdateModel,
  RoomDatabaseModel,
  RoomUpdateModel,
  RuleDatabaseModel,
  RuleUpdateModel,
} from "./types/databaseModelTypes";

export async function saveUser(user: UserDatabaseModel) {
  try {
    const { id, name, email, password, apt_nr } = user;
    const text = `INSERT INTO users (id, name, email, password, apt_nr) VALUES ($1, $2, $3, $4, $5)`;
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

export async function insertRoom(room: RoomDatabaseModel) {
  try {
    const { id, name, description } = room;
    const text = `INSERT INTO rooms (id, name, description) VALUES($1, $2, $3);`;
    const values = [id, name, description];
    await PostgresConnection.runQuery(text, values);
  } catch (err) {
    console.error("Error inserting new room: ", err);
  }
}
export async function updateRoom(room: RoomUpdateModel, id: string) {
  try {
    if (!room) {
      throw new Error("Missing room.");
    }
    const { name, description, updated_at } = room;
    const text = `UPDATE rooms SET name = $1, description = $2, updated_at = $3 WHERE id = $4`;
    const values = [name, description, updated_at, id];
    await PostgresConnection.runQuery(text, values);
  } catch (err) {
    console.error("Error updating room: ", err);
  }
}

export async function insertBooking(booking: BookingDatabaseModel) {
  try {
    if (!booking) {
      throw new Error("Missing booking.");
    }
    const { id, user_id, room_id, booking_date, booking_timeslot } = booking;
    const text = `INSERT INTO bookings (id, user_id, room_id, booking_date, booking_timeslot) VALUES($1, $2, $3, $4, $5)`;
    const values = [id, user_id, room_id, booking_date, booking_timeslot];
    await PostgresConnection.runQuery(text, values);
  } catch (err) {
    console.error("Error inserting new booking: ", err);
  }
}
export async function checkForBooking(user_id: string) {
    try{
        if(!user_id) {
            throw new Error("Missing user_id.")
        }
        const text = `SELECT * FROM bookings WHERE user_id = $1 AND booking_date >= CURRENT_DATE`
        const values = [user_id]
        const existingBooking = await PostgresConnection.runQuery(text, values)
        if(!existingBooking || existingBooking.length === 0) {
         return {status: 200}
        } else {
            return {status: 409}
        }
    } catch(err) {
        console.error("Error checking for existing booking: ", err)
    }
}
