import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, filebasename } from "../../api/config";
import { tokenManager } from "../../services/tokenManager";
import Table from "../ui/Table";
import Loader from "../ui/Loaders";
import SearchWithSort from "../ui/SearchWithSort";
import { getCurrentUserRole } from "../../middleware/AuthMiddleware";
import DashboardButtons from "../ui/Buttons";
import { Heading2 } from "../ui/HeadingPara";
import "../ui/UIstyles.css";

import IButton from "../../assets/Images/iButton.svg";
import type { AvailabilitySlot } from "../ui/TimeSlots";

export interface AppointmentListProps {
  type?: "all" | "completed" | "canceled" | "reschedule" | "online" | "home" | "clinic" | "center" | "video" | string;
  isTeachersOrg?: boolean;
}

interface Appointment {
  _id: string;
  parentId: number;
  teacherId: number;
  availabilityId: string;
  date: string;
  time: string;
  status: string;
  zoomLink: string | null;
  createdAt: string;
  updatedAt: string;

  teacher?: {
    _id: string;
    teacherId: number;
    userId: number;
    name?: string;
    therapist_category?: string;
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
    userId?: number;
  };

  zonalAdmin?: {
    _id: string;
    name: string;
    userId?: number;
  };

  admin?: {
    _id: string;
    name: string;
    userId?: number;
  };
  parentUser?: {
    _id?: string;
    name?: string;
    email?: string;
    userId?: number;
    profileImg?: string | null;
    googleProfile?: {
      name?: string | null;
      picture?: string | null;
      email?: string | null;
    };
    facebookProfile?: {
      name?: string | null;
      picture?: string | null;
      email?: string | null;
    };
  };

  teacherUser?: {
    _id?: string;
    name?: string;
    email?: string;
    userId?: number;
    profileImg?: string | null;
    googleProfile?: {
      name?: string | null;
      picture?: string | null;
      email?: string | null;
    };
    facebookProfile?: {
      name?: string | null;
      picture?: string | null;
      email?: string | null;
    };
  };

  availability?: {
    _id?: string;
    userId?: number;
    date?: string;
    time?: string;
    isBooked?: boolean;
    medium?: string;
    zoomLink?: string | null;
    zoomMeetingId?: string | null;
  };
}

interface AppointmentRow {
  id: string;
  teacherId: number;
  date: string;
  time: string;
  status: string;
  parent: string;
  parentImage?: string | null;
  teacher: string;
  organization: string;
  zonalAdmin: string;
  admin: string;
  zoomLink: string;
  medium?: string;
}

const TableAvatar: React.FC<{ src?: string; name?: string }> = ({ src, name }) => {
  const [imgError, setImgError] = React.useState(false);
  const initial =
    name && name !== "N/A" && name !== "-"
      ? name.trim().charAt(0).toUpperCase()
      : "U";

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name || ""}
        className="doctor-image"
        onError={() => setImgError(true)}
      />
    );
  }

  return <div className="doctor-image-initial">{initial}</div>;
};

const getParentProfileImage = (user: any): string | undefined => {
  if (!user) return undefined;
  const image =
    user.googleProfile?.picture ||
    user.profileImg ||
    user.facebookProfile?.picture ||
    null;

  if (!image) return undefined;
  if (typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://"))) {
    return image;
  }
  return `${filebasename}${image.startsWith("/") ? "" : "/"}${image}`;
};

const parseDateValue = (dateStr: string, timeStr?: string) => {
  if (!dateStr) return 0;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    if (parts[0].length === 2 && parts[2].length === 4) {
      // DD-MM-YYYY -> YYYY-MM-DD
      const isoStr = `${parts[2]}-${parts[1]}-${parts[0]}${timeStr ? `T${timeStr}` : ""}`;
      const time = new Date(isoStr).getTime();
      if (!isNaN(time)) return time;
    } else if (parts[0].length === 4) {
      // YYYY-MM-DD
      const isoStr = `${dateStr}${timeStr ? `T${timeStr}` : ""}`;
      const time = new Date(isoStr).getTime();
      if (!isNaN(time)) return time;
    }
  }
  const parsed = new Date(dateStr).getTime();
  return isNaN(parsed) ? 0 : parsed;
};

interface TeachersOrgTableSectionProps {
  title: string;
  data: AppointmentRow[];
  currentRole: string;
  navigate: (path: string) => void;
}

const TeachersOrgTableSection: React.FC<TeachersOrgTableSectionProps> = ({
  title,
  data,
  currentRole,
  navigate,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" }>({
    key: "date",
    order: "desc",
  });

  const handleFilterClick = (key: string) => {
    setCurrentPage(1);
    setSortConfig((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const sortedData = useMemo(() => {
    const list = [...data];
    const { key, order } = sortConfig;

    list.sort((a, b) => {
      if (key === "date") {
        const timeA = parseDateValue(a.date, a.time);
        const timeB = parseDateValue(b.date, b.time);
        if (timeA !== timeB) {
          return order === "asc" ? timeA - timeB : timeB - timeA;
        }
      }
      const va: string = String((a as any)[key] ?? "").toLowerCase().trim();
      const vb: string = String((b as any)[key] ?? "").toLowerCase().trim();
      const comparison = va.localeCompare(vb, undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return order === "asc" ? comparison : -comparison;
    });
    return list;
  }, [data, sortConfig]);

  const columns = useMemo(
    () => [
      {
        key: "parent",
        title: "Name",
        showFilter: true,
        onFilterClick: () => handleFilterClick("parent"),
        render: (value: string, row: AppointmentRow) => (
          <div className="doctor-info">
            <TableAvatar src={row.parentImage || undefined} name={value || row.parent} />
            <h5>{value || row.parent || "-"}</h5>
          </div>
        ),
        fixed: true,
      },
      {
        key: "teacher",
        title: "Dr Name",
        showFilter: true,
        onFilterClick: () => handleFilterClick("teacher"),
      },
      ...(currentRole !== "TeachersOrg" && currentRole !== "teachersGlobal" && currentRole !== "OrganizationAdmin" && currentRole !== "Admin"
        ? [
            {
              key: "zonalAdmin",
              title: "Zonal Admin",
              showFilter: true,
              onFilterClick: () => handleFilterClick("zonalAdmin"),
            },
          ]
        : []),
      ...(currentRole !== "TeachersOrg" && currentRole !== "teachersGlobal" && currentRole !== "OrganizationAdmin"
        ? [
            {
              key: "admin",
              title: "Admin",
              showFilter: true,
              onFilterClick: () => handleFilterClick("admin"),
            },
          ]
        : []),
      ...(currentRole !== "TeachersOrg" && currentRole !== "teachersGlobal" && currentRole !== "OrganizationAdmin"
        ? [
            {
              key: "organization",
              title: "Organization",
              showFilter: true,
              onFilterClick: () => handleFilterClick("organization"),
            },
          ]
        : []),
      {
        key: "date",
        title: "Date",
        showFilter: true,
        onFilterClick: () => handleFilterClick("date"),
        fixed: true,
      },
      { key: "time", title: "Time", fixed: true },
      {
        key: "status",
        title: "Status",
        showFilter: true,
        onFilterClick: () => handleFilterClick("status"),
        render: (value: string) => (
          <DashboardButtons
            className="status_button"
            text={value}
            variant={
              value?.toLowerCase() === "rescheduled"
                ? "SolidBlue"
                : value?.toLowerCase() === "cancelled"
                ? "SolidYellow"
                : value?.toLowerCase() === "rejected"
                ? "red"
                : "SolidNeon"
            }
          />
        ),
      },
      {
        key: "reschedule",
        title: "Action",
        render: (_value: any, row: any) => (
          <DashboardButtons
            text="View Details"
            icon={<img src={IButton} alt="view" className="btn-icon" />}
            variant="trashparent"
            onClick={() => navigate(`../appointment-details/${row.id}`)}
          />
        ),
        fixed: true,
      },
    ],
    [currentRole, sortConfig, navigate]
  );

  const totalPages = Math.max(Math.ceil(sortedData.length / rowsPerPage), 1);

  return (
    <div className="TeacherTableSection" style={{ marginBottom: "35px" }}>
      <div style={{ marginBottom: "15px", marginTop: "10px" }}>
        <Heading2 text={title} />
      </div>
      <Table
        columns={columns}
        rows={sortedData}
        selectable={true}
        sortBy={sortConfig.key}
        sortOrder={sortConfig.order}
        pagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[4, 8, 12, 20]}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(value) => {
          setRowsPerPage(value);
          setCurrentPage(1);
        }}
        showChooseColumns={true}
      />
    </div>
  );
};

const AppointmentList: React.FC<AppointmentListProps> = ({ type = "all", isTeachersOrg: isTeachersOrgProp }) => {
  const navigate = useNavigate();
  const currentRole = getCurrentUserRole() ?? "";
  const isTeachersOrg = isTeachersOrgProp ?? (currentRole === "TeachersOrg" || currentRole === "teachersGlobal");
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointmentToReschedule, setAppointmentToReschedule] =
    useState<AppointmentRow | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [availabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [availabilityLoading] = useState(false);
  const [statusActionError] = useState<string | null>(null);
  // const [updatingAppointmentId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" }>({
    key: "date",
    order: "desc",
  });
  const currentUser = tokenManager.getUser();
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = tokenManager.getAccessToken();
        // const currentUser = tokenManager.getUser();
        const query = new URLSearchParams();

        // For teachersGlobal or TeachersOrg, filter by their teacherId
        if ((currentRole === "teachersGlobal" || currentRole === "TeachersOrg") && currentUser?.userId) {
          query.set("teacherId", String(currentUser.userId));
        }

        const queryString = query.toString() ? `?${query.toString()}` : "";
        const response = await fetch(
          `${BASE_URL}/appointments${queryString}`,
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
        // console.log("..responseData..", responseData);

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

          if (loginUserFlag !== undefined && loginUserFlag !== null && loginUserId && Number(loginUserFlag) !== 0) {
            appointmentsData = appointmentsData.filter((appointment: any) => {
              let shouldInclude = false;

              switch (Number(loginUserFlag)) {
                case 6: // Zonal Admin - show appointments where zonalAdmin's userId matches
                  shouldInclude = appointment.zonalAdmin?.userId === loginUserId;
                  break;

                case 7: // Admin - show appointments where admin's userId matches
                  shouldInclude = appointment.admin?.userId === loginUserId;
                  break;

                case 1: // Organization Admin - show appointments where organization's userId matches
                  shouldInclude = appointment.organization?.userId === loginUserId;
                  break;

                case 5: // Organization Teacher - show appointments where teacher's userId matches
                  shouldInclude = appointment.teacherUser?.userId === loginUserId;
                  break;

                case 3: // Teacher - show appointments where teacher's userId matches
                  shouldInclude = appointment.teacherUser?.userId === loginUserId;
                  break;

                default:
                  shouldInclude = true;
              }

              return shouldInclude;
            });
          }
        }

        // Apply medium/type filtering based on tab type prop
        if (type && type !== "all") {
          const normalizedType = type.toLowerCase().trim();
          appointmentsData = appointmentsData.filter((item: Appointment) => {
            const medium = (
              item.availability?.medium ||
              (item as any).medium ||
              (item.zoomLink || item.availability?.zoomLink ? "online" : "")
            ).toLowerCase().trim();
            const status = (item.status || "").toLowerCase().trim();

            if (isTeachersOrg) {
              if (normalizedType === "completed") {
                return status === "completed" || status === "approved";
              }
              if (normalizedType === "canceled" || normalizedType === "cancelled") {
                return status === "canceled" || status === "cancelled" || status === "rejected";
              }
              if (normalizedType === "reschedule" || normalizedType === "rescheduled") {
                return status === "rescheduled";
              }
              return true;
            } else {
              if (normalizedType === "online" || normalizedType === "video") {
                return medium === "online" || medium === "video";
              }
              if (normalizedType === "clinic" || normalizedType === "center") {
                return medium === "center" || medium === "clinic";
              }
              if (normalizedType === "home") {
                return medium === "home";
              }
              if (normalizedType === "completed") {
                return status === "completed" || status === "approved";
              }
              if (normalizedType === "canceled" || normalizedType === "cancelled") {
                return status === "canceled" || status === "cancelled" || status === "rejected";
              }
              if (normalizedType === "reschedule" || normalizedType === "rescheduled") {
                return status === "rescheduled";
              }
              return true;
            }
          });
        }

        const formattedRows: AppointmentRow[] = appointmentsData.map(
          (item: Appointment) => ({
            id: item._id,
            teacherId: item.teacherId,
            date: item.date,
            time: item.time,
            status: item.status,
            parent: item.parentUser?.name || "N/A",
            parentImage: getParentProfileImage(item.parentUser),
            teacher: item.teacherUser?.name || "N/A",
            organization: item.organization?.name || "N/A",
            zonalAdmin: item.zonalAdmin?.name || "N/A",
            admin: item.admin?.name || "N/A",
            zoomLink: item.zoomLink || item.availability?.zoomLink || "",
            medium: item.availability?.medium || (item.zoomLink || item.availability?.zoomLink ? "online" : ""),
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
  }, [type, currentRole, currentUser?.userId]);

  const availableTimes = availabilitySlots.filter(
    (slot) => slot.date === rescheduleDate && !slot.isBooked
  );

  const dates = Array.from(new Set(availabilitySlots.map((slot) => slot.date)));

  const handleDateChange = (date: string) => {
    setRescheduleDate(date);
    const firstAvailableTime = availabilitySlots.find(
      (slot) => slot.date === date && !slot.isBooked
    )?.time;
    setRescheduleTime(firstAvailableTime || "");
  };

  const handleReschedule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!appointmentToReschedule || !rescheduleDate || !rescheduleTime) return;

    setRescheduling(true);
    setRescheduleError(null);

    try {
      const token = tokenManager.getAccessToken();
      const response = await fetch(
        `${BASE_URL}/appointments/reschedule/${appointmentToReschedule.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            date: rescheduleDate,
            time: rescheduleTime,
          }),
        }
      );

      const responseData = await response.json().catch(() => null);
      if (!response.ok || !responseData?.success) {
        throw new Error(
          responseData?.message || `Unable to reschedule appointment: ${response.status}`
        );
      }

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === appointmentToReschedule.id
            ? {
                ...appointment,
                date: responseData.data?.date || rescheduleDate,
                time: responseData.data?.time || rescheduleTime,
                status: responseData.data?.status || appointment.status,
              }
            : appointment
        )
      );
      setAppointmentToReschedule(null);
    } catch (rescheduleError) {
      setRescheduleError(
        rescheduleError instanceof Error
          ? rescheduleError.message
          : String(rescheduleError)
      );
    } finally {
      setRescheduling(false);
    }
  };

  // const isSuperAdmin = Number(tokenManager.getUser()?.flag) === 0;

  // console.log("...........currentRole",currentRole);

  const handleFilterClick = (key: string) => {
    setCurrentPage(1);
    setSortConfig((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const columns = useMemo(
    () => [
      {
        key: "parent",
        title: "Name",
        showFilter: true,
        onFilterClick: () => handleFilterClick("parent"),
        render: (value: string, row: AppointmentRow) => (
          <div className="doctor-info">
            <TableAvatar src={row.parentImage || undefined} name={value || row.parent} />
            <h5>{value || row.parent || "-"}</h5>
          </div>
        ),
        fixed: true,
      },
      {
        key: "teacher",
        title: "Dr Name",
        showFilter: true,
        onFilterClick: () => handleFilterClick("teacher"),
      },
      ...(currentRole !== "TeachersOrg" && currentRole !== "teachersGlobal" && currentRole !== "OrganizationAdmin" && currentRole !== "Admin"
      ? [
      {
        key: "zonalAdmin",
        title: "Zonal Admin",
        showFilter: true,
        onFilterClick: () => handleFilterClick("zonalAdmin"),
      },
        ]
      : []),
      ...(currentRole !== "TeachersOrg" && currentRole !== "teachersGlobal" && currentRole !== "OrganizationAdmin"
      ? [
      {
        key: "admin",
        title: "Admin",
        showFilter: true,
        onFilterClick: () => handleFilterClick("admin"),
      },
      ]
      : []),
      ...(currentRole !== "TeachersOrg" && currentRole !== "teachersGlobal" && currentRole !== "OrganizationAdmin"
      ? [
      {
        key: "organization",
        title: "Organization",
        showFilter: true,
        onFilterClick: () => handleFilterClick("organization"),
        
      },
      ]
      : []),
      {
        key: "date",
        title: "Date",
        showFilter: true,
        onFilterClick: () => handleFilterClick("date"),
        fixed: true,
      },
      { key: "time", title: "Time" ,fixed: true, },
      {
        key: "status",
        title: "Status",
        showFilter: true,
        onFilterClick: () => handleFilterClick("status"),
        render: (value: string) => (
          <DashboardButtons
            className="status_button"
            text={value}
            variant={
              value?.toLowerCase() === "rescheduled"
                ? "SolidBlue"
                : value?.toLowerCase() === "cancelled"
                ? "SolidYellow"
                : value?.toLowerCase() === "rejected"
                ? "red"
                : "SolidNeon"
            }
          />
        ),
      },
      {
        key: "reschedule",
        title: "Action",
        render: (_value: any, row: any) => (
          <DashboardButtons
            text="View Details"
            icon={<img src={IButton} alt="view" className="btn-icon" />}
            variant="trashparent"
            onClick={() => navigate(`../appointment-details/${row.id}`)}
          />
        ),
        fixed: true,
      },
    ],
    [currentRole, sortConfig, navigate]
  );

  // Reset page when search changes
  const filteredAndSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    let data = appointments.slice();

    if (q) {
      data = data.filter((r) => {
        return (
          String(r.parent || "").toLowerCase().includes(q) ||
          String(r.teacher || "").toLowerCase().includes(q) ||
          String(r.organization || "").toLowerCase().includes(q) ||
          String(r.zonalAdmin || "").toLowerCase().includes(q) ||
          String(r.admin || "").toLowerCase().includes(q) ||
          String(r.date || "").toLowerCase().includes(q) ||
          String(r.time || "").toLowerCase().includes(q) ||
          String(r.status || "").toLowerCase().includes(q) ||
          String(r.medium || "").toLowerCase().includes(q)
        );
      });
    }

    const { key, order } = sortConfig;
    data.sort((a, b) => {
      if (key === "date") {
        const timeA = parseDateValue(a.date, a.time);
        const timeB = parseDateValue(b.date, b.time);
        if (timeA !== timeB) {
          return order === "asc" ? timeA - timeB : timeB - timeA;
        }
      }
      const va: string = String((a as any)[key] ?? "").toLowerCase().trim();
      const vb: string = String((b as any)[key] ?? "").toLowerCase().trim();
      const comparison = va.localeCompare(vb, undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return order === "asc" ? comparison : -comparison;
    });

    return data;
  }, [appointments, search, sortConfig]);

  const videoAppointments = useMemo(() => {
    return appointments.filter((r) => r.medium === "online");
  }, [appointments]);

  const homeAppointments = useMemo(() => {
    return appointments.filter((r) => r.medium === "home");
  }, [appointments]);

  const clinicAppointments = useMemo(() => {
    return appointments.filter((r) => r.medium === "center" || r.medium === "clinic");
  }, [appointments]);

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="AppointmentsList">
      {!isTeachersOrg && (
        <SearchWithSort
          searchValue={search}
          onSearchChange={setSearch}
          sortValue={sortConfig.order}
          onSortChange={(v: string) =>
            setSortConfig((prev) => ({
              ...prev,
              order: v === "desc" ? "desc" : "asc",
            }))
          }
        />
      )}

      {statusActionError && <div className="error-message">{statusActionError}</div>}

      {error ? (
        <div className="error-message">
          {error}
        </div>
      ) : isTeachersOrg ? (
        <div className="TeachersOrgTables">
          <TeachersOrgTableSection
            title={`Video Appointments (${videoAppointments.length})`}
            data={videoAppointments}
            currentRole={currentRole}
            navigate={navigate}
          />
          <TeachersOrgTableSection
            title={`Home Appointments (${homeAppointments.length})`}
            data={homeAppointments}
            currentRole={currentRole}
            navigate={navigate}
          />
          <TeachersOrgTableSection
            title={`Clinic Appointments (${clinicAppointments.length})`}
            data={clinicAppointments}
            currentRole={currentRole}
            navigate={navigate}
          />
        </div>
      ) : (
        <Table
          columns={columns}
          rows={filteredAndSorted}
          selectable={true}
          sortBy={sortConfig.key}
          sortOrder={sortConfig.order}
          pagination={true}
          currentPage={currentPage}
          totalPages={
            Math.max(
              Math.ceil(
                filteredAndSorted.length / rowsPerPage
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
          showChooseColumns={true}
        />
      )}

      {appointmentToReschedule && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reschedule-title"
          className="reschedule-dialog"
        >
          <form onSubmit={handleReschedule}>
            <h2 id="reschedule-title">Reschedule Appointment</h2>
            {rescheduleError && <div className="error-message">{rescheduleError}</div>}
            <label>
              Date
              <select
                value={rescheduleDate}
                onChange={(event) => handleDateChange(event.target.value)}
                disabled={availabilityLoading || dates.length === 0}
                required
              >
                <option value="">Select a date</option>
                {dates.map((date) => {
                  const hasAvailableTime = availabilitySlots.some(
                    (slot) => slot.date === date && !slot.isBooked
                  );
                  return (
                    <option key={date} value={date} disabled={!hasAvailableTime}>
                      {date}{!hasAvailableTime ? " (No availability)" : ""}
                    </option>
                  );
                })}
              </select>
            </label>
            <label>
              Time
              <select
                value={rescheduleTime}
                onChange={(event) => setRescheduleTime(event.target.value)}
                disabled={availabilityLoading || !rescheduleDate || availableTimes.length === 0}
                required
              >
                <option value="">Select a time</option>
                {availableTimes.map((slot) => (
                  <option key={slot._id} value={slot.time}>
                    {slot.time}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setAppointmentToReschedule(null)}
              disabled={rescheduling}
            >
              Cancel
            </button>
            <button type="submit" disabled={rescheduling || availabilityLoading || !rescheduleTime}>
              {rescheduling ? "Rescheduling..." : "Reschedule"}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default AppointmentList;
