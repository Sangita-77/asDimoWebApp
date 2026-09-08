import React from "react";
import Tabs from "./Tabs";
import "./Calendar.css";
import { Heading2 } from "../../components/ui/HeadingPara";
import { Video, House, Stethoscope, } from "lucide-react";

const TimeSlots: React.FC = () => {
  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
  ];

  const renderTimeSlots = () => (
    <>
    <Heading2 text="Available Time Slots"/>
    <div className="TimeSlots">
      {timeSlots.map((time) => (
        <button
          type="button"
          className="TimeSlotButton"
          key={time}
        >
          {time}
        </button>
      ))}
    </div>
    </>
  );


const tabs = [
  {
    id: "video",
    label: (
      <span className="AppointmentTab">
        <Video size={45} />
        Video Appointments
      </span>
    ),
    content: renderTimeSlots(),
  },
  {
    id: "home",
    label: (
      <span className="AppointmentTab">
        <House size={45} />
        Home Appointments
      </span>
    ),
    content: renderTimeSlots(),
  },
  {
    id: "clinic",
    label: (
      <span className="AppointmentTab">
        <Stethoscope size={45} />
        Clinic Appointments
      </span>
    ),
    content: renderTimeSlots(),
  },
];


return (
    <div className="TimeSlotsWrapper">
      <Tabs
        tabs={tabs}
        variant="Horizontal"
      />
    </div>
  );
};

export default TimeSlots;