import { useState } from "react";

function AdminUsers() {
  const [searchType, setSearchType] = useState("");
  const [formData, setFormData] = useState({});
  const users = [
    {
      id: "1",
      name: "Ida",
      email: "ida@ida.com",
      apt_nr: "1205",
    },
    {
      id: "2",
      name: "Aras",
      email: "ida@ida.com",
      apt_nr: "1205",
    },
    {
      id: "3",
      name: "Aylin",
      email: "ida@ida.com",
      apt_nr: "1205",
    },
    {
      id: "4",
      name: "Cassandra",
      email: "ida@ida.com",
      apt_nr: "1205",
    },
    {
      id: "5",
      name: "Andrea",
      email: "ida@ida.com",
      apt_nr: "1205",
    },
    {
      id: "6",
      name: "Sara",
      email: "ida@ida.com",
      apt_nr: "1205",
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
        <form action="" id="user-form">
          <label htmlFor="user-form">Ny regel: </label>
          <input
            className="input-admin"
            type="text"
            name="name"
            id="name"
            placeholder="Namn"
            onChange={handleInput}
          />
          <input
            className="input-admin"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={handleInput}
          />
          <input
            className="input-admin"
            type="text"
            name="apt_nr"
            id="apt_nr"
            placeholder="Lägenhetsnummer"
            onChange={handleInput}
          />
          <input
            className="input-admin"
            type="password"
            name="password"
            id="password"
            placeholder="Lösenord"
            onChange={handleInput}
          />

          <button id="create-user" className="primary-btn-green">
            SPARA
          </button>
        </form>
      </article>
      <form action="">
        <select
          name="users"
          id="users"
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="">Välj</option>
          <option value="name">Namn</option>
          <option value="email">Email</option>
          <option value="apt_nr">Lägenhetsnummer</option>
        </select>
        <input
          type={searchType === "email" ? "email" : "text"}
          placeholder="Sökterm"
          onChange={handleInput}
        />
        <button className="primary-btn-booking">SÖK</button>
      </form>
      <article className="edit-container">
        {users.map((user, index) => (
          <form key={index} id={`edit-user-form-${index}`} action="">
            <label htmlFor="edit-user-form">
              {`Redigera boende ${index + 1}`}
            </label>
            <input
              className="input-admin"
              type="text"
              name="name"
              id={`name-${index}`}
              value={user.name}
              onChange={handleInput}
            />
            <input
              className="input-admin"
              type="email"
              name="email"
              id={`email-${index}`}
              value={user.email}
              onChange={handleInput}
            />
            <input
              className="input-admin"
              type="text"
              name="apt_nr"
              id={`apt_nr-${index}`}
              value={user.apt_nr}
              onChange={handleInput}
            />

            <div className="btn-container">
              <button id={`edit-user-${index}`} className="primary-btn-green">
                SPARA
              </button>
              <button id={`delete-user-${index}`} className="primary-btn-red">
                RADERA
              </button>
            </div>
          </form>
        ))}
      </article>
    </>
  );
}
export default AdminUsers;
