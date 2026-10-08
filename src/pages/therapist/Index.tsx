import { Heading2 } from "../../components/ui/HeadingPara";
import CurrentDates from "../../components/ui/CurrentDates";

const MainDashboard: React.FC = () => {
  const bookedDates = [
    "2026-10-06",
    "2026-10-08",
    "2026-10-10",
  ];

  return (
    <>
      <Heading2 text="DASHBOARD" />

      <CurrentDates bookedDates={bookedDates} />
    </>
  );
};

export default MainDashboard;


// import React from "react";
// import Analytices from "../../components/modules/Analytices";

// const MainDashboard: React.FC= ({

// }) => {
//   return (
//     <div className="MainDashboard">
//         <Analytices/>
//     </div>
//   );
// };

// export default MainDashboard;