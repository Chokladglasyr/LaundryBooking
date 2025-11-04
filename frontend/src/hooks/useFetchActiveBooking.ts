import axios from "axios";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import type { BookingType, RoomType } from "../store/types";

export const useFetchActiveBooking = () => {
  const [acitveBooking, setActiveBooking] = useState({
    date: "",
    timeslot: "",
    room: "",
  });
  const user = useLoaderData();
  console.log(user)
  const fetchActiveBooking = async () => {
    try {
      const checkForBooking = await axios.get(`booking/health?id=${user.id}`, {
        withCredentials: true,
      });

      if (checkForBooking.status === 409) return;
      const existingBooking = checkForBooking.data.booking[0] as BookingType;
      const bookingRoom = checkForBooking.data.room[0] as RoomType;
      let timeslot = "";
      if (existingBooking.booking_timeslot === "1") {
        timeslot = "8-12";
      } else if (existingBooking.booking_timeslot === "2") {
        timeslot = "12-17";
      } else {
        timeslot = "17-21";
      }
      setActiveBooking({
        date: new Date(existingBooking.booking_date).toLocaleDateString(
          "sv-SE"
        ),
        timeslot: timeslot,
        room: bookingRoom.name,
      });
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          console.log("Fetch was aborted.");
        } else if (!axios.isCancel(err)) {
          console.error("Error: ", err);
        }
      }
    }
  };
  useEffect(() => {
    fetchActiveBooking();
  }, );
  return acitveBooking;
};
