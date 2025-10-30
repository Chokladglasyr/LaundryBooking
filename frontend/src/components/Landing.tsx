import { useState, type MouseEvent } from "react";
import Home from "./Home";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import CompanyLogo from "./CompanyLogo";
import axios from "axios";

function Landing() {
  axios.defaults.baseURL = "http://localhost:3000";
  const [rules, setRules] = useState(false);
  const navigate = useNavigate();
  const goToRules = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (rules) {
      navigate(-1);
      setRules(false);
    } else {
      navigate("/home/rules");
      setRules(true);
    }
  };
  const location = useLocation();
    const logout = async () => {
    try {
      await axios.get('/logout', {withCredentials: true})
      navigate('/')
    }catch(err) {
      if(err instanceof Error) {
        console.error("Failed to logout: ", err)
      }
    }
  };

  return (
    <>
      <CompanyLogo path="" />
      <nav id="nav-landing" className={rules ? "nav-back" : "nav-rules"}>
        <Link onClick={goToRules} to={rules ? "navigate(-1)" : "rules"}>
          {rules ? "Tillbaka" : "Ordningsregler"}
        </Link>
      </nav>
      <Outlet />
      {location.pathname === "/home" && <Home />}
            <button onClick={logout}>Logout</button>
    </>
  );
}

export default Landing;
