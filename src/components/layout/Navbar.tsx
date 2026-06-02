import React, { useState, useRef, useEffect } from "react";
import "./layout.css";
import user from "../../assets/Images/user.png";
import { BellIcon } from "lucide-animated";

interface NavbarProps {
  toggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggle }) => {
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);


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

  return (
    <div className="navbar">
      <span className="menu-toggle" onClick={toggle}>
        ☰
      </span>

      <h3>Super Admin</h3>

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
          Mr. John
          <p>Admin</p>
        </div>

        <div className="ProfileIMAGE">
          <img src={user} alt="user" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
