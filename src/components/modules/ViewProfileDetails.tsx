import React, { useState } from "react";
import ProfileField from "../ui/ProfileField";
import "./ModulesStyles.css";

const ViewProfileDetails: React.FC = () => {
  const [name] = useState("Swati Bazal");

  const [profileImage, setProfileImage] = useState("");

  const handleImageChange = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);

    // API upload logic here
  };

  return (
    <div className="d-flex ViewProfileDetails">
      <div className="Profile_Editable boxShadow">
        <ProfileField label="Profile" value={name} showProfileImage profileImage={profileImage} onImageChange={handleImageChange} editable={true} />
        <ProfileField label="Email" value="swati@gmail.com" editable={false} />
        <ProfileField label="Phone" value="+1234 567 890" editable={false} />
        <ProfileField label="Zone" value="742 Everygreen Terrace, Springfield" editable={true} />
      </div>

      <div className="AdminList">
      </div>
    </div>
  );
};

export default ViewProfileDetails;