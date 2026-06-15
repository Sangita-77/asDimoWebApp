import React from "react";

import { Heading1, Paragraph } from "../../components/ui/HeadingPara";
import type { Field } from "../../components/ui/FormAdd";
import FormAdd from "../../components/ui/FormAdd";
import { authService } from "../../services/authService";
import { useLocation, useNavigate } from "react-router-dom";
import { countries } from "../../components/ui/countries";


const AddInformation: React.FC = () => {
const location = useLocation();
  const navigate = useNavigate();

  const flag = Number(location.state?.flag);

  console.log("Flag in AddNewAdminorg:", flag);

  const getHeading = (flag: number) => {
    switch (flag) {
      case 6:
        return "Zonal Admin Information";
      case 7:
        return "Admin Information";
      case 1:
        return "Organization Admin Information";
      case 3:
        return "Therapist Information";
      case 2:
        return "Parent Information";
      default:
        return "User Information";
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.State,
        pincode: data.zipcode,
        country: data.country,
        flag,

        ...(flag === 6 && {
          superAdminId: data.superAdminId,
        }),

        ...(flag === 7 && {
          zonalAdminId: data.zonalAdminId,
        }),

        ...(flag === 1 && {
          adminId: data.adminId,
          organization_type: Number(
            data.organization_type
          ),
        }),

        ...(flag === 3 && {
          organizationAdminId:
            data.organizationAdminId,
        }),

        ...(flag === 2 && {
          therapistId: data.therapistId,
        }),
      };

      await authService.register(
        token,
        payload
      );

      alert("User created successfully");

      navigate(-1);
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to create user"
      );
    }
  };

  const fields: Field[] = [
    {
      name: "name",
      label: "Full Name",
      placeholder: "Enter Full Name",
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter Email Address",
      required: true,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "Enter Phone Number",
      width: "half",
      required: true,
    },

    ...(flag === 1
      ? [
          {
            name: "organization_type",
            label: "Organization Type",
            fieldType: "select" as const,
            width: "half" as const,
            options: [
              {
                label: "Clinic",
                value: "0",
              },
              {
                label: "School",
                value: "1",
              },
            ],
            required: true,
          },
        ]
      : []),

    {
      name: "address",
      label: "Address Information",
      type: "text",
      placeholder: "Enter Full Address",
      required: true,
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter City",
      width: "quarter",
      required: true,
    },
    {
      name: "State",
      label: "State / Province",
      placeholder:
        "Enter State / Province",
      width: "quarter",
      required: true,
    },
    {
      name: "zipcode",
      label: "Zip Code",
      placeholder: "Enter Zip Code",
      width: "quarter",
      required: true,
    },
    {
      name: "country",
      label: "Country",
      fieldType: "select",
      width: "quarter",
      options: countries,
      required: true,
    },
  ];

  return (
    <>
    <Heading1 text="ADD NEW Zonal Admin" />
    <Paragraph text="Dashboard > Zonal Admin > Add New Zonal Admin" />
    <div className="boxShadow AddInformation">
        {/* <AddNewAdminorg/> */}
    <FormAdd
      heading={getHeading(flag)}
      showProfilePicture={true}
      fields={fields}
      onSubmit={handleSubmit}
    />
    </div>
    </>
  );
};

export default AddInformation;