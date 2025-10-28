import laundryLogo from "../assets/logo.svg";
import axios from "axios";
import { useState } from "react";
import type { LoginProps } from "../store/types";

function Login({ setLoggedIn }: LoginProps) {
  const [formData, setFormData] = useState({});
  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/login",
        { ...formData },
        { withCredentials: true }
      );
      setLoggedIn(true);
    } catch (err) {
      console.error("Something went wrong when loggin in: ", err);
    }
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <div className="login-page">
        <img
          src={laundryLogo}
          className="logo"
          alt="Logo of a washing machine"
        />
        <form className="login" onSubmit={login}>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={handleInput}
          />
          <input
            type="password"
            name="password"
            placeholder="Lösenord"
            onChange={handleInput}
          />
          <button>LOGIN</button>
        </form>
      </div>
    </>
  );
}

export default Login;
