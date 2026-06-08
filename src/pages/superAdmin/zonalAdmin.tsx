import React, { useEffect, useState } from "react";
import Table from "../../components/ui/Table";
import DashboardButtons from "../../components/ui/Buttons";
import IButton from "../../assets/Images/iButton.svg";
import Loader from "../../components/ui/Loaders";
import { authService } from "../../services/authService";
import { getStoredUser } from "../../middleware/AuthMiddleware";
import ModalBox from "../../components/ui/ModalBox";

const SupZonaladmin: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const user = getStoredUser();
      const accessToken = localStorage.getItem("token");

      console.log("Current User:", user);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await authService.getUsersByFlag(accessToken, 6);

      const formattedRows = response.data.map((item: any) => ({
        id: item._id,
        userId: item.userId,
        name: item.name,
        admin: "-",
        organizations: "-",
        location:
          [item.city, item.state].filter(Boolean).join(", ") || "-",
        subscription: "-",
        pe: "-",
        originalData: item,
      }));

      setRows(formattedRows);
    } catch (error) {
      console.error("Error fetching users:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Opens confirmation modal
  const handleDeleteSelected = (selectedRows: any[]) => {
    const userIds = selectedRows.map((row) => row.id);

    setSelectedUserIds(userIds);
    setShowModal(true);
  };

  // Actual delete API call
  const confirmDelete = async () => {
    try {
      const accessToken = localStorage.getItem("token");

      if (!accessToken) {
        throw new Error("No access token found");
      }

      await authService.deleteUsers(accessToken, selectedUserIds);

      setRows((prevRows) =>
        prevRows.filter((row) => !selectedUserIds.includes(row.id))
      );

      setShowModal(false);
      setSelectedUserIds([]);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete users");
      setShowModal(false);
    }
  };

  const handleViewDetails = (row: any) => {
    console.log("View Details:", row.originalData);

    // navigate(`/zonal-admin/viewdetails/${row.originalData._id}`);
  };

  const columns = [
    { key: "name", title: "Name" },
    { key: "admin", title: "Admin" },
    { key: "organizations", title: "Organizations" },
    { key: "location", title: "Location" },
    { key: "subscription", title: "Subscription" },
    { key: "pe", title: "PE" },
    {
      key: "actions",
      title: "Actions",
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

  if (loading) {
    return <Loader fullScreen />;
  }

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
        totalPages={Math.ceil(rows.length / rowsPerPage) || 1}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
      />

      {showModal && (
        <ModalBox
          header="Confirm Delete"
          onCancel={() => {
            setShowModal(false);
            setSelectedUserIds([]);
          }}
          body={
            <div style={{ textAlign: "center" }}>
              <p>
                Are you sure you want to delete{" "}
                {selectedUserIds.length === 1
                  ? "this user?"
                  : `${selectedUserIds.length} users?`}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  className="dashboardBtn"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedUserIds([]);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="dashboardBtn"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default SupZonaladmin;