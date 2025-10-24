import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ChooseRoom() {
  const rooms = [
    { name: "Tvättstuga 1", id: "1" },
    { name: "Tvättstuga 2", id: "2" },
    { name: "Tvättstuga 3", id: "3" },
  ];

  const [formData, setFormData] = useState({});

  const navigate = useNavigate();

  const goToBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/booking?id=${formData}`);
    location.reload()
};

  const handleInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(value);
  };
  return (
    <>
      <form className="booking-form" onSubmit={goToBooking}>
        <label htmlFor="room">Välj tvättstuga:</label>
        <select name="room" id="room" onChange={handleInput}>
          <option value="">Tvättstuga</option>
          {rooms.map((room, index) => (
            <option key={index} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
        <button className="primary-btn-booking" id="book">
          {window.location.pathname.includes('booking') ? 'BYT' : 'BOKA' }
        </button>
      </form>
    </>
  );
}
export default ChooseRoom;
