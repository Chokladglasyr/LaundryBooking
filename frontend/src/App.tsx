import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Landing from "./components/Landing";
import { UserContext, type User} from "./store/types";



function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
const logout = () => {
  setUser(null)
  setLoggedIn(false)
}

  console.log(user);

  return (
    <>
      <UserContext.Provider value={{user, setUser}}>
      {loggedIn && <Landing />}
      {!loggedIn && <Login setLoggedIn={setLoggedIn} setUser={setUser} />}
          <button onClick={logout}>Logout</button>
      </UserContext.Provider>
    </>
  );
}

export default App;
