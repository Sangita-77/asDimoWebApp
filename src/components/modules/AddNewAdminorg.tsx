import React from "react";
import FormAdd from "../../components/ui/FormAdd";
import { countries } from "../../components/ui/countries";

const AddNewAdminorg: React.FC = () => {
  const handleSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <FormAdd
        heading="Zonal Admin Information"
        showProfilePicture={true}
        fields={[
          { name: "name", label: "Full Name", placeholder: "Enter Full Name", required: true,},
          { name: "email", label: "Email Address", type: "email", placeholder: "Enter E-mail Addresss", required: true,},
          { name: "phone", label: "Phone Number", type: "tel", placeholder: "Enter Phone Number", width: "half", required: true,},
          { name: "role", label: "Role", type: "role", placeholder: "role", width: "half",},
          { name: "address", label: "Address Information", type: "text", placeholder: "Enter Full address", required: true,},
          { name: "city", label: "City", type: "Country", placeholder: "Enter City", width: "quarter", required: true,},
          { name: "State", label: "State / Province*", type: "state", placeholder: "Enter State / Province Name", width: "quarter", required: true,},
          { name: "zipcode", label: "Zip code", type: "zipcode", placeholder: "Enter Zip code", width: "quarter", required: true,},
          { name: "country", label: "Country", fieldType: "select", width: "quarter", options: countries, required: true,},
        ]}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddNewAdminorg;