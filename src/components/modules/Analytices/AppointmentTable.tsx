import React from "react";
import AnalyticsCardTable from "../../ui/AnalyticsCardTable";
import Loader from "../../ui/Loaders";

interface AppointmentTableItem {
  id: string;
  profileImage?: string;
  name: string;
  designation: string;
  date: string;
  time: string;
  status: string;
}

interface AppointmentTableProps {
  appointments: AppointmentTableItem[];
  loading?: boolean;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({ appointments, loading = false }) => {
  const appointmentHeaders = [
    { key: "doctor", title: "Doctor's Name" },
    { key: "date", title: "Date" },
    { key: "time", title: "Time" },
    { key: "status", title: "Status" },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {appointments.length > 0 ? (
        <AnalyticsCardTable data={appointments} headers={appointmentHeaders} />
      ) : (
        <div className="no-data">No appointments available</div>
      )}
    </>
  );
};

export default AppointmentTable;
