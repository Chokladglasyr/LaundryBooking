import { useState, type MouseEvent } from "react";
import Home from "./Home";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import CompanyLogo from "./CompanyLogo";
function Landing() {
  const [rules, setRules] = useState(false);
  const navigate = useNavigate();
  const goToRules = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (rules) {
      navigate(-1);
      setRules(false);
    } else {
      navigate('/rules')
      setRules(true);
    }
  };

  const location = useLocation();
  return (
    <>
      <CompanyLogo />
      <nav id="nav-landing" className={rules ? "nav-back" :"nav-rules"}>
        <Link onClick={goToRules} to={rules ? "navigate(-1)" : "rules"}>
          {rules ? "Tillbaka" : "Ordningsregler"}
        </Link>
      </nav>
      <Outlet />
      {location.pathname === "/" && <Home />}
    </>
  );
}

export default Landing;
