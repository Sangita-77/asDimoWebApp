
import React from "react";
// import { Heading1, Paragraph } from "../../components/ui/HeadingPara";
import type { Field } from "../../components/ui/FormAdd";
import FormAdd from "../../components/ui/FormAdd";


const fields: Field[] = [
  { name: "name", label: "Full Name", placeholder: "Enter Full Name", required: true, },
  { name: "email", label: "Email Address", type: "email", placeholder: "Enter Email Address", required: true, },
  { name: "phone", label: "Phone Number", type: "tel", placeholder: "Enter Phone Number", width: "half", required: true, },
  { name: "address", label: "Address Information", type: "text", placeholder: "Enter Full Address", required: true, },
  { name: "city", label: "City", placeholder: "Enter City", width: "quarter", required: true, },
  { name: "State", label: "State / Province", placeholder: "Enter State / Province", width: "quarter", required: true, },
  { name: "zipcode", label: "Zip Code", placeholder: "Enter Zip Code", width: "quarter", required: true, },
  { name: "country", label: "Country", fieldType: "select", width: "quarter",  required: true,
      options: [
      { label: "India", value: "India" },
      { label: "United States", value: "United States" },
      { label: "United Kingdom", value: "United Kingdom" },
      { label: "Canada", value: "Canada" },
      { label: "Australia", value: "Australia" },
      { label: "United Arab Emirates", value: "United Arab Emirates" },
      { label: "Singapore", value: "Singapore" },
      { label: "New Zealand", value: "New Zealand" },
      { label: "Germany", value: "Germany" },
      { label: "France", value: "France" },
    ], 
  },
  ];

const AddInformation: React.FC = () => {
  const handleSubmit = async (data: Record<string, any>) => {
    try {
      console.log("Submitted information:", data);

      // Replace with your API request.
      // await api.post("/information", data);

      alert("Information added successfully!");
    } catch (error) {
      console.error("Failed to add information:", error);
    }
  };

  return (
    <>
      {/* <div className="d-flex">
        <div className="AddInfoWordWrap">
          <Heading1 text="Add Information" />
          <Paragraph text="Enter the information below." />
        </div>
      </div> */}

      <div className="boxShadow AddInformation">
        <FormAdd
          heading="Personal Information"
          showProfilePicture={true}
          fields={fields}
          onSubmit={handleSubmit}
          buttonText="Book Appointment"
        />
      </div>
    </>
  );
};

export default AddInformation;
