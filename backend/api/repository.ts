import { postgres } from "bun";
import PostgresConnection from "./db";
import { UserDatabaseModel, UserUpdateModel } from "./types/authTypes";
import {
  BookingDatabaseModel,
  PostDatabaseModel,
  PostUpdateModel,
  RoomDatabaseModel,
  RoomUpdateModel,
  RuleDatabaseModel,
  RuleUpdateModel,
} from "./types/databaseModelTypes";

export async function saveUser(user: UserDatabaseModel) {
  try {
    const { id, name, email, password, apt_nr, role } = user;
    if (!role) {
      const text = `INSERT INTO users (id, name, email, password, apt_nr) VALUES ($1, $2, $3, $4, $5)`;
      const values = [id, name, email, password, apt_nr];
      await PostgresConnection.runQuery(text, values);
    } else {
      const text = `INSERT INTO users (id, name, email, password, apt_nr, role) VALUES ($1, $2, $3, $4, $5, $6)`;
      const values = [id, name, email, password, apt_nr, role];
      await PostgresConnection.runQuery(text, values);
    }
  } catch (err) {
    console.error("Error while inserting user: ", err);
  }
}
export async function updateUser(user: UserUpdateModel, id: string) {
  try {
    const { name, email, apt_nr, updated_at } = user;
    const text = `UPDATE users SET name = $1, email = $2, apt_nr = $3, updated_at = $4 WHERE id = $5`;
    const values = [name, email, apt_nr, updated_at, id];
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
export async function insertPost(post: PostDatabaseModel) {
  try {
    const { id, title, description } = post;
    const text = `INSERT INTO posts (id, title, description) VALUES($1, $2, $3)`;
    const values = [id, title, description];
    await PostgresConnection.runQuery(text, values);
  } catch (err) {
    console.error("Error while inserting new post: ", err);
  }
}
export async function updatePost(post: PostUpdateModel, id: string) {
  try {
    const { title, description, updated_at } = post;
    const text = `UPDATE posts SET title = $1, description = $2, updated_at = $3 WHERE id =$4`;
    const values = [title, description, updated_at, id];
    await PostgresConnection.runQuery(text, values);
  } catch (err) {
    console.error("Error updating post: ", err);
    throw new Error("Could not update post.");
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
export async function checkForBooking(
  user_id: string,
  room_id: string,
  booking_timeslot: string,
  booking_date: string
) {
  try {
    if (!user_id) {
      throw new Error("Missing user_id.");
    }
    const text = `SELECT * FROM bookings WHERE user_id = $1 AND booking_date >= CURRENT_DATE`;
    const values = [user_id];
    const existingBooking = await PostgresConnection.runQuery(text, values);

    if (!existingBooking || existingBooking.length === 0) {
      const text2 = `SELECT * FROM bookings WHERE room_id = $1 AND booking_timeslot = $2 AND booking_date = $3`;
      const values2 = [room_id, booking_timeslot, new Date(booking_date)];
      const existingBooking2 = await PostgresConnection.runQuery(
        text2,
        values2
      );

      if (!existingBooking2 || existingBooking2.length === 0) {
        console.log("finns inget bokat");
        return { status: 200 };
      } else {
        console.log("tiden är bokad");
        return { post: "Timeslot already booked.", status: 409 };
      }
    } else {
      console.log("user redan bokad");
      return { post: "User already has an active booking.", status: 409 };
    }
  } catch (err) {
    console.error("Error checking for existing booking: ", err);
  }
}
