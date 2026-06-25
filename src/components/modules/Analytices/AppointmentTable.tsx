import AnalyticsCardTable from "../../ui/AnalyticsCardTable";
const AppointmentTable: React.FC = () => {

const doctorsheaders = [
  { key: "doctor", title: "Doctor's Name" },
  { key: "date", title: "Date" },
  { key: "time", title: "Time" },
  { key: "status", title: "Status" },
];

const doctors = [
  {
    id: 1,
    profileImage: "/images/profile1.png",
    name: "Dr. P.K. Chakraborty",
    designation: "Cardiologist",
    date: "20 Jun 2026",
    time: "10:00 AM",
    status: "Upcoming",
  },
  {
    id: 2,
    profileImage: "/images/profile2.png",
    name: "Dr. Rahul Sen",
    designation: "Dentist",
    date: "18 Jun 2026",
    time: "12:30 PM",
    status: "Complete",
  },
  {
    id: 3,
    profileImage: "/images/profile3.png",
    name: "Dr. Priya Das",
    designation: "Neurologist",
    date: "22 Jun 2026",
    time: "02:00 PM",
    status: "cancelled",
  },
  {
    id: 4,
    profileImage: "/images/profile4.png",
    name: "Dr. Amit Roy",
    designation: "Dermatologist",
    date: "25 Jun 2026",
    time: "04:00 PM",
    status: "Rescheduled",
  },
];

  return (
    <>
    <AnalyticsCardTable data={doctors} headers={doctorsheaders}/>
    </>
      );
};

export default AppointmentTable;