import { useState, type MouseEvent } from "react";
import styrelseLogo from "../assets/forening.png";
import Home from "./Home";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
function Landing() {
  const [rules, setRules] = useState(false);
  const navigate = useNavigate();
  const goToRules = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (rules) {
      setRules(false);
      navigate('/rules')
    } else {
      setRules(true);
      navigate(-1);
    }
  };
  const location = useLocation();
  return (
    <>
      <Link to={'/'}><img className="company-logo" src={styrelseLogo} alt="styrelsens logo" /></Link>
      <nav className={rules ? "nav-rules" :"nav-back"}>
        <Link onClick={goToRules} to={rules ? "navigate(-1)" : "rules"}>
          {rules ? "Ordningsregler" : "Tillbaka"}
        </Link>
      </nav>
      <Outlet />
      {/* <Home /> */}
      {location.pathname === "/" && <Home />}
    </>
  );
}

export default Landing;
