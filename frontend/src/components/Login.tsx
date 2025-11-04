import laundryLogo from "../assets/logo.svg";
import axios from "axios";
import { useState } from "react";
import type { LoginProps } from "../store/types";

function Login({ setLoggedIn, setAdmin }: LoginProps) {
<<<<<<< HEAD
  // const API_URL = "http://localhost:3000"
  const API_URL = "https://laundrybooking.onrender.com"
  const [formData, setFormData] = useState({});
=======
  const [message, setMessage] = useState<string | null>(null)
  const API_URL = "http://localhost:3000"
  // const API_URL = "https://laundrybooking.onrender.com"
  const [formData, setFormData] = useState({email: '', password: ''});
>>>>>>> main
  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { ...formData },
        { withCredentials: true }
      );
      if (res.data.user.role === "admin") setAdmin(true);
      setLoggedIn(true);
    } catch (err) {
      if(axios.isAxiosError(err) && err.response?.status === 401 || axios.isAxiosError(err) && err.response?.status === 404) {
        setMessage('Felaktig email eller lösenord.')
        setFormData({email: '', password:''})
      }
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
            value={formData.email}
            onChange={handleInput}
          />
          <input
            type="password"
            name="password"
            placeholder="Lösenord"
            value={formData.password}
            onChange={handleInput}
          />
          <button className="primary-btn-green">LOGIN</button>
        </form>
        {message && <p className="login-msg">{message}</p>}
      </div>
    </>
  );
}

export default Login;
