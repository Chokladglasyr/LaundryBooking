import { AsyncTask, SimpleIntervalJob } from "toad-scheduler";
import PostgresConnection from "./db";

const cleanUpBookings = new AsyncTask(
  "delete bookings from db",
  async () => {
    try {
      const text = `DELETE FROM bookings WHERE created_at <= (CURRENT_DATE - INTERVAL '60 days')`;
      await PostgresConnection.runQuery(text);
      console.log("Old bookings-data deleted");
    } catch (err) {
        console.error("Error deleting old bookings-data.")
    }
  },
  (err: Error) => {
    console.error("Error with bookings task: ", err)
  }
  
);
export const cleanUpBooking = new SimpleIntervalJob({days: 7}, cleanUpBookings)

const cleanUpResets = new AsyncTask(
    "delete reset requests",
    async () => {
        try{
            const text = `DELETE FROM resets WHERE created_at <= (CURRENT_DATE - INTERVAL '7 days')`
            await PostgresConnection.runQuery(text)
            console.log("Old reset requests deleted")
        } catch( err) {
            console.error("Error deleting old reset requests: ", err)
        }
    },
    (err: Error) => {
        console.error("Error with reset task: ", err)
    }
)
export const cleanUpReset = new SimpleIntervalJob({days: 2}, cleanUpResets)