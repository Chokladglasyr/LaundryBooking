import { useEffect, useState } from "react";
import { type Rooms } from "../store/types";
import Calendar from "./Calendar";
import ChooseRoom from "./ChooseRoom";
import axios from "axios";

function Booking() {
  const [room, setRoom] = useState<Rooms | null>(null);
  const params = new URLSearchParams(document.location.search);
  const room_id = params.get("id");
  useEffect(() => {
    async function getRoom() {
        if(!room_id) return
      const res = await axios.get(`room?id=${room_id}`, {
          withCredentials: true,
        });
        console.log(res.data.room[0])
      setRoom(res.data.room[0]);
    }
    getRoom();
  },[room_id]);
  console.log(room?.description)
  return (
    <>
      <div className="landing" id="booking">
        <div className="description-container">
          <article className="room-details">
            <h1>{room?.name}</h1>
            <p>{room?.description}</p>
          </article>
          <ChooseRoom />
        </div>

        <Calendar />
      </div>
    </>
  );
}
export default Booking;
