import { Link, useLocation } from "react-router-dom";
import CompanyLogo from "./CompanyLogo";
import { useEffect, useState } from "react";
import AdminPosts from "./AdminPosts";
import AdminRooms from "./AdminRooms";
import AdminRules from "./AdminRules";

function Admin() {
  const location = useLocation();
  const [pathName, setPathName] = useState(location.pathname);
  const destinations = [
    { name: "Regler", path: "admin/rules" },
    { name: "Boende", path: "admin/users" },
    { name: "Tvättstugor", path: "admin/rooms" },
  ];
  useEffect(() => {
    setPathName(location.pathname.replace('/', ''));
  }, [location]);

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
          {location.pathname != "/admin" && (
            <Link to={"/admin"}>Meddelande</Link>
          )}
        </nav>
        {location.pathname === "/admin" ? <AdminPosts /> : location.pathname === "/admin/rules" ? <AdminRules />: <AdminRooms />}
        {/* <Outlet /> */}
      </div>
    </>
  );
}
export default Admin;
