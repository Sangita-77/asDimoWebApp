import React, { useState, useEffect } from "react";
import ProfileField from "../ui/ProfileField";
import ModalBox from "../ui/ModalBox";
import "../ui/UIstyles.css";
import { filebasename } from "../../api/config";

interface ProfilePageProps {
  profileData: any;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profileData }) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    profileImg: "",
  });

  useEffect(() => {
    console.log("Received profile data:", profileData);
    if (profileData?.user) {
      setProfile({
        name: profileData.user.name || "",
        email: profileData.user.email || "",
        phone: profileData.user.phone || "",
        role:
          profileData.user.flag === 0
            ? "Super Admin"
            : profileData.user.flag === 1
            ? "Admin"
            : profileData.user.flag === 2
            ? "Sub Admin"
            : "User",
        profileImg: profileData.user.profileImg
          ? `${filebasename}${profileData.user.profileImg}`
          : "",
      });
    }
  }, [profileData]);

  return (
    <div className="profile-page">
      <div className="profile-card">
        <ProfileField
          showProfileImage
          profileImage={profile.profileImg}
          label="Full Name"
          value={profile.name}
          onSave={(value) =>
            setProfile((prev) => ({ ...prev, name: value }))
          }
        />

        <ProfileField
          label="Email"
          value={profile.email}
          onSave={(value) =>
            setProfile((prev) => ({ ...prev, email: value }))
          }
        />

        <ProfileField
          label="Contact"
          value={profile.phone || "-"}
          onSave={(value) =>
            setProfile((prev) => ({ ...prev, phone: value }))
          }
        />

        <ProfileField
          label="Role"
          value={profile.role}
          onSave={(value) =>
            setProfile((prev) => ({ ...prev, role: value }))
          }
        />

        <ProfileField
          label="Password"
          value="••••••••"
          isPassword
          onResetPassword={() => setShowResetModal(true)}
        />

        <div className="NotificationToggle d-flex">
          <div className="field-info">
            <label>Notifications</label>
          </div>

          <button
            className={`toggle-btn ${
              notificationsEnabled ? "active" : ""
            }`}
            onClick={() =>
              setNotificationsEnabled(!notificationsEnabled)
            }
          >
            <span className="toggle-text">
              {notificationsEnabled ? "ON" : "OFF"}
            </span>
            <span className="toggle-circle"></span>
          </button>
        </div>
      </div>

      {showResetModal && (
        <ModalBox
          header={<h3>Reset Password</h3>}
          onCancel={() => setShowResetModal(false)}
          body={
            <div className="reset-password-form">
              {/* Password fields */}
            </div>
          }
        />
      )}
    </div>
  );
};

export default ProfilePage;