import { Link } from "react-router-dom";
import laundryLogo from "../assets/logo.svg";
import axios from "axios";
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
    const login = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const res = await axios.get('http://localhost:3000/login')
        console.log(res)
      } catch(err) {
        console.error('Something went wrong when loggin in: ', err)
      }
    }
  return (
    <>
      <div className="login-page">
        {/* {admin && <h1>Admin</h1>} */}
        <img src={laundryLogo} className="logo" alt="Logo of a washing machine" />
        <form className="login" onSubmit={login}>
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
