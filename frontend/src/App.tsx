import { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Landing from "./components/Landing";
import { type User } from "./store/types";
import axios from "axios";

function App() {
    axios.defaults.baseURL = 'http://localhost:3000'
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    setUser(null);
    setLoggedIn(false);
  };
  useEffect(() => {
    const ifLoggedIn = async () => {
      try {
        const res = await axios.get("/me", { withCredentials: true });
        console.log(res.data)
        setUser(res.data.user)
        setLoggedIn(true)
      } catch (err) {
        console.error("No logged in user found: ", err);
        setLoggedIn(false)
      }
    };
    ifLoggedIn()
  }, []);
  console.log(user);

  return (
    <>
        {loggedIn && <Landing />}
        {!loggedIn && <Login setLoggedIn={setLoggedIn} setUser={setUser} />}
        <button onClick={logout}>Logout</button>
    </>
  );
}

export default App;
