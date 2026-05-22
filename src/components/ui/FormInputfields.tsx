import React from "react";

export interface FieldConfig {
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  error?: string;
  options?: string[];
};

const FormInputField: React.FC<FieldConfig> = ({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  className = "",   
  required = false,
  error,
}) => {
  return (
    <div className={className}>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      {error && <p>{error}</p>}
    </div>
  );
};

export default FormInputField;