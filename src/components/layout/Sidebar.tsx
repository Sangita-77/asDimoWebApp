import React from "react";
import "./layout.css";
import { NavLink } from "react-router-dom";
import { routes } from "../../routes/AppRoutes";
import Logo from "../../assets/Images/Logo.svg";

interface SidebarProps {
  open: boolean;
  isDesktop: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  open,
  isDesktop,
  closeSidebar,
}) => {
  const menuItems = [
    { name: "Dashboard", path: routes.SUPERADMIN, },
    { name: "Settings", path: routes.SUPERADMINSETTINGS, },
  ];

  return (
    <div className={`sidebar ${open ? "open" : ""}`}>
      {!isDesktop && (
        <button
          className="sidebar-close"
          onClick={closeSidebar}
        >
          ✕
        </button>
      )}

      <div className="AdminLogo">
            <img src={Logo} alt="" />
      </div>

      <ul>
        {menuItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={() => {
                if (!isDesktop) {
                  closeSidebar();
                }
              }}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;