import axios from "axios";
import { useEffect, useState } from "react";
import { type User } from "../store/types";

function AdminUsers() {
  const [searchType, setSearchType] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [createFormData, setCreateFormData] = useState({
    name: "",
    email: "",
    apt_nr: "",
    password: "",
    role: false
  });
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState<User[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      const messageTimer = setTimeout(() => {
        setMessage(null);
      }, 1000);
      return () => {
        clearTimeout(messageTimer);
      };
    }
  }, [message]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setCreateFormData({ ...createFormData, [name]: e.target.checked });
    }else {
      setCreateFormData({ ...createFormData, [name]: value });

    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUsers((prev) =>
      prev
        ? prev.map((user, i) =>
            i === index ? { ...user, [name]: value } : user
          )
        : null
    );
    setFormData({ ...formData, [name]: value });
  };

  const fetchUsers = async (
    e: React.FormEvent<HTMLFormElement>,
    search: string,
    column: string
  ) => {
    e.preventDefault();
    if (column === "") {
      setMessage("Du behöver välja namn, email eller lägenhetesnummer.");
    }
    try {
      const res = await axios.get(`/search?name=${search}&column=${column}`, {
        withCredentials: true,
      });
      console.log(res.data);
      setUsers(res.data.users);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setMessage("Hittade inga boende.");
      }
      if (err instanceof Error) {
        console.error("Failed to fetch users for admin: ", err);
      }
    }
  };

  const fetchAllUsers = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      const res = await axios.get("/users", { withCredentials: true });
      console.log(res.data);
      if (!res.data.users) throw new Error("No users found");
      setUsers(res.data.users);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to fetch all users: ", err);
      }
    }
  };

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const res = await axios.post("/user", createFormData, {
        withCredentials: true,
      });
      if (res.status === 201) {
        setMessage("Ny användare skapad!");
      }
      setCreateFormData({ name: "", email: "", apt_nr: "", password: "", role: false });
      setUsers(null)
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to create new user as an admin: ", err);
      }
    }
  };

  const updateUser = async (
    e: React.FormEvent<HTMLFormElement>,
    user_id: string
  ) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/user?id=${user_id}`, formData, {
        withCredentials: true,
      });

      if(res.data.message.includes('updated')) {
        setMessage('Sparad, listan är uppdaterad, sök på nytt.')
      }
      setUsers(null)
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to update user as an admin: ", err);
      }
    }
  };

  const deleteUser = async (
    e: React.MouseEvent<HTMLButtonElement>,
    user_id: string
  ) => {
    e.preventDefault()
    try {
      const res = await axios.delete(`/user?id=${user_id}`, {
        withCredentials: true,
      });
      setUsers((prev) => prev?.filter((user) => user_id !== user.id) || null)
      if(res.data.message.includes('deleted')) {
        setMessage('Användare borttagen.')
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to delete user as an admin: ", err);
      }
    }
  };

  return (
    <>
      <article>
        <form onSubmit={createUser} id="user-form">
          <label htmlFor="user-form">Ny boende: </label>
          <input
            className="input-admin"
            type="text"
            name="name"
            id="name"
            placeholder="Namn"
            value={createFormData.name}
            required
            onChange={handleInput}
          />
          <input
            className="input-admin"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={createFormData.email}
            required
            onChange={handleInput}
          />
          <input
            className="input-admin"
            type="text"
            name="apt_nr"
            id="apt_nr"
            placeholder="Lägenhetsnummer"
            value={createFormData.apt_nr}
            required
            onChange={handleInput}
          />
          <input
            className="input-admin"
            type="password"
            name="password"
            id="password"
            placeholder="Lösenord"
            value={createFormData.password}
            required
            onChange={handleInput}
          />
          <div>
            <p>är en admin</p>
            <input
              type="checkbox"
              name="role"
              id="role"
              checked={createFormData.role}
              onChange={handleInput}
            />
          </div>
          <button id="create-user" className="primary-btn-green">
            SPARA
          </button>
        </form>
      </article>
      <article className="edit-container">
        <div>
          <p>Sök efter:</p>
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
        </div>
        <form onSubmit={(e) => fetchUsers(e, searchWord, searchType)}>
          <input
            type="text"
            placeholder="Sökterm"
            onChange={(e) => setSearchWord(e.target.value)}
            required
          />
          <button className="primary-btn-booking">SÖK</button>
          <button
            onClick={fetchAllUsers}
            type="button"
            className="primary-btn-booking"
          >
            VISA ALLA
          </button>
          {message && <p className="message">{message}</p>}
        </form>
        {message && <p>{message}</p>}
        {users &&
          users.map((user, index) => (
            <form
              key={index}
              id={`edit-user-form-${index}`}
              onSubmit={(e) => updateUser(e, user.id)}
            >
              <label htmlFor="edit-user-form">
                {`Redigera boende ${index + 1}`}
              </label>
              <input
                className="input-admin"
                type="text"
                name="name"
                id={`name-${index}`}
                value={user.name}
                onChange={(e) => handleInputChange(e, index)}
              />
              <input
                className="input-admin"
                type="email"
                name="email"
                id={`email-${index}`}
                value={user.email}
                onChange={(e) => handleInputChange(e, index)}
              />
              <input
                className="input-admin"
                type="text"
                name="apt_nr"
                id={`apt_nr-${index}`}
                value={user.apt_nr}
                onChange={(e) => handleInputChange(e, index)}
              />

              <div className="btn-container">
                <button id={`edit-user-${index}`} className="primary-btn-green">
                  SPARA
                </button>
                <button onClick={(e) =>deleteUser(e, user.id)} type="button" id={`delete-user-${index}`} className="primary-btn-red">
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
