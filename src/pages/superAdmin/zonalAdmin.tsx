import React, { useState } from "react";
import Table from "../../components/ui/Table"; 
import DashboardButtons from "../../components/ui/Buttons";
import IButton from "../../assets/Images/iButton.svg";

const supZonaladmin: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

const columns = [
  { key: "name", title: "Name" },
  { key: "admin", title: "Admin" },
  { key: "organizations", title: "Organizations" },
  { key: "location", title: "Location" },
  { key: "subscription", title: "Subscription" },
  { key: "pe", title: "PE" },
  { key: "actions", title: "Actions",
    render: (_value: any, row: any) => (
      <DashboardButtons
       text="View Details"
       icon={<img src={IButton} alt="view" className="btn-icon" />}
       variant="trashparent"
       onClick={() => handleViewDetails(row)}
      />
    ),
  },
];

  const rows = [
    { name: "Swati Bazal", admin: "2", organizations: "5", location: "Mumbai, India", subscription: "6", pe: "5",},
    { name: "Swati Bazal", admin: "2", organizations: "5", location: "Mumbai, India", subscription: "6", pe: "5",},
    { name: "Swati Bazal", admin: "2", organizations: "5", location: "Mumbai, India", subscription: "6", pe: "5",},
    { name: "Swati Bazal", admin: "2", organizations: "5", location: "Mumbai, India", subscription: "6", pe: "5",},
    { name: "Swati Bazal", admin: "2", organizations: "5", location: "Mumbai, India", subscription: "6", pe: "5",},
    { name: "Swati Bazal", admin: "2", organizations: "5", location: "Mumbai, India", subscription: "6", pe: "5",},
    { name: "Swati Bazal", admin: "2", organizations: "5", location: "Mumbai, India", subscription: "6", pe: "5",},
    { name: "Swati Bazal", admin: "2", organizations: "5", location: "Mumbai, India", subscription: "6", pe: "5",},
    { name: "Swati Bazal", admin: "2", organizations: "5", location: "Mumbai, India", subscription: "6", pe: "5",},
    { name: "Swati Bazal", admin: "2", organizations: "5", location: "Mumbai, India", subscription: "6", pe: "5",},
  ];

  const handleDeleteSelected = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
  };

  const handleViewDetails = (row: any) => {
  console.log("View Details:", row);

  // Example navigation
  // navigate(`/zonal-admin/viewdetails`);
};

  return (
    <div>
      <Table
        columns={columns}
        rows={rows}
        selectable={true}
        onBulkDelete={true}
        onDeleteSelected={handleDeleteSelected}
        pagination={true}
        currentPage={currentPage}
        totalPages={5}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </div>
  );
};

export default supZonaladmin;