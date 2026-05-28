import { useState } from "react";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/AppRoutes";

import type { FieldConfig } from "../../components/ui/FormInputfields";
import FormInputField from "../../components/ui/FormInputfields";

import { Heading1 } from "../../components/ui/HeadingPara";

import Logo from "../../assets/Images/Logo.svg";

import Button from "../../components/ui/Buttons";

function ForgetPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});


  const fields: FieldConfig[] = [
    { label: "New Password", name: "password", type: "password", placeholder: "Enter your password", required: true, },
    { label: "Confirm Password", name: "confirmpassword", type: "password", placeholder: "Re-Enter your password", required: true, },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form Submitted:", formData);
    }
  };


  return (
    <div className="FormContainer">
      <div className="IndexHeader">
        <img src={Logo} alt="ASDimo" />
      </div>

      <div className="login-box">
        <Heading1 text="Forget Password" />

          <div className="LogIn">
            <form onSubmit={handleSubmit}>
              {fields.map((field) => (
                <FormInputField
                  key={field.name}
                  {...field}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  error={errors[field.name as keyof typeof errors]}
                />
              ))}
              <Button text="Already logged in? No need to reset your password." variant="trashparent" className="ForgetPassword" onClick={() => navigate(routes.LOGIN)} />
              <Button type="submit" text="Proceed" width="full" textsize="md"/>
            </form>
          </div>

      </div>
    </div>
  );
}

export default ForgetPassword;