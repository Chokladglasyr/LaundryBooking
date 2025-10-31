import { useEffect, useState } from "react";
import type { RoomType } from "../store/types";
import axios from "axios";

function AdminRooms() {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [createFormData, setCreateFormData] = useState({
    name: "",
    description: "",
  });
  const [rooms, setRooms] = useState<RoomType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    if (message) {
      const messageTimer = setTimeout(() => {
        setMessage(null);
      }, 4000);
      return () => {
        clearTimeout(messageTimer);
      };
    }
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
  }, [message]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateFormData({ ...createFormData, [name]: value });
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
      const res = await axios.post("/room", createFormData, {
        withCredentials: true,
      });
      setRooms((prev) =>
        prev ? [res.data.room[0], ...prev] : [res.data.room[0]]
      );
      setCreateFormData({ name: "", description: "" });
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to create new room as admin: ", err);
      }
    }
  };
  const updateRoom = async (
    e: React.FormEvent<HTMLFormElement>,
    room_id: string
  ) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/room?id=${room_id}`, formData, {
        withCredentials: true,
      });
      setMessage(res.data.message);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to update room as an admin: ", err);
      }
    }
  };

  const deleteRoom = async (
    e: React.MouseEvent<HTMLButtonElement>,
    room_id: string
  ) => {
    e.preventDefault();
    try {
      await axios.delete(`room?id=${room_id}`, { withCredentials: true });
      setRooms((prev) => prev?.filter((room) => room_id !== room.id) || null);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to delete room as an admin: ", err);
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
            value={createFormData.name}
            placeholder="Namn"
            onChange={handleInput}
          />
          <textarea
            name="description"
            id="description"
            rows={8}
            onChange={handleInput}
            value={createFormData.description}
          ></textarea>
          <button id="create-room" className="primary-btn-green">
            SPARA
          </button>
        </form>
      </article>
      <article className="edit-container">
        {loading && <p>Hämtar tvättstugor...</p>}
        {message && <p>{message}</p>}
        {rooms &&
          rooms.map((room, index) => (
            <form
              key={index}
              id="edit-room-form"
              onSubmit={(e) => updateRoom(e, room.id)}
            >
              <label>{`Redigera ${room.name}`} </label>
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
                <button
                  type="button"
                  onClick={(e) => deleteRoom(e, room.id)}
                  id={`delete-room-${index}`}
                  className="primary-btn-red"
                >
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
