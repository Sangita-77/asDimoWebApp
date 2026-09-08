import React, { useEffect, useState } from "react";
import Tabs from "./Tabs";
import "./Calendar.css";
import { Heading2 } from "../../components/ui/HeadingPara";
import DashboardButtons from "../../components/ui/Buttons";
import {
  Video,
  House,
  Stethoscope,
} from "lucide-react";

type AppointmentType = "video" | "home" | "clinic";

interface TimeSlotData {
  video: string[];
  home: string[];
  clinic: string[];
}

interface TimeSlotsProps {
  selectedDate: Date | null;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  selectedDate,
}) => {
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

  const [savedSlots, setSavedSlots] = useState<
    Record<string, TimeSlotData>
  >({});


  const [currentSlots, setCurrentSlots] =
    useState<TimeSlotData>({
      video: [],
      home: [],
      clinic: [],
    });

  const [isEditing, setIsEditing] = useState(false);

  const emptySlots: TimeSlotData = {
    video: [],
    home: [],
    clinic: [],
  };

  const getDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!selectedDate) {
      setCurrentSlots(emptySlots);
      setIsEditing(false);
      return;
    }

    const dateKey = getDateKey(selectedDate);

    if (savedSlots[dateKey]) {
      setCurrentSlots(savedSlots[dateKey]);
    } else {
      setCurrentSlots(emptySlots);
    }

    setIsEditing(false);
  }, [selectedDate, savedSlots]);

  const toggleTimeSlot = (
    type: AppointmentType,
    time: string
  ) => {
    if (!isEditing) return;

    setCurrentSlots((prev) => {
      const selected = prev[type].includes(time);

      return {
        ...prev,
        [type]: selected
          ? prev[type].filter((slot) => slot !== time)
          : [...prev[type], time],
      };
    });
  };


  const handleSave = () => {
    if (!selectedDate) return;
    const dateKey = getDateKey(selectedDate);
    setSavedSlots((prev) => ({
      ...prev,
      [dateKey]: currentSlots,
    }));
    setIsEditing(false);
  };


  const handleCancel = () => {
    if (!selectedDate) return;
    const dateKey = getDateKey(selectedDate);
    setCurrentSlots(
      savedSlots[dateKey] || emptySlots
    );

    setIsEditing(false);
  };

  const renderTimeSlots = (
    type: AppointmentType
  ) => (
    <>
      <div className="TimeSlotsHeading">
        <Heading2 text="Available Time Slots" />
      </div>

      <div className="TimeSlots">
        {timeSlots.map((time) => {
          const isSelected =
            currentSlots[type].includes(time);

          return (
            <button
              key={time}
              type="button"
              disabled={!isEditing}
              className={`TimeSlotButton ${
                isSelected ? "selected" : ""
              }`}
              onClick={() =>
                toggleTimeSlot(type, time)
              }
            >
              {time}
            </button>
          );
        })}
      </div>
      <div className="TimeSlotsActions d-flex">
          {!isEditing ? (
            <DashboardButtons text="Change Time" variant="OrangeSolid" onClick={() => setIsEditing(true)}/>
          ) : (
            <>
            <DashboardButtons text="Save" variant="neon" onClick={handleSave}/>
            <DashboardButtons text="Cancel" variant="OrangeSolid" onClick={handleCancel}/>
            </>
          )}
        </div>
    </>
  );

  const tabs = [
    {
      id: "video",
      label: (
        <span className="AppointmentTab">
          <Video size={45} />
          <span>Video Appointments</span>
        </span>
      ),
      content: renderTimeSlots("video"),
    },
    {
      id: "home",
      label: (
        <span className="AppointmentTab">
          <House size={45} />
          <span>Home Appointments</span>
        </span>
      ),
      content: renderTimeSlots("home"),
    },
    {
      id: "clinic",
      label: (
        <span className="AppointmentTab">
          <Stethoscope size={45} />
          <span>Clinic Appointments</span>
        </span>
      ),
      content: renderTimeSlots("clinic"),
    },
  ];

  if (!selectedDate) {
    return (
      <div className="TimeSlotsWrapper">
        <p>Please select a date first.</p>
      </div>
    );
  }

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