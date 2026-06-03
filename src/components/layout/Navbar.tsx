import React, { useState, useRef, useEffect } from "react";
import "./layout.css";
// import user from "../../assets/Images/user.png";
import { BellIcon } from "lucide-animated";
import { authService } from "../../services/authService";
import { tokenManager } from "../../services/tokenManager";
import { filebasename } from "../../api/config";

interface NavbarProps {
  toggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggle }) => {
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [profileName, setProfileName] = useState("Admin");
  const [profileRole, setProfileRole] = useState("Admin");
  const profileInitial = profileName?.charAt(0)?.toUpperCase() || "A";
  const [profileImg, setProfileImg] = useState("");
  const profileImageUrl = profileImg
  ? `${filebasename}${profileImg.replace("/uploads", "")}`
  : "";

  const getRoleName = (flag: number) => {
    switch (flag) {
      case 0:
        return "Super Admin";
      case 1:
        return "Organization Admin";
      case 6:
        return "Zonal Admin";
      case 7:
        return "Admin";
      default:
        return "Admin";
    }
  };


// Demo Notifications
  const notifications = [
    { id: 1, title: "New User Registered", time: "2 mins ago", unread: true, },
    { id: 2, title: "Payment Received", time: "15 mins ago", unread: true, },
    { id: 3, title: "Subscription Expired", time: "1 hour ago", unread: false, },
  ];



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

        const userData = response?.data?.user;

        // console.log("Profile API response ----- :", userData.profileImg);

        setProfileName(getDisplayName(response.data));
        setProfileRole(getRoleName(userData?.flag));
        setProfileImg(userData?.profileImg || "");
      } catch (error) {
        const userData = tokenManager.getUser();

        setProfileName(getDisplayName(userData));
        setProfileRole(getRoleName(userData?.flag));
        setProfileImg(userData?.profileImg || "");

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

      <h3>{profileRole}</h3>

      <div className="d-flex ProfilePreview">

        <div className="NotificationWrapper" ref={notificationRef}>
          <button className="NotificationBtn" onClick={() => setShowNotification(!showNotification)} >
            <BellIcon/>
            <span className="NotificationBadge"> {notifications.filter((item) => item.unread).length} </span>
          </button>

          {showNotification && (
            <div className="NotificationDropdown">
              <div className="NotificationHeader">
                <h4>Notifications</h4>
              </div>

              <div className="NotificationList">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`NotificationItem ${
                      item.unread ? "unread" : ""
                    }`}
                  >
                    <div className="NotificationDot"></div>

                    <div>
                      <h5>{item.title}</h5>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>


              <div className="NotificationFooter">
                View All Notifications
              </div>
            </div>
          )}
        </div>

        

        <div className="ProfileName">
          {profileName}
          <p>{profileRole}</p>
        </div>

      <div className="ProfileIMAGE">
        {profileImg ? (
          // <img src={profileImg} alt={profileName} />
          <img src={profileImageUrl} alt={profileName} />
        ) : (
          profileInitial
        )}
      </div>
      </div>
    </div>
  );
};

export default Navbar;
