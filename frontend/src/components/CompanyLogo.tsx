import { Link } from "react-router-dom";
import styrelseLogo from "../assets/forening.png";
function CompanyLogo() {
    return(
        <>
        <Link to={'/'}><img className="company-logo" src={styrelseLogo} alt="styrelsens logo" /></Link>
        </>
    )
}
export default CompanyLogo