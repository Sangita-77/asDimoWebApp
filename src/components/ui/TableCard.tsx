import React from "react";
import "./UIstyles.css";

interface TableCardProps {
  title?: string;
  data: Record<string, any>;
}

const TableCard: React.FC<TableCardProps> = ({ title, data }) => {
  return (
    <div className="table-card">
      {title && <h3 className="table-card-title">{title}</h3>}

      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="table-card-row">
          <span className="table-card-label">{key}:</span>
          <span className="table-card-value">{String(value)}</span>
        </div>
      ))}
    </div>
  );
};

export default TableCard;