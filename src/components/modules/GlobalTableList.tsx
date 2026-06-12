import React, { useEffect, useState } from "react";
import Table from "../ui/Table";
import DashboardButtons from "../ui/Buttons";
import IButton from "../../assets/Images/iButton.svg";
import Loader from "../ui/Loaders";
import { authService } from "../../services/authService";
import ModalBox from "../ui/ModalBox";
import SearchWithSort from "../ui/SearchWithSort";
import { useNavigate } from "react-router-dom";
import  { routes } from "../../routes/AppRoutes"

interface ColumnConfig {
  key: string;
  title: string;
  sortable?: boolean;
}

interface ZonalAdminListProps {
  flag: number;
  columns: ColumnConfig[];
}

const getRelatedCount = (item: any, key: string) =>
  item.relatedData?.[key]?.count ??
  item.relatedData?.[key]?.data?.length ??
  0;

const sortRows = (
  rows: any[],
  sortBy: string,
  sortOrder: "asc" | "desc"
) => {
  return [...rows].sort((firstRow, secondRow) => {
    const firstValue = firstRow[sortBy] ?? "";
    const secondValue = secondRow[sortBy] ?? "";

    if (
      typeof firstValue === "number" &&
      typeof secondValue === "number"
    ) {
      return sortOrder === "asc"
        ? firstValue - secondValue
        : secondValue - firstValue;
    }

    const comparison = String(firstValue).localeCompare(
      String(secondValue),
      undefined,
      {
        numeric: true,
        sensitivity: "base",
      }
    );

    return sortOrder === "asc" ? comparison : -comparison;
  });
};

const sortFieldMap: Record<string, string> = {
  name: "name",
  admin: "relatedData.admins.count",
  organizations: "relatedData.organizations.count",
  pe: "relatedData.teachers.count",
  location: "roleData.city",
  subscription: "subscription",
};

const GlobalTableList: React.FC<ZonalAdminListProps> = ({
  flag,
  columns: dynamicColumns,
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState("name");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const handleSort = (key: string) => {
    setCurrentPage(1);

    setSort((prevSort) =>
      sortBy === key && prevSort === "asc" ? "desc" : "asc"
    );

    setSortBy(key);
  };

  const handleViewDetails = (row: any) => {
    console.log("View Details:", row.originalData);


    // navigate(`/zonal-admin/viewdetails/${row.originalData._id}`);
       navigate( `${routes.SUP_ZONALADMIN_DETAILS}` );
  };


  const columnRenderMap: Record<string, any> = {
    name: {
      key: "name",
      title: "Name",
      onFilterClick: handleSort,
    },
    admin: {
      key: "admin",
      title: "Admin",
      onFilterClick: handleSort,
    },
    organizations: {
      key: "organizations",
      title: "Organizations",
      onFilterClick: handleSort,
    },
    location: {
      key: "location",
      title: "Location",
    },
    subscription: {
      key: "subscription",
      title: "Subscription",
      onFilterClick: handleSort,
    },
    pe: {
      key: "pe",
      title: "PE",
      onFilterClick: handleSort,
    },
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const accessToken = localStorage.getItem("token");

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await authService.getUsersByFlag(
        accessToken,
        flag,
        {
          search: search.trim(),
          sort,
          sortBy: sortFieldMap[sortBy] ?? sortBy,
          sortOrder: sort,
        }
      );
      // console.log("API Response:", response);
      const formattedRows = response.data.map((item: any) => ({
        id: item._id,
        userId: item.userId,
        name: item.name,
        email: item.email,
        zonal_admin_name: item.relatedData?.zonalAdmin?.name ?? "-",
        admin_name: item.relatedData?.Admin?.name ?? "-",
        organization_name: item.relatedData?.organizations?.name ?? "-",
        parent_name: item.name ?? "-",
        children_details : getRelatedCount(item, "parents"),
        created: new Date(item.createdAt).toLocaleDateString(),
        parent_count: getRelatedCount(item, "parents"),
        therapists: getRelatedCount(item, "teachers"),
        admin: getRelatedCount(item, "admins"),
        organizations: getRelatedCount(item, "organizations"),
        location:
          [
            item.roleData?.city ?? item.city,
            item.roleData?.state ?? item.state,
          ]
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
  }, [search, sort, sortBy, flag]);

  const handleDeleteSelected = (selectedRows: any[]) => {
    const userIds = selectedRows.map((row) => row.id);

    setSelectedUserIds(userIds);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const accessToken = localStorage.getItem("token");

      if (!accessToken) {
        throw new Error("No access token found");
      }

      await authService.deleteUsers(accessToken, selectedUserIds);

      setRows((prevRows) =>
        prevRows.filter(
          (row) => !selectedUserIds.includes(row.id)
        )
      );

      setShowModal(false);
      setSelectedUserIds([]);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete users");
      setShowModal(false);
    }
  };

  const tableColumns = dynamicColumns.map((column) => ({
    ...(columnRenderMap[column.key] || {
      key: column.key,
      title: column.title,
    }),
    title: column.title,
    showFilter: column.sortable ?? false,
  }));

  tableColumns.push({
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
  });

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
        columns={tableColumns}
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

              <div className="logout-popup-actions d-flex">
                <DashboardButtons
                  text="Cancel"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedUserIds([]);
                  }}
                />

                <DashboardButtons
                  text="Delete"
                  onClick={confirmDelete}
                />
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default GlobalTableList;