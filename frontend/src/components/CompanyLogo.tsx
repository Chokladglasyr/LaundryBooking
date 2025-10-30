import { Link } from "react-router-dom";
import styrelseLogo from "../assets/forening.png";
import type { LogoProps } from "../store/types";
function CompanyLogo({path}: LogoProps) {
    return(
        <>
        <Link to={`/${path}`}><img className="company-logo" src={styrelseLogo} alt="styrelsens logo" /></Link>
        </>
    )
}
export default CompanyLogo