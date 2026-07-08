import React, { useEffect, useMemo, useState } from "react";
import { BASE_URL } from "../../api/config";
import { tokenManager } from "../../services/tokenManager";
import Table from "../../components/ui/Table";
import Loader from "../../components/ui/Loaders";
import { Heading1 } from "../../components/ui/HeadingPara";
import SearchWithSort from "../../components/ui/SearchWithSort";
import { getCurrentUserRole } from "../../middleware/AuthMiddleware";

interface Appointment {
  _id: string;
  parentId: number;
  teacherId: number;
  availabilityId: string;
  date: string;
  time: string;
  status: string;
  zoomLink: string;
  createdAt: string;
  updatedAt: string;

  teacher?: {
    _id: string;
    teacherId: number;
    userId: number;
    name?: string;
  };

  parent?: {
    _id: string;
    parentId: number;
    userId: number;
    name?: string;
  };

  organization?: {
    _id: string;
    name: string;
  };

  zonalAdmin?: {
    _id: string;
    name: string;
  };

  admin?: {
    _id: string;
    name: string;
  };
    parentUser?: {
        _id: string;
        name: string;
    };

    teacherUser?: {
        _id: string;
        name: string;
    };
}

interface AppointmentRow {
  id: string;
  date: string;
  time: string;
  status: string;
  parent: string;
  teacher: string;
  organization: string;
  zonalAdmin: string;
  admin: string;
  zoomLink: string;
}

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<string>("date");

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = tokenManager.getAccessToken();
        const currentRole = getCurrentUserRole();
        const currentUser = tokenManager.getUser();
        const query = new URLSearchParams();

        if (search) query.set("search", search);
        if (sortBy) query.set("sortBy", sortBy);
        if (sort) query.set("sortOrder", sort);

        // For teachersGlobal, filter by their teacherId
        if (currentRole === "teachersGlobal" && currentUser?.userId) {
          query.set("teacherId", String(currentUser.userId));
        }

        const response = await fetch(
          `${BASE_URL}/appointments?${query.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);

          throw new Error(
            errorData?.message ||
              `Failed to fetch appointments: ${response.status}`
          );
        }

        let responseData = await response.json();
        console.log("..responseData..", responseData);

        if (!responseData.success) {
          throw new Error(
            responseData.message || "Unable to load appointments"
          );
        }

        // Apply hierarchical filtering based on logged-in user's flag
        let appointmentsData = responseData.data || [];

        if (currentUser) {
          const loginUserFlag = currentUser.flag;
          const loginUserId = currentUser.userId;

          console.log("Filtering appointments - Flag:", loginUserFlag, "UserId:", loginUserId);

          if (loginUserFlag && loginUserId) {
            appointmentsData = appointmentsData.filter((appointment: any) => {
              let shouldInclude = false;

              switch (Number(loginUserFlag)) {
                case 6: // Zonal Admin - show appointments where zonalAdmin's userId matches
                  shouldInclude = appointment.zonalAdmin?.userId === loginUserId;
                  console.log(`Flag 6 check - zonalAdmin.userId: ${appointment.zonalAdmin?.userId}, loginUserId: ${loginUserId}, include: ${shouldInclude}`);
                  break;

                case 7: // Admin - show appointments where admin's userId matches
                  shouldInclude = appointment.admin?.userId === loginUserId;
                  console.log(`Flag 7 check - admin.userId: ${appointment.admin?.userId}, loginUserId: ${loginUserId}, include: ${shouldInclude}`);
                  break;

                case 1: // Organization Admin - show appointments where organization's userId matches
                  shouldInclude = appointment.organization?.userId === loginUserId;
                  console.log(`Flag 1 check - organization.userId: ${appointment.organization?.userId}, loginUserId: ${loginUserId}, include: ${shouldInclude}`);
                  break;

                case 5: // Organization Admin - show appointments where organization's userId matches
                  shouldInclude = appointment.teacherUser?.userId === loginUserId;
                  console.log(`Flag 5 check - teacherUser.userId: ${appointment.teacherUser?.userId}, loginUserId: ${loginUserId}, include: ${shouldInclude}`);
                  break;

                case 3: // Teacher - show appointments where teacher's userId matches
                  shouldInclude = appointment.teacherUser?.userId === loginUserId;
                  console.log(`Flag 3 check - teacherUser.userId: ${appointment.teacherUser?.userId}, loginUserId: ${loginUserId}, include: ${shouldInclude}`);
                  break;

                default:
                  shouldInclude = true;
              }

              return shouldInclude;
            });

            console.log("Filtered appointments count:", appointmentsData.length);
          } else {
            console.log("currentUser flag or userId is missing - showing all appointments");
          }
        } else {
          console.log("currentUser is null - showing all appointments");
        }

        const formattedRows: AppointmentRow[] = appointmentsData.map(
          (item: Appointment) => ({
            id: item._id,
            date: item.date,
            time: item.time,
            status: item.status,
            parent: item.parentUser?.name || "N/A",
            teacher: item.teacherUser?.name || "N/A",
            organization: item.organization?.name || "N/A",
            zonalAdmin: item.zonalAdmin?.name || "N/A",
            admin: item.admin?.name || "N/A",
            zoomLink: item.zoomLink || "",
          })
        );

        setAppointments(formattedRows);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : String(fetchError)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [search, sortBy, sort]);

  const columns = useMemo(
    () => [
      {
        key: "parent",
        title: "Name",
        // showFilter: true,
        onFilterClick: () => handleFilterClick("parentUser"),
      },
      {
        key: "teacher",
        title: "Dr Name",
        // showFilter: true,
        onFilterClick: () => handleFilterClick("teacherUser"),
      },
      {
        key: "zonalAdmin",
        title: "Zonal Admin",
        // showFilter: true,
        onFilterClick: () => handleFilterClick("zonalAdmin"),
      },
      {
        key: "admin",
        title: "Admin",
        // showFilter: true,
        onFilterClick: () => handleFilterClick("admin"),
      },
      {
        key: "organization",
        title: "Organization",
        // showFilter: true,
        onFilterClick: () => handleFilterClick("organization"),
      },
      {
        key: "date",
        title: "Date",
        // showFilter: true,
        onFilterClick: () => handleFilterClick("date"),
      },
      { key: "time", title: "Time" },
      {
        key: "status",
        title: "Status",
        // showFilter: true,
        onFilterClick: () => handleFilterClick("status"),
      },
      {
        key: "zoomLink",
        title: "Zoom Link",
        render: (value: string) =>
          value ? (
            <a href={value} target="_blank" rel="noreferrer">
              Join
            </a>
          ) : (
            "N/A"
          ),
      },
    ],
    []
  );

  function handleFilterClick(key: string) {
    setCurrentPage(1);
    if (sortBy === key) {
      setSort((s) => (s === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSort("asc");
    }
  }

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

//   const filteredAndSorted = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     let data = appointments.slice();

//     if (q) {
//       data = data.filter((r) => {
//         return (
//           String(r.parent).toLowerCase().includes(q) ||
//           String(r.teacher).toLowerCase().includes(q) ||
//           String(r.organization).toLowerCase().includes(q) ||
//           String(r.date).toLowerCase().includes(q) ||
//           String(r.time).toLowerCase().includes(q) ||
//           String(r.status).toLowerCase().includes(q)
//         );
//       });
//     }

//     data.sort((a, b) => {
//       const va: string = String((a as any)[sortBy] ?? "");
//       const vb: string = String((b as any)[sortBy] ?? "");
//       return sort === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
//     });

//     return data;
//   }, [appointments, search, sort, sortBy]);

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div>
      <Heading1 text="Appointments" />

      <SearchWithSort
        searchValue={search}
        onSearchChange={setSearch}
        sortValue={sort}
        onSortChange={(v: string) => setSort(v === "desc" ? "desc" : "asc")}
      />

      {error ? (
        <div className="error-message">
          {error}
        </div>
      ) : (
        <Table
          columns={columns}
          rows={appointments}
          pagination={true}
          currentPage={currentPage}
          totalPages={
            Math.max(
              Math.ceil(
                appointments.length / rowsPerPage
              ),
              1
            )
          }
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(value) => {
            setRowsPerPage(value);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          sortOrder={sort}
        />
      )}
    </div>
  );
};

export default AppointmentList;