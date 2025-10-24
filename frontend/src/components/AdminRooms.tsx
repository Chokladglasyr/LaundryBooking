import { useState } from "react";

function AdminRooms() {
  const [formData, setFormData] = useState({});
  const rooms = [
    {
      id: "1",
      name: "Tvättstuga 1",
      description:
        "1 torkrum, 2 tvättmaskiner och en torktumlare, aojdjadjajsdoj jandöjasöjjfaji aöojjafjfs aojfajsj jaa",
    },
    {
      id: "2",
      name: "Tvättstuga 2",
      description:
        "1 torkrum, 2 tvättmaskiner och en torktumlare, aojdjadjajsdoj jandöjasöjjfaji aöojjafjfs aojfajsj jaa",
    },
    {
      id: "3",
      name: "Tvättstuga 3",
      description:
        "1 torkrum, 2 tvättmaskiner och en torktumlare, aojdjadjajsdoj jandöjasöjjfaji aöojjafjfs aojfajsj jaa",
    },
  ];
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <>
      <article>
        <form action="" id="room-form">
          <label htmlFor="room-form">Ny tvättstuga: </label>
          <input
            className="input-admin"
            type="text"
            name="name"
            id="name"
            placeholder="Namn"
            onChange={handleInput}
          />
          <textarea name="description" id="description" rows={8} onChange={handleInput}></textarea>
          <button id="create-room" className="primary-btn-green">
            SPARA
          </button>
        </form>
      </article>
      <article className="edit-container">
        {rooms.map((room, index) => (
          <form key={index} id="edit-room-form" action="">
            <label htmlFor="edit-room-form">{`Redigera ${room.name}`} </label>
            <input
              className="input-admin"
              type="text"
              name="title"
              id="title"
              value={room.name}
              onChange={handleInput}
            />
            <textarea name="description" id="description" rows={8} value={room.description} onChange={handleInput}>
            </textarea>
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
