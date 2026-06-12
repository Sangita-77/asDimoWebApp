import React, { useState } from "react";
import ProfileField from "../ui/ProfileField";
import { Heading2, Heading3 } from "../../components/ui/HeadingPara";
import DashboardButtons from "../ui/Buttons";
import "./ModulesStyles.css";
import TableCard from "../ui/TableCard";

const ViewProfileDetails: React.FC = () => {
  const [name] = useState("Swati Bazal");

  const [profileImage, setProfileImage] = useState("");

  const handleImageChange = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);

    // API upload logic here
  };


const users = [
  { id: 1, name: "John Doe", therapists: "11", phone: "+1234 567 890", email: "john@example.com", address: "New York, USA", },
  { id: 2, name: "Jane Smith", therapists: "11", phone: "+1234 567 890", email: "jane@example.com",  address: "New York, USA",},
  { id: 3, name: "Jane Smith", therapists: "11", phone: "+1234 567 890", email: "jane@example.com",  address: "New York, USA",},
];



  return (
    <div className="d-flex ViewProfileDetails">
      <div className="Profile_Editable">
        <div className="boxShadow">
            <ProfileField label="Profile" value={name} showProfileImage profileImage={profileImage} onImageChange={handleImageChange} editable={true} />
            <ProfileField label="Email" value="swati@gmail.com" editable={false} />
            <ProfileField label="Phone" value="+1234 567 890" editable={false} />
            <ProfileField label="Zone" value="742 Everygreen Terrace, Springfield" editable={true} />
        </div>
        <div className="boxShadow">
           <div className="d-flex TotalCount">
              <Heading2 text="Total Subscription" />
              <Heading3 text="60" />
           </div>
           <div className="d-flex TotalCount">
              <Heading2 text="Total Users" />
              <Heading3 text="102" />
           </div>
        </div>
      </div>

      <div className="ORGList">
        <div className="boxShadow">
           <div className="d-flex OrganisationList">
            <Heading2 text="Organisation List" />
            <DashboardButtons text="View All" variant="greyborder"/>
           </div>
            {users.map((user) => (
              <TableCard
                key={user.id}
                data={user}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ViewProfileDetails;