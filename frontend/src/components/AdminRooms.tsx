import { useEffect, useState } from "react";
import type { RoomType } from "../store/types";
import axios from "axios";

function AdminRooms() {
  const [formData, setFormData] = useState({});
  const [rooms, setRooms] = useState<RoomType[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    async function getRooms() {
      try {
        const res = await axios.get("/rooms", { withCredentials: true });
        if (!res.data.rooms) throw new Error("No rooms found");
        if (!cancel) {
          setRooms(res.data.rooms);
          setLoading(false);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("Failed to fetch rooms for admin: ", err);
        }
      }
    }
    getRooms();
    return () => {
      cancel = true;
    };
  }, []);
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setRooms((prev) =>
      prev
        ? prev.map((room, i) =>
            i === index ? { ...room, [name]: value } : room
          )
        : null
    );
    setFormData({ ...formData, [name]: value });
  };
  const createRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("/room", formData, {
        withCredentials: true,
      });
      console.log(res.data);
      // setRooms((prev) => (prev ? [res.data.room, ...prev] : [res.data.room]));
      setFormData({});
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to create new room as admin: ", err);
      }
    }
  };
  return (
    <>
      <article>
        <form onSubmit={createRoom} id="room-form">
          <label htmlFor="room-form">Ny tvättstuga: </label>
          <input
            className="input-admin"
            type="text"
            name="name"
            id="name"
            placeholder="Namn"
            onChange={handleInput}
          />
          <textarea
            name="description"
            id="description"
            rows={8}
            onChange={handleInput}
          ></textarea>
          <button id="create-room" className="primary-btn-green">
            SPARA
          </button>
        </form>
      </article>
      <article className="edit-container">
        {loading && <p>Hämtar tvättstugor...</p>}
        {rooms &&
          rooms.map((room, index) => (
            <form key={index} id="edit-room-form" action="">
              <label htmlFor="edit-room-form">{`Redigera ${room.name}`} </label>
              <input
                className="input-admin"
                type="text"
                name="name"
                id={`name-${index}`}
                value={room.name}
                onChange={(e) => handleInputChange(e, index)}
              />
              <textarea
                name="description"
                id={`description-${index}`}
                rows={8}
                value={room.description}
                onChange={(e) => handleInputChange(e, index)}
              ></textarea>
              <div className="btn-container">
                <button id={`edit-room-${index}`} className="primary-btn-green">
                  SPARA
                </button>
                <button id={`delete-room-${index}`} className="primary-btn-red">
                  RADERA
                </button>
              </div>
            </form>
          ))}
      </article>
    </>
  );
}
export default AdminRooms;
