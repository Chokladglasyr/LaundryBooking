// import { Link } from "react-router-dom";
import laundryLogo from "../assets/logo.svg";
import axios from "axios";
import { useState } from "react";
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
    const [formData, setFormData] = useState({})
    const login = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const res = await axios.post('http://localhost:3000/login', {
          ...formData
        })
        console.log(res.data)
      } catch(err) {
        console.error('Something went wrong when loggin in: ', err)
      }
    }
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData({...formData, [name]: value})
    }
  return (
    <>
      <div className="login-page">
        {/* {admin && <h1>Admin</h1>} */}
        <img src={laundryLogo} className="logo" alt="Logo of a washing machine" />
        <form className="login" onSubmit={login}>
          <input type="email" name="email" id="email" placeholder="Email" onChange={handleInput}/>
          <input type="password" name="password" placeholder="Lösenord" onChange={handleInput}/>
          <button>LOGIN</button>
        </form>
        {/* <Link to={'/home'} className="primary-btn" id="login">
          LOGGA IN
        </Link> */}
        {/* <button onClick={goToAdmin} className="primary-btn" id="btn-admin">
          GÅ TILL ADMIN
        </button> */}
      </div>
    </>
  );
}

export default Login;
