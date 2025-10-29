import { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Landing from "./components/Landing";
import axios from "axios";

function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  const [loggedIn, setLoggedIn] = useState(false);

  const logout = () => {
    setLoggedIn(false);
  };
  useEffect(() => {
    const ifLoggedIn = async () => {
      try {
        const res = await axios.get("/me", { withCredentials: true });
        if (res) {
          setLoggedIn(true);
        } else {
          console.log("No user logged in");
          setLoggedIn(false);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          console.error("No logged in user found: ", err);
          setLoggedIn(false);
        } else {
          console.error("Error checking if logged in: ", err);
        }
      }
    };
    ifLoggedIn();
  }, []);
  console.log(loggedIn);

  return (
    <>
      {loggedIn ? <Landing /> : <Login setLoggedIn={setLoggedIn} />}

      <button onClick={logout}>Logout</button>
    </>
  );
}

export default App;
