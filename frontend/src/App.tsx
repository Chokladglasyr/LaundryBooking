import { useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Home from "./components/Landing";
import Login from "./components/Login";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <div className="app">
        {loggedIn && <Home></Home>}
        {!loggedIn && <Login />}
        <Outlet></Outlet>
      </div>
    </>
  );
}

export default App;
