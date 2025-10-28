import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Landing from "./components/Landing";
import { UserContext, type User} from "./store/types";



function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  


  console.log(user);

  return (
    <>
      <UserContext.Provider value={{user, setUser}}>
      {loggedIn && <Landing />}
      {!loggedIn && <Login setLoggedIn={setLoggedIn} setUser={setUser} />}

      </UserContext.Provider>
    </>
  );
}

export default App;
