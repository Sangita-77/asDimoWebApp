import React from "react";

import { Heading1, Paragraph } from "../../components/ui/HeadingPara";
import AddNewAdminorg from "../../components/modules/AddNewAdminorg";

const AddInformation: React.FC = () => {


  return (
    <>
    <Heading1 text="ADD NEW Zonal Admin" />
    <Paragraph text="Dashboard > Zonal Admin > Add New Zonal Admin" />
    <div className="boxShadow AddInformation">
        <AddNewAdminorg/>
    </div>
    </>
  );
};

export default AddInformation;