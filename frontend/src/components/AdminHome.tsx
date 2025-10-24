import { Link, Outlet, useLocation } from "react-router-dom";
import CompanyLogo from "./CompanyLogo";
import { useEffect, useState } from "react";
import AdminMsg from "./AdminPosts";

function Admin() {
    const location = useLocation()
  const [pathName, setPathName] = useState(location.pathname);
  const destinations = [
    { name: "Regler", path: "rules" },
    { name: "Boende", path: "users" },
    { name: "Tvättstugor", path: "rooms" }
  ];
  useEffect(() => {
    setPathName(location.pathname.replace('/admin/', ''))
  }, [location])
  console.log(pathName)
  return (
    <>
      <CompanyLogo />
      <div className="landing" id="admin">
        <nav id="nav-admin">
          {destinations.map((d) =>
            pathName === d.path ? (
              ""
            ) : (
              <Link key={d.path} to={`${d.path}`}>
                {d.name}
              </Link>
            )
          )}
          {location.pathname != '/admin' && <Link to={'/admin'}>Meddelande</Link>}
        </nav>
        {location.pathname === '/admin' && <AdminMsg />}
        <Outlet />
      </div>
    </>
  );
}
export default Admin;
