import axios from "axios";
import { useEffect, useState } from "react";
import type { User } from "../store/types";

function AdminUsers() {
  const [searchType, setSearchType] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [createFormData, setCreateFormData] = useState({});
  const [users, setUsers] = useState<User[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      const messageTimer = setTimeout(() => {
        setMessage(null);
      }, 4000);
      return () => {
        clearTimeout(messageTimer);
      };
    }
  }, [message]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if(type === "checkbox" && e.target instanceof HTMLInputElement){
      setCreateFormData({...createFormData, [name]: e.target.checked})
    }
    setCreateFormData({ ...createFormData, [name]: value });
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

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    try{

    } catch(err) {
      if (err instanceof Error) {
        console.error("Failed to create new user as an admin: ", err)
      }
    }
  }

  return (
    <>
      <article>
        <form action="" id="user-form">
          <label htmlFor="user-form">Ny boende: </label>
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
          <div>
          <label htmlFor="checkbox">är en admin</label>
          <input type="checkbox" name="role" id="role" onChange={handleInput}/> 

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
        </form>
        {message && <p>{message}</p>}
        {users &&
          users.map((user, index) => (
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
