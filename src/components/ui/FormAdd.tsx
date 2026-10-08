import React, { useState } from "react";
import PlaceholderImage from "../../assets/Images/PlaceholderImage.svg"; 
import { Heading2 } from "./HeadingPara";
import DashboardButtons from "./Buttons";

// interface Field {
//   name: string;
//   label: string;
//   type?: string;
//   placeholder?: string;
//   width?: "half" | "full" | "quarter";
//   fieldType?: "input" | "select";
//   required?: boolean;
//   options?: {
//     label: string;
//     value: string;
//   }[];
// }

export type Field = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  width?: "half" | "full" | "quarter";
  fieldType?: "input" | "select";
  required?: boolean;
  multiple?: boolean;
  options?: {
    label: string;
    value: string;
  }[];
  readOnly?: boolean;
  value?: string;
  showWhen?: {
  field: string;
  value: string;
};
};

interface ProfileFormProps {
  fields: Field[];
  showProfilePicture?: boolean;
  heading?: string;
  onSubmit: (data: Record<string, any>) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  fields,
  showProfilePicture = true,
  onSubmit,
  heading,
}) => {
  const getInitialData = () => {
    const initial: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.value !== undefined) {
        initial[field.name] = field.value;
      }
    });
    return initial;
  };

  const [formData, setFormData] = useState<Record<string, any>>(getInitialData);
  const [preview, setPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    setFormData((prev) => {
      const updated = { ...prev };
      let changed = false;
      fields.forEach((field) => {
        if (field.value !== undefined && updated[field.name] === undefined) {
          updated[field.name] = field.value;
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [fields]);

  const isFieldVisible = (field: Field, data = formData) => {
    if (!field.showWhen) return true;
    const currentVal = data[field.showWhen.field] ?? fields.find((f) => f.name === field.showWhen?.field)?.value;
    return currentVal === field.showWhen.value;
  };

  const updateFormData = (name: string, value: any) => {
    const nextFormData = {
      ...formData,
      [name]: value,
    };

    fields.forEach((field) => {
      if (!isFieldVisible(field, nextFormData)) {
        delete nextFormData[field.name];
      }
    });

    setFormData(nextFormData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData(e.target.name, e.target.value);
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, options: selectOptions, multiple } = e.target;

    if (multiple) {
      const selectedValues = Array.from(selectOptions)
        .filter((option) => option.selected)
        .map((option) => option.value);

      updateFormData(name, selectedValues);
      return;
    }

    updateFormData(name, e.target.value);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setFormData({
        ...formData,
        profileImage: file,
      });

      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const defaults = getInitialData();
      await onSubmit({ ...defaults, ...formData });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<form className="add_information" onSubmit={handleSubmit}>
  <div className="top-section">
    {showProfilePicture && (
      <div className="profile-upload">
        <label htmlFor="profile-image">
          <img src={preview || PlaceholderImage} alt="Profile" className="profile-preview" />
        </label>

        <input id="profile-image" type="file" accept="image/*" hidden onChange={handleImageChange} />
      </div>
    )}

    <div className="right-fields">
      {heading && <Heading2 text={heading} />}
      {fields
        .filter((field) => isFieldVisible(field))
        .filter(
          (field) => field.name === "name" || field.name === "email"
        )
        .map((field) => (
          <div className="form-group" key={field.name}>
            <label>
              {field.label}
              {field.required && <span className="required-star">*</span>}
            </label>
              {field.fieldType === "select" ? (
                <select
                  name={field.name}
                  multiple={field.multiple}
                  value={field.multiple
                    ? (Array.isArray(formData[field.name]) ? formData[field.name] : [])
                    : (formData[field.name] ?? field.value ?? "")}
                  onChange={handleSelectChange}
                  required={field.required && !field.multiple}
                  disabled={field.readOnly}
                >
                {!field.multiple && (
                  <option value="" disabled>
                    {field.placeholder || `Select ${field.label}`}
                  </option>
                )}
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={formData[field.name] ?? field.value ?? ""}
                  onChange={handleChange}
                  required={field.required}
                  readOnly={field.readOnly}
                />
              )}
          </div>
        ))}
    </div>
  </div>

<div className="bottom-fields">
  {fields
    .filter((field) => isFieldVisible(field))
    .filter(
      (field) => field.name !== "name" && field.name !== "email"
    )
    .map((field) => (
    <div
      key={field.name}
      className={`form-group ${
        field.width === "half"
          ? "half-width"
          : field.width === "quarter"
          ? "quarter-width"
          : "full-width"
      }`}
    >
    <label>
      {field.label}
      {field.required && <span className="required-star">*</span>}
    </label>

      {field.fieldType === "select" ? (
          <select
            name={field.name}
            multiple={field.multiple}
            value={field.multiple
              ? (Array.isArray(formData[field.name]) ? formData[field.name] : [])
              : (formData[field.name] ?? field.value ?? "")}
            onChange={handleSelectChange}
            required={field.required && !field.multiple}
            disabled={field.readOnly}
          >
          {!field.multiple && <option value="">Select {field.label}</option>}

          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={field.name}
          type={field.type || "text"}
          placeholder={field.placeholder}
          value={formData[field.name] ?? field.value ?? ""}
          onChange={handleChange}
          required={field.required}
          readOnly={field.readOnly}
        />
      )}
      </div>
    ))}
</div>

{/* <div className="submit-section">
  <DashboardButtons text="Add" type="submit" variant="neon"
  />
</div> */}
<div className="submit-section">
  <DashboardButtons
    text={isSubmitting ? "Adding..." : "Add"}
    type="submit"
    variant="neon"
    disabled={isSubmitting}
  />
</div>
</form>
  );
};

export default ProfileForm;
