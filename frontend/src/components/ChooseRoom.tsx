import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RoomType } from "../store/types";
import axios from "axios";

function ChooseRoom() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [formData, setFormData] = useState({});
  const [selected, setSelected] = useState<string>()

  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false
    async function getRooms() {
      try {
        const res = await axios.get("/rooms", { withCredentials: true });
        if(!cancel) {
          setRooms(res.data.rooms);
        }
      } catch (err) {
        console.error("Failed to fetch rooms: ", err);
      }
    }
    getRooms();
    return () => {
      cancel = true
    }
  }, []);

  const goToBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/home/booking?id=${formData}`);
  };

  const handleInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(value);
    setSelected(value)

  };

  return (
    <>
      <form className="booking-form" onSubmit={goToBooking}>
        <label htmlFor="room">Välj tvättstuga:</label>
        <select value={selected} name="room" id="room" onChange={handleInput} required>
          <option value="" style={{ display: "none" }}>Tvättstuga</option>
          {rooms.map((room, index) => (
            <option key={index} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
        <button className="primary-btn-booking" id="book">
          {window.location.pathname.includes("booking") ? "BYT" : "BOKA"}
        </button>
      </form>
    </>
  );
}
export default ChooseRoom;
