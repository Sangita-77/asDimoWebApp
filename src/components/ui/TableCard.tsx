import React from "react";
import "./UIstyles.css";

interface TableField {
  label: string;
  path: string;
}

interface TableCardProps {
  title?: string;
  data: Record<string, any>;
  fields?: TableField[];
}

const getNestedValue = (obj: any, path: string) => {
  const value = path.split(".").reduce((acc, key) => acc?.[key], obj);

  // console.log("Path:", path);
  // console.log("Value:", value);

  return value;
};
const TableCard: React.FC<TableCardProps> = ({
  title,
  data,
  fields = [],
}) => {
  return (
    <div className="table-card">
      {title && <h3>{title}</h3>}

      {fields.map((field) => (
        <div key={field.path} className="table-card-row">
          <span className="table-card-label">
            {field.label}:
          </span>

          <span className="table-card-value">
            {String(getNestedValue(data, field.path) ?? "-")}
          </span>
        </div>
      ))}
    </div>
  );
};


export default TableCard;