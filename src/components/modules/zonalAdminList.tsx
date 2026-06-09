import React, { useEffect, useState } from "react";
import Table from "../ui/Table";
import DashboardButtons from "../ui/Buttons";
import IButton from "../../assets/Images/iButton.svg";
import Loader from "../ui/Loaders";
import { authService } from "../../services/authService";
import { getStoredUser } from "../../middleware/AuthMiddleware";
import ModalBox from "../ui/ModalBox";
import SearchWithSort from "../ui/SearchWithSort";

const getRelatedCount = (item: any, key: string) =>
  item.relatedData?.[key]?.count ?? item.relatedData?.[key]?.data?.length ?? 0;

const sortRows = (rows: any[], sortBy: string, sortOrder: "asc" | "desc") => {
  return [...rows].sort((firstRow, secondRow) => {
    const firstValue = firstRow[sortBy] ?? "";
    const secondValue = secondRow[sortBy] ?? "";

    if (typeof firstValue === "number" && typeof secondValue === "number") {
      return sortOrder === "asc"
        ? firstValue - secondValue
        : secondValue - firstValue;
    }

    const comparison = String(firstValue).localeCompare(String(secondValue), undefined, {
      numeric: true,
      sensitivity: "base",
    });

    return sortOrder === "asc" ? comparison : -comparison;
  });
};

const sortFieldMap: Record<string, string> = {
  admin: "relatedData.admins.count",
  organizations: "relatedData.organizations.count",
  pe: "relatedData.teachers.count",
  location: "roleData.city",
};

const  zonalAdminList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState("name");

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

      const response = await authService.getUsersByFlag(accessToken, 6, {
        search: search.trim(),
        sort,
        sortBy: sortFieldMap[sortBy] ?? sortBy,
        sortOrder: sort,
      });

      const formattedRows = response.data.map((item: any) => ({
        id: item._id,
        userId: item.userId,
        name: item.name,
        admin: getRelatedCount(item, "admins"),
        organizations: getRelatedCount(item, "organizations"),
        location:
          [item.roleData?.city ?? item.city, item.roleData?.state ?? item.state]
            .filter(Boolean)
            .join(", ") || "-",
        subscription: "-",
        pe: getRelatedCount(item, "teachers"),
        originalData: item,
      }));

      setRows(sortRows(formattedRows, sortBy, sort));
    } catch (error) {
      console.error("Error fetching users:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchUsers();
    }, search.trim() ? 400 : 0);

    return () => window.clearTimeout(timeoutId);
  }, [search, sort, sortBy]);

  const handleSort = (key: string) => {
    setCurrentPage(1);
    setSortBy(key);
    setSort((prevSort) =>
      sortBy === key && prevSort === "asc" ? "desc" : "asc"
    );
  };

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
    { key: "name", title: "Name", showFilter: true, onFilterClick: handleSort,},
    { key: "admin", title: "Admin", showFilter: true, onFilterClick: handleSort, },
    { key: "organizations", title: "Organizations", showFilter: true, onFilterClick: handleSort, },
    { key: "location", title: "Location" },
    { key: "subscription", title: "Subscription", showFilter: true, onFilterClick: handleSort,},
    { key: "pe", title: "PE", showFilter: true, onFilterClick: handleSort,},
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
      <SearchWithSort
        searchValue={search}
        onSearchChange={setSearch}
        sortValue={sort}
        onSortChange={(value) => {
          if (value === "asc" || value === "desc") {
            setSort(value);
          }
        }}
      />
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
        sortBy={sortBy}
        sortOrder={sort}
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

export default zonalAdminList;
