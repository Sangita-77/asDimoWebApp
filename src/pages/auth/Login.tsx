import { useState } from "react";

import "./auth.css";

import type { FieldConfig } from "../../components/ui/FormInputfields";
import FormInputField from "../../components/ui/FormInputfields";

import { Heading1 } from "../../components/ui/HeadingPara";

import Button from "../../components/ui/Buttons";

type LoginProps = {
  onForgotPassword: () => void;
};

function Login({ onForgotPassword }: LoginProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const fields: FieldConfig[] = [
    { label: "Email", name: "email", type: "email", placeholder: "Enter your email", required: true, },
    { label: "Password", name: "password", type: "password", placeholder: "Enter your password", required: true, },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="login-box">
      <Heading1 text="LOGIN" />

      <div className="LogIn">
        <form>
          {fields.map((field) => (
            <FormInputField
              key={field.name}
              {...field}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              error={errors[field.name as keyof typeof errors]}
            />
          ))}

          <Button
            text="Forget Your password?"
            variant="trashparent"
            className="ForgetPassword"
            type="button"
            onClick={onForgotPassword}
          />

          <Button
            type="submit"
            text="Proceed"
            width="full"
            textsize="md"
          />
        </form>
      </div>
    </div>
  );
}

export default Login;