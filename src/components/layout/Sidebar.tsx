import React, { useState } from "react";
import "./layout.css";
import "../../components/ui/UIstyles.css";
import { NavLink } from "react-router-dom";

import { routes } from "../../routes/AppRoutes";
import { useLogout } from "../../services/useLogout";

import Logo from "../../assets/Images/Logo.svg";
import DashBoardIcon from "../../assets/Images/DashBoardIcon.svg";
import SettingsIcon from "../../assets/Images/SettingsIcon.svg";
import LogOutIcon from "../../assets/Images/LogOutIcon.svg";
import DashboardButtons from "../ui/Buttons";
import ModalBox from "../ui/ModalBox";

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
  const logout = useLogout();

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(false);

    if (!isDesktop) {
      closeSidebar();
    }

    await logout();
  };

  const menuItems = [
    { name: "Dashboard", path: routes.SUPERADMIN, icon: DashBoardIcon, },
    { name: "Zonal Admin", path: routes.SUP_ZONALADMIN, icon: DashBoardIcon, },
    { name: "Settings", path: routes.SUPERADMINSETTINGS, icon: SettingsIcon, },
  ];

  return (
    <div className={`sidebar ${open ? "open" : ""}`}>
      {!isDesktop && (
        <button
          type="button"
          className="sidebar-close"
          onClick={closeSidebar}
        >
          ✕
        </button>
      )}

      <div className="AdminLogo">
        <img src={Logo} alt="Logo" />
      </div>

      <ul>
        {menuItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              end={item.path === routes.SUPERADMIN}
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
              <img src={item.icon} alt={item.name} />
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}

        <li>
          <a
            className="logout-btn"
            onClick={() =>
              setShowLogoutModal(true)
            }
          >
            <img src={LogOutIcon} alt="Logout" />
            <span>Logout</span>
          </a>
        </li>
      </ul>

      {showLogoutModal && (
        <ModalBox
          header={<h3>Confirm Logout</h3>}
          onCancel={() =>
            setShowLogoutModal(false)
          }
          body={
            <div className="logout-popup">
              <p>
                Are you sure you want to logout
                from your account?
              </p>

              <div className="logout-popup-actions d-flex">
                <DashboardButtons
                  text="Cancel"
                  variant="solid"
                  textsize="sm"
                  onClick={() =>
                    setShowLogoutModal(false)
                  }
                />

                <DashboardButtons
                  text="Logout"
                  variant="solid"
                  textsize="sm"
                  onClick={handleLogout}
                />
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default Sidebar;
