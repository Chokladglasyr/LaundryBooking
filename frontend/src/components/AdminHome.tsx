import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import CompanyLogo from "./CompanyLogo";
import { useEffect, useState } from "react";
import AdminPosts from "./AdminPosts";
import axios from "axios";

function Admin() {
  // axios.defaults.baseURL ="http://localhost:3000"
  axios.defaults.baseURL ="https://laundrybooking.onrender.com"
  
  const location = useLocation();
  const navigate = useNavigate();
  const [pathName, setPathName] = useState(location.pathname);
  const destinations = [
    { name: "Regler", path: "rules" },
    { name: "Boende", path: "users" },
    { name: "Tvättstugor", path: "rooms" },
  ];
  useEffect(() => {
    setPathName(location.pathname.replace("/", ""));
  }, [location]);

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
      <CompanyLogo path="admin" />
      <div className="landing" id="admin">
        <nav id="nav-admin">
          {destinations.map((d) =>
            pathName.includes(d.path) ? (
              ""
            ) : (
              <Link key={d.path} to={`${d.path}`}>
                {d.name}
              </Link>
            )
          )}
          {location.pathname != "/admin" && (
            <Link to={"/admin"}>Meddelande</Link>
          )}
        </nav>
        {location.pathname === "/admin" && <AdminPosts />}
        <Outlet />
      </div>
      <button onClick={logout}>Logout</button>
    </>
  );
}
export default Admin;
