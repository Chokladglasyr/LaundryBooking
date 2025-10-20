import { useState } from "react";
import styrelseLogo from "../assets/forening.png";
import Home from "./Home";
import Rules from "./Rules";
function Landing() {
  const [rules, setRules] = useState(false);
  const goToRules = () => {
    if (rules === false) {
      setRules(true);
    } else {
      setRules(false);
    }
  };

  return (
    <>
      <img className="company-logo" src={styrelseLogo} alt="styrelsens logo" />
      <nav className={rules ? 'nav-back' : 'nav-rules'}>
        <button onClick={goToRules}>
          {rules ? "Tillbaka" : "Ordningsregler"}
        </button>
      </nav>
      {rules ? <Rules /> : <Home />}
    </>
  );
}

export default Landing;
