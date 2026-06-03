import React, { useState } from "react";
import "./UIstyles.css";
import UploadCameraIcon from "../../assets/Images/UploadCameraIcon.svg";

interface ProfileFieldProps {
  label: string;
  value: string;
  onSave?: (value: string) => void;
  showProfileImage?: boolean;
  editable?: boolean;
  isPassword?: boolean;
  onResetPassword?: () => void;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  onSave,
  showProfileImage = false,
  editable = true,
  isPassword = false,
  onResetPassword,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);

  const [profileImage, setProfileImage] = useState(
    ""
  );

  const handleAction = () => {
    if (isEditing) {
      onSave?.(fieldValue);
    }

    setIsEditing(!isEditing);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };


  return (
    <>
      {showProfileImage && (
        <div className="profile-image-container">
        {profileImage ? (
        <img
            src={profileImage}
            alt="Profile"
            className="profile-image"
        />
        ) : (
        <div className="profile-placeholder">
            {value.charAt(0).toUpperCase()}
        </div>
        )}

          <label className="upload-image-btn">
            <img src={UploadCameraIcon}/> Upload
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </label>
        </div>
      )}

      <div className="profile-field">
        <div className="field-info">
          <label>{label}</label>

        {isEditing && !isPassword ? (
        <input
            type="text"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
        />
        ) : (
        <p>{fieldValue}</p>
        )}
        </div>

        {isPassword ? (
        <button
            className="field-btn"
            onClick={onResetPassword}
        >
            Reset Password
        </button>
        ) : editable ? (
        <button
            className="field-btn"
            onClick={handleAction}
        >
            {isEditing ? "Save" : "Edit"}
        </button>
        ) : null}
      </div>
    </>
  );
};

export default ProfileField;