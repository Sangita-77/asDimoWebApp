import AnalyticsCardTable from "../../ui/AnalyticsCardTable";
const DoctorListCard: React.FC = () => {

const doctorsListheaders = [
  { key: "doctor", title: "Doctors List" },
];


const doctors = [
  {
    id: 1,
    profileImage: "/images/profile1.png",
    name: "Dr. P.K. Chakraborty",
    designation: "Cardiologist",
  },
  {
    id: 2,
    profileImage: "/images/profile2.png",
    name: "Dr. Rahul Sen",
    designation: "Dentist",
  },
  {
    id: 3,
    profileImage: "/images/profile3.png",
    name: "Dr. Priya Das",
    designation: "Neurologist",
  },
  {
    id: 4,
    profileImage: "/images/profile4.png",
    name: "Dr. Amit Roy",
    designation: "Dermatologist",
  },
  {
    id: 5,
    profileImage: "/images/profile4.png",
    name: "Dr. Amit Roy",
    designation: "Dermatologist",
  },
];

  return (
    <>
    <AnalyticsCardTable data={doctors} headers={doctorsListheaders}/>
    </>
      );
};

export default DoctorListCard;