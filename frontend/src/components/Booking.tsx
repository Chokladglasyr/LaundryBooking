import { useEffect, useState } from "react";
import { type BookingType, type RoomType } from "../store/types";
import Calendar from "./Calendar";
import ChooseRoom from "./ChooseRoom";
import axios from "axios";
import { useLoaderData, useSearchParams } from "react-router-dom";

function Booking() {
  const [room, setRoom] = useState<RoomType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeBooking, setActiveBooking] = useState({date: '', timeslot: '', room: ''});
  const [params] = useSearchParams();
  const user = useLoaderData();
  const room_id = params.get("id");

  useEffect(() => {
    const controller = new AbortController();
    if (!room_id) return;
    async function getRoom() {
      if (!room_id) return;
      try {
        const res = await axios.get(`room?id=${room_id}`, {
          withCredentials: true,
          signal: controller.signal,
        });
        setRoom(res.data.room[0]);
        const checkForBooking = await axios.get(
          `booking/health?id=${user.id}`,
          { withCredentials: true, signal: controller.signal }
        );

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
        setActiveBooking({date: new Date(existingBooking.booking_date).toLocaleDateString('sv-SE'), timeslot: timeslot, room: bookingRoom.name});
      } catch (err) {
        console.log(err);
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            console.log("Fetch was aborted.");
          } else if (!axios.isCancel(err)) {
            setError(err.message);
          }
        }
      }
    }
    getRoom();
    return () => {
      controller.abort();
    };
  }, [room_id, user.id]);

  return (
    <>
      {error && <p>Error: {error}</p>}
      <div className="landing" id="booking">
        <div className="description-container">
          <article className="room-details">
            <h1>{room?.name}</h1>
            <p>{room?.description}</p>
          </article>
          <ChooseRoom />
          <div>
          {activeBooking.date ? (<><p>Din nästa tid är</p> <div><p>Datum: {activeBooking.date}</p> <p>Tid: {activeBooking.timeslot}</p> <p>Vart: {activeBooking.room}</p></div></>) : (<p>Du har ingen aktiv bokning.</p>)}
          </div>
        </div>
        <Calendar room_id={room_id} />
      </div>
    </>
  );
}
export default Booking;
