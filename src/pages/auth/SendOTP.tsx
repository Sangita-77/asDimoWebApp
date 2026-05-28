import { useState } from "react";

import "./auth.css";

import type { FieldConfig } from "../../components/ui/FormInputfields";
import FormInputField from "../../components/ui/FormInputfields";

import { Heading1 } from "../../components/ui/HeadingPara";

import Button from "../../components/ui/Buttons";

type SendOTPProps = {
  onBackToLogin: () => void;
  onOTPSuccess: () => void;
};

function SendOTP({
  onBackToLogin,
  onOTPSuccess,
}: SendOTPProps) {
  const [showOTPField, setShowOTPField] =
    useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
    otp5: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    otp?: string;
  }>({});

  const fields: FieldConfig[] = [
    {
      label: "ENTER YOUR e-MAIL",
      name: "email",
      type: "email",
      placeholder: "Enter your email",
      required: true,
    },
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

    // SEND OTP
    if (!showOTPField) {
      if (!formData.email) {
        newErrors.email =
          "Email is required";
      }

      setErrors(newErrors);

      if (
        Object.keys(newErrors).length === 0
      ) {
        console.log(
          "OTP Sent to:",
          formData.email
        );

        setShowOTPField(true);
      }

      return;
    }

    // VERIFY OTP
    const otp =
      formData.otp1 +
      formData.otp2 +
      formData.otp3 +
      formData.otp4 +
      formData.otp5;

    if (otp.length < 5) {
      newErrors.otp =
        "Please enter valid OTP";
    }

    setErrors(newErrors);

    if (
      Object.keys(newErrors).length === 0
    ) {
      console.log(
        "OTP Verified:",
        otp
      );

      // Navigate to Forget Password
      onOTPSuccess();
    }
  };

  return (
    <div className="login-box">
      <Heading1 text="Forget Password" />

      <div className="LogIn">
        <form onSubmit={handleSubmit}>
          {!showOTPField &&
            fields.map((field) => (
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

          {/* OTP Fields */}
          {showOTPField && (
            <>
              <label className="otp-label">
                ENTER OTP
              </label>

              <div className="otp-wrapper">
                {[1, 2, 3, 4, 5].map((num) => (
                  <input
                    key={num}
                    type="text"
                    maxLength={1}
                    name={`otp${num}`}
                    value={
                      formData[
                        `otp${num}` as keyof typeof formData
                      ]
                    }
                    onChange={handleChange}
                    className="otp-input"
                  />
                ))}
              </div>

              {errors.otp && (
                <p className="error-text">
                  {errors.otp}
                </p>
              )}
            </>
          )}

          <Button
            text="Already logged in? Back to Login"
            variant="trashparent"
            className="ForgetPassword"
            type="button"
            onClick={onBackToLogin}
          />

          <Button
            type="submit"
            text={
              showOTPField
                ? "VERIFY OTP"
                : "SEND OTP"
            }
            width="full"
            textsize="md"
          />
        </form>
      </div>
    </div>
  );
}

export default SendOTP;