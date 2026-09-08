import React from "react";
import Calendar from "../../components/ui/CalenderAppointment";
import TimeSlots from "../../components/ui/TimeSlots";
import { Heading2 } from "../../components/ui/HeadingPara";
import DashboardButtons from "../../components/ui/Buttons";

const AppointmentDetails: React.FC = () => {
  return (
    <div className="AppointmentDetails">

      <div className="AppointmentDate">
       <Heading2 text="Calendar"/>

        <Calendar
          minDate={new Date()} onChange={(date) => { console.log("Selected date:", date); }}
        />
      </div>

      <TimeSlots/>
        <div className="d-flex SaveButton">
            <DashboardButtons text="Save" variant="neon"/>
            <DashboardButtons text="Change Time" variant="OrangeSolid"/>
        </div>
    </div>
  );
};

export default AppointmentDetails;