import { useState } from "react";

import "./auth.css";

import type { FieldConfig } from "../../components/ui/FormInputfields";
import FormInputField from "../../components/ui/FormInputfields";

import { Heading1 } from "../../components/ui/HeadingPara";

import Button from "../../components/ui/Buttons";

type ForgetPasswordProps = {
  onBackToLogin: () => void;
};

function ForgetPassword({
  onBackToLogin,
}: ForgetPasswordProps) {
  const [formData, setFormData] = useState({
    password: "",
    confirmpassword: "",
  });

  const [errors, setErrors] = useState<{
    password?: string;
    confirmpassword?: string;
  }>({});

  const fields: FieldConfig[] = [
    { label: "New Password", name: "password", type: "password", placeholder: "Enter your password", required: true, },
    { label: "Confirm Password", name: "confirmpassword", type: "password", placeholder: "Re-Enter your password", required: true, },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!formData.confirmpassword) {
      newErrors.confirmpassword =
        "Confirm Password is required";
    }

    if (
      formData.password &&
      formData.confirmpassword &&
      formData.password !== formData.confirmpassword
    ) {
      newErrors.confirmpassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Password Reset Success:", formData);
    }
  };

  return (
    <div className="login-box">
      <Heading1 text="NEW PASSWORD" />

      <div className="LogIn">
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <FormInputField
              key={field.name}
              {...field}
              value={
                formData[
                  field.name as keyof typeof formData
                ]
              }
              onChange={handleChange}
              error={
                errors[
                  field.name as keyof typeof errors
                ]
              }
            />
          ))}

          <Button
            text="Already logged in? Back to Login"
            variant="trashparent"
            className="ForgetPassword"
            type="button"
            onClick={onBackToLogin}
          />

          <Button
            type="submit"
            text="Set New Password"
            width="full"
            textsize="md"
          />
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;