import React, { useEffect, useState } from "react";
import Table from "../ui/Table";
import DashboardButtons from "../ui/Buttons";
import IButton from "../../assets/Images/iButton.svg";
import Loader from "../ui/Loaders";
import { authService } from "../../services/authService";
import { tokenManager } from "../../services/tokenManager";
import ModalBox from "../ui/ModalBox";
import SearchWithSort from "../ui/SearchWithSort";
import { useLocation, useNavigate } from "react-router-dom";
import  { routes } from "../../routes/AppRoutes";
// import PlusIcon from "../../assets/Images/PlusIcon.svg";
import {XIcon} from 'lucide-animated';


interface ColumnConfig {
  key: string;
  title: string;
  sortable?: boolean;
  fixed?: boolean;
}

interface ZonalAdminListProps {
  flag: number | number[];
  columns: ColumnConfig[];
  filteredUserId?: string; // For filtering data by current user (teachersGlobal)
  filterByZonalAdminId?: boolean; // For filtering admins by zonalAdminId (flag 7)
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
      return sortOrder === "desc"
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
  filteredUserId,
  filterByZonalAdminId,
}) => {
  const navigate = useNavigate();
  const flags = Array.isArray(flag) ? flag : [flag];
  const primaryFlag = flags[0];
  const flagDependency = flags.join(",");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState("name");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const location = useLocation();
  const currentRole = location.pathname.split("/")[1];
  
  // Get current user for hierarchical filtering
  const currentUser = tokenManager.getUser();

  /**
   * Determine filter field based on logged-in user's flag
   * Flag 6: Zonal Admin - filter all data by zonalAdminId
   * Flag 7: Admin - filter all data by adminId
   * Flag 1: Organization Admin - filter all data by organizationAdminId
   * Flag 3: Teacher - filter all data by teacherId
   */
  const getFilterFieldByLoginFlag = (): { field: string | null; value: string | number | null } => {
    if (!currentUser?.flag) return { field: null, value: null };

    const userIdValue = currentUser.userId || currentUser.id;
    
    switch (currentUser.flag) {
      case 6: // Zonal Admin
        return { field: "roleData.zonalAdminId", value: userIdValue };
      case 7: // Admin
        return { field: "roleData.adminId", value: userIdValue };
      case 1: // Organization Admin
        return { field: "roleData.organizationAdminId", value: userIdValue };
      case 3: // Teacher
        return { field: "roleData.teacherId", value: userIdValue };
      default:
        return { field: null, value: null };
    }
  };


  const handleSort = (key: string) => {
    setCurrentPage(1);

    setSort((prevSort) =>
      sortBy === key && prevSort === "desc" ? "asc" : "desc"
    );

    setSortBy(key);
  };

  const handleViewDetails = (row: any) => {
    const { userId, flag } = row.originalData;
    // console.log("...........currentRole.............",currentRole);


    if (flag === 6) {
      navigate(routes.SUP_ZONALADMIN_DETAILS, {
        state: { userId , flag },
      });
    } else if (flag === 7) {
      if(currentRole == "superadmin"){
        navigate(routes.SUP_ADMIN_DETAILS, {
          state: { userId , flag },
        });
      }else{
        navigate(routes.ZONAL_ADMIN_DETAILS, {
          state: { userId , flag },
        });
      }

    } else if (flag === 1) {
      if(currentRole == "zonaladmin"){
        navigate(routes.ZONAL_ORGANIZATION_DETAILS, {
          state: { userId , flag },
        });
      }else if(currentRole == "admin"){
        navigate(routes.ADMIN_ORGANIZATION_DETAILS, {
          state: { userId , flag },
        });
      }else{
        navigate(routes.SUP_ORGANIZATION_DETAILS, {
          state: { userId , flag },
        });
      }

    } else if (flag === 3 || flag === 5) {
      if(currentRole == "zonaladmin"){
        navigate(routes.ZONAL_THERAPIST_DETAILS, {
          state: { userId , flag },
        });
      }else if(currentRole == "admin"){
        navigate(routes.ADMIN_THERAPIST_DETAILS, {
          state: { userId , flag },
        });
      }else if(currentRole == "organizationadmin"){
        navigate(routes.ORGANIZATIONADMIN_THERAPIST_DETAILS, {
          state: { userId , flag },
        });
      }else{
        navigate(routes.SUP_THERAPIST_DETAILS, {
          state: { userId , flag },
        });
      }

    }
  };


  const columnRenderMap: Record<string, any> = {
    name: {
      key: "name",
      title: "Name",
      fixed: true,
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

// const [selectedUsers, setSelectedUsers] = useState([]);


  const fetchUsers = async () => {
    try {
      setLoading(true);

      const accessToken = localStorage.getItem("token");

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const responses = await Promise.all(
        flags.map((currentFlag) =>
          authService.getUsersByFlag(
            accessToken,
            currentFlag,
            {
              search: search.trim(),
              sort,
              sortBy: sortFieldMap[sortBy] ?? sortBy,
              sortOrder: sort,
            }
          )
        )
      );
      let users = responses.flatMap((response) => response.data || []);

      // Apply hierarchical filtering based on logged-in user's flag
      const { field, value } = getFilterFieldByLoginFlag();
      if (field && value) {
        users = users.filter((item: any) => {
          const fieldValue = field === "roleData.zonalAdminId"
            ? item.roleData?.zonalAdminId
            : field === "roleData.adminId"
            ? item.roleData?.adminId
            : field === "roleData.organizationAdminId"
            ? item.roleData?.organizationAdminId
            : field === "roleData.teacherId"
            ? item.roleData?.teacherId
            : null;

          return String(fieldValue) === String(value);
        });
      }

      // Filter by filteredUserId if provided (for teachersGlobal users)
      if (filteredUserId) {
        users = users.filter((item: any) => {
          // Show items where the parent/related user matches filteredUserId
          const relatedTeachers = item.relatedData?.teachers?.data || [];
          const isRelatedUser = relatedTeachers.some((teacher: any) => 
            String(teacher.userId) === String(filteredUserId) || 
            String(teacher._id) === String(filteredUserId)
          );
          return isRelatedUser || String(item.userId) === String(filteredUserId);
        });
      }

      // Filter by zonalAdminId if provided (for admin list under zonal admin)
      if (filterByZonalAdminId && currentUser?.userId) {
        users = users.filter((item: any) => 
          String(item.roleData?.zonalAdminId) === String(currentUser.userId)
        );
      }

      // console.log("API Response:", responses);
      const formattedRows = users.map((item: any) => ({
        id: item._id,
        userId: item.userId,
        name: item.org_name ?? item.name ?? "-",
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
  }, [search, sort, sortBy, flagDependency, filteredUserId, filterByZonalAdminId]);

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
    fixed: true,
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

  const getAddButtonText = (flag: number) => {
    switch (flag) {
      case 6:
        return "Add New Zonal Admin";

      case 7:
        return "Add New Admin";

      case 1:
        return "Add New Organization Admin";

      case 3:
        return "Add New Therapist";

      case 2:
        return "Add New Parent";

      default:
        return "Add New User";
    }
  };

  const handleAddInformation = () => {
      let route = routes.SUP_ADDINFORMATION;

      switch (currentRole) {
        case "superadmin":
          route = routes.SUP_ADDINFORMATION;
          break;

        case "zonaladmin":
          route = routes.ZONAL_ADDINFORMATION;
          break;

        case "admin":
          route = routes.ADMIN_ADDINFORMATION;
          break;

        case "organizationadmin":
          route = routes.ORGANIZATIONADMIN_ADDINFORMATION;
          break;

        case "therapist":
          route = routes.THERAPIST_ADDINFORMATION;
          break;

        default:
          route = routes.SUP_ADDINFORMATION;
      }

    navigate(route, {
      state: { flag: primaryFlag },
    });
  };

  return (
    <div>
       <div className="d-flex TableSearchWrap">
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
      {/* <DashboardButtons text="Add New Admin"/> */}
      <div className="AddUpdateButton">
      <DashboardButtons
      variant="neon"
      textsize="sm"
      icon={<XIcon className="PlusIcon" size={20}/>}
        text={getAddButtonText(primaryFlag)}
        // onClick={() =>
        //   navigate(routes.SUP_ADDINFORMATION, {
        //     state: { flag: primaryFlag },
        //   })
        onClick={handleAddInformation}
        // }
      />
      {/* <DashboardButtons text="Export" variant="blueborder" textsize="sm" icon={<img src={ExportIcon} alt="Add" className="btn-icon" onClick={() => exportSelectedRows(selectedUsers)}/>}/>  */}
      </div>
       </div>

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
        showChooseColumns={true}
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
