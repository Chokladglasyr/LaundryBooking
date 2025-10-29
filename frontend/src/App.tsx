import { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Landing from "./components/Landing";
import axios from "axios";
import Admin from "./components/AdminHome";
// import { useNavigate } from "react-router-dom";

function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false)
  // const navigate = useNavigate()

  const logout = async () => {
    try {
      await axios.get('/logout', {withCredentials: true})
      setLoggedIn(false);
    }catch(err) {
      if(err instanceof Error) {
        console.error("Failed to logout: ", err)
      }
    }
  };
  useEffect(() => {
    const ifLoggedIn = async () => {
      try {
        const res = await axios.get("/me", { withCredentials: true });
        if (res) {
          setLoggedIn(true);
          if(res.data.user[0].role === "admin") {
            setAdmin(true)
          }
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

  return (
    <>
      {admin ? <Admin />: loggedIn ? <Landing /> : <Login setLoggedIn={setLoggedIn} />}
      <button onClick={logout}>Logout</button>
    </>
  );
}

export default App;
