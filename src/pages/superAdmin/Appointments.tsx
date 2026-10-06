import React from "react";
import Tabs from "../../components/ui/Tabs";
import AppointmentList from "../../components/modules/appoinmentList";
import { getCurrentUserRole } from "../../middleware/AuthMiddleware";
import { Heading1 } from "../../components/ui/HeadingPara";
import {
  Target,
  Video,
  House,
  Stethoscope,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

const Appointments: React.FC = () => {
  const currentRole = getCurrentUserRole();

  const isTeachersOrg = currentRole === "TeachersOrg";

  const tabs = [
    {
      id: "all",
      label: (
        <span className="AppointmentTab">
          <Target size={45} />
          <span>
            {isTeachersOrg ? "All SESSION" : "All Appointments"}
          </span>
        </span>
      ),
      content: <AppointmentList /> ,
    },
    {
      id: "online",
      label: (
        <span className="AppointmentTab">
          {isTeachersOrg ? (
            <CheckCircle size={45} />
          ) : (
            <Video size={45} />
          )}

          <span>
            {isTeachersOrg ? "Complete SESSION" : "Video Appointments"}
          </span>
        </span>
      ),
      content: <AppointmentList />,
    },
    {
      id: "video",
      label: (
        <span className="AppointmentTab">
          {isTeachersOrg ? (
            <XCircle size={45} />
          ) : (
            <House size={45} />
          )}

          <span>
            {isTeachersOrg ? "Canceled SESSION" : "Home Appointments"}
          </span>
        </span>
      ),
      content: <AppointmentList />,
    },
    {
      id: "clinic",
      label: (
        <span className="AppointmentTab">
          {isTeachersOrg ? (
            <RefreshCw size={45} />
          ) : (
            <Stethoscope size={45} />
          )}

          <span>
            {isTeachersOrg ? "Reschedule SESSION" : "Clinic Appointments"}
          </span>
        </span>
      ),
      content: <AppointmentList />,
    },
  ];

  return (
    <div className="MainDashboard">
      <Heading1 text="Appointments" />
      <Tabs tabs={tabs} variant="Horizontal" />
    </div>
  );
};

export default Appointments;


// const Appointments: React.FC = () => {
//   const currentRole = getCurrentUserRole();
//   const isTeachersOrg = currentRole === "TeachersOrg";

//   const tabs = [
//     {
//       id: "all",
//       label: (
//         <span className="AppointmentTab">
//           <Target size={45} />
//           <span>
//             {isTeachersOrg ? "All SESSION" : "All Appointments"}
//           </span>
//         </span>
//       ),
//       content: (
//         <AppointmentList
//           type={isTeachersOrg ? "all" : "all"}
//         />
//       ),
//     },

//     {
//       id: "online",
//       label: (
//         <span className="AppointmentTab">
//           {isTeachersOrg ? (
//             <CheckCircle size={45} />
//           ) : (
//             <Video size={45} />
//           )}

//           <span>
//             {isTeachersOrg ? "Complete SESSION" : "Video Appointments"}
//           </span>
//         </span>
//       ),
//       content: (
//         <AppointmentList
//           type={isTeachersOrg ? "completed" : "online"}
//         />
//       ),
//     },

//     {
//       id: "video",
//       label: (
//         <span className="AppointmentTab">
//           {isTeachersOrg ? (
//             <XCircle size={45} />
//           ) : (
//             <House size={45} />
//           )}

//           <span>
//             {isTeachersOrg ? "Canceled SESSION" : "Home Appointments"}
//           </span>
//         </span>
//       ),
//       content: (
//         <AppointmentList
//           type={isTeachersOrg ? "canceled" : "home"}
//         />
//       ),
//     },

//     {
//       id: "clinic",
//       label: (
//         <span className="AppointmentTab">
//           {isTeachersOrg ? (
//             <RefreshCw size={45} />
//           ) : (
//             <Stethoscope size={45} />
//           )}

//           <span>
//             {isTeachersOrg ? "Reschedule SESSION" : "Clinic Appointments"}
//           </span>
//         </span>
//       ),
//       content: (
//         <AppointmentList
//           type={isTeachersOrg ? "reschedule" : "clinic"}
//         />
//       ),
//     },
//   ];

//   return (
//     <div className="MainDashboard">
//       <Tabs tabs={tabs} variant="Horizontal" />
//     </div>
//   );
// };

// export default Appointments;