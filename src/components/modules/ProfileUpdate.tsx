import React, { useState } from "react";
import ProfileField from "../ui/ProfileField";
import ModalBox from "../ui/ModalBox";
import "../ui/UIstyles.css";

const ProfilePage: React.FC = () => {
  const [showResetModal, setShowResetModal] = useState(false);

  const [profile, setProfile] = useState({
    name: "Swati Bazal",
    email: "swati@gmail.com",
    phone: "000000000",
    role: "Super Admin",
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  return (
    <div className="profile-page">
      <div className="profile-card">
        <ProfileField showProfileImage label="Full Name" value={profile.name} onSave={(value) => setProfile((prev) => ({ ...prev, name: value })) } />
        <ProfileField label="Email" value={profile.email} onSave={(value) => setProfile((prev) => ({ ...prev, email: value })) } />
        <ProfileField label="Contact" value={profile.phone} onSave={(value) => setProfile((prev) => ({ ...prev, phone: value })) } />
        <ProfileField label="Role" value={profile.role} onSave={(value) => setProfile((prev) => ({ ...prev, role: value })) } />
        <ProfileField label="Password" value="••••••••" isPassword onResetPassword={() => setShowResetModal(true)} />
        <div className="NotificationToggle d-flex">
          <div className="field-info">
            <label>Notifications</label>
          </div>
        <button
          className={`toggle-btn ${notificationsEnabled ? "active" : ""}`}
          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
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
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input type="password" />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" />
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowResetModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="save-btn"
                  onClick={() => {
                    // Call API here
                    setShowResetModal(false);
                  }}
                >
                  Update Password
                </button>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default ProfilePage;