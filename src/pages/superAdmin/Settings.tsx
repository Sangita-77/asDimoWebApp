import React from "react";
import { Heading1 } from "../../components/ui/HeadingPara";
import Tabs from "../../components/ui/Tabs";
import ProfileUpdate from "../../components/modules/ProfileUpdate";



  const tabsData = [
    {
      label: "General",
      content: <ProfileUpdate/>,
    },
    {
      label: "Edit Billing plans",
      content: "",
    },
  ];

const CustomerDocuments: React.FC = () => {

  return (
    <div className="CustomerDocuments">
      <Heading1 text="Settings" />
       <Tabs tabs={tabsData} variant="LeftSide"/>
    </div>
  );
};

export default CustomerDocuments; 