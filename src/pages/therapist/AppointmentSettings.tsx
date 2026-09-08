import React, { useState } from "react";
import Calendar from "../../components/ui/CalenderAppointment";
import TimeSlots from "../../components/ui/TimeSlots";
import { Heading2 } from "../../components/ui/HeadingPara";

const AppointmentDetails: React.FC = () => {

  const [selectedDate, setSelectedDate] =
  useState<Date | null>(new Date());

  
  return (
    <div className="AppointmentDetails">

      <div className="AppointmentDate">
       <Heading2 text="Calendar"/>

        <Calendar
          minDate={new Date()} onChange={(date) => { console.log("Selected date:", date); }}
        />
      </div>

      <TimeSlots selectedDate={selectedDate}/>
    </div>
  );
};

export default AppointmentDetails;