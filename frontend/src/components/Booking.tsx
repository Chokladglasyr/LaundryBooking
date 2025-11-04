import { useEffect, useState } from "react";
import { type RoomType } from "../store/types";
import Calendar from "./Calendar";
import ChooseRoom from "./ChooseRoom";
import axios from "axios";
import { useLoaderData, useSearchParams } from "react-router-dom";

function Booking() {
  const [room, setRoom] = useState<RoomType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeBooking, setActiveBooking] = useState<string>('Du har ingen aktiv bokning.')
  const [params] = useSearchParams();
  const user = useLoaderData()
  const room_id = params.get("id");
console.log(user)
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
  }, [room_id]);

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
          <p>{activeBooking}</p>
        </div>
        <Calendar room_id={room_id} />
      </div>
    </>
  );
}
export default Booking;
