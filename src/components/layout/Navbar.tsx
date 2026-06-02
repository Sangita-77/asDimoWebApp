import React, { useEffect, useState } from "react";
import "./layout.css";
import { authService } from "../../services/authService";
import { tokenManager } from "../../services/tokenManager";

interface NavbarProps {
  toggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggle }) => {
  const [profileName, setProfileName] = useState("Admin");

  useEffect(() => {
    const getDisplayName = (profile: any) => {
      const user = profile?.user || profile?.profile || profile;

      return (
        user?.name ||
        user?.Name ||
        user?.fullName ||
        user?.fullname ||
        user?.username ||
        user?.firstName ||
        user?.email ||
        "Admin"
      );
    };

    const loadProfile = async () => {
      const token = tokenManager.getAccessToken();

      if (!token) {
        return;
      }

      try {
        const response = await authService.getProfile(token);
        setProfileName(getDisplayName(response.data));
      } catch (error) {
        setProfileName(getDisplayName(tokenManager.getUser()));
        console.error("Profile API failed:", error);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="navbar">
      <span className="menu-toggle" onClick={toggle}>
        ☰
      </span>

      <h3>Super Admin</h3>
      <div>{profileName}</div>
    </div>
  );
};

export default Navbar;
