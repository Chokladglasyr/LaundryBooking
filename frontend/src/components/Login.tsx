import { Link } from "react-router-dom";
import laundryLogo from "../assets/logo.svg";
// import { useState } from "react";
function Login() {
    // const [admin, setAdmin] = useState(false)
    // const goToAdmin = () => {

    //     if(admin === false) {
    //         setAdmin(true)
    //     }else {
    //         setAdmin(false)
    //     }
    // }
  return (
    <>
      <div className="login-page">
        {/* {admin && <h1>Admin</h1>} */}
        <img src={laundryLogo} className="logo" alt="Logo of a washing machine" />
        <form className="login" action="#">
          <input type="email" name="email" id="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Lösenord" />
        </form>
        <Link to={'/home'} className="primary-btn" id="login">
          LOGGA IN
        </Link>
        {/* <button onClick={goToAdmin} className="primary-btn" id="btn-admin">
          GÅ TILL ADMIN
        </button> */}
      </div>
    </>
  );
}

export default Login;
