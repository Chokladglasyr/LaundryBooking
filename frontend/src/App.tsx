import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Landing from "./components/Landing";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  // just to get rid of warning
  const isLoggedIn = false
  if(isLoggedIn) setLoggedIn(true)
  return (
    <>
        {loggedIn && <Landing />}
        {!loggedIn && <Login />}
    </>
  );
}

export default App;
