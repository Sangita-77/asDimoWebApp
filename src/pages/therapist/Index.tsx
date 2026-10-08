import React, { useState } from "react";
import CurrentDates from "../../components/ui/CurrentDates";
import Tabs from "../../components/ui/Tabs";
import AppointmentList from "../../components/modules/appoinmentList";
import { getCurrentUserRole } from "../../middleware/AuthMiddleware";
import { Heading2 } from "../../components/ui/HeadingPara";
import {
  Video,
  House,
  Stethoscope,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

interface TimeSlot {
  time: string;
  booked: boolean;
}

interface Availability {
  [type: string]: TimeSlot[];
}



const Dashboard: React.FC = () => {
  const today = new Date();
  const currentRole = getCurrentUserRole();
  const [selectedDate, setSelectedDate] =
    useState<Date>(today);

  const availabilityByDate: Record<string, Availability> = {
    /*
     * TODAY
     */
    [getDateKey(today)]: {
      "At Clinic": [
        {
          time: "09:00 - 10:00 AM",
          booked: false,
        },
        {
          time: "10:00 - 11:00 AM",
          booked: true,
        },
        {
          time: "03:30 - 04:30 PM",
          booked: false,
        },
        {
          time: "04:30 - 05:30 PM",
          booked: true,
        },
        {
          time: "05:30 - 06:30 PM",
          booked: false,
        },
      ],

      "Video Conference": [
        {
          time: "09:00 - 10:00 AM",
          booked: true,
        },
        {
          time: "10:00 - 11:00 AM",
          booked: false,
        },
        {
          time: "03:30 - 04:30 PM",
          booked: false,
        },
        {
          time: "04:30 - 05:30 PM",
          booked: true,
        },
        {
          time: "05:30 - 06:30 PM",
          booked: false,
        },
      ],

      "At Home": [
        {
          time: "09:00 - 10:00 AM",
          booked: false,
        },
        {
          time: "10:00 - 11:00 AM",
          booked: true,
        },
        {
          time: "03:30 - 04:30 PM",
          booked: true,
        },
        {
          time: "04:30 - 05:30 PM",
          booked: false,
        },
        {
          time: "05:30 - 06:30 PM",
          booked: false,
        },
      ],
    },

    /*
     * TOMORROW
     */
    [getDateKey(addDays(today, 1))]: {
      "At Clinic": [
        {
          time: "09:00 - 10:00 AM",
          booked: true,
        },
        {
          time: "10:00 - 11:00 AM",
          booked: false,
        },
        {
          time: "11:00 - 12:00 PM",
          booked: false,
        },
        {
          time: "02:00 - 03:00 PM",
          booked: true,
        },
        {
          time: "04:30 - 05:30 PM",
          booked: false,
        },
      ],

      "Video Conference": [
        {
          time: "09:00 - 10:00 AM",
          booked: false,
        },
        {
          time: "10:00 - 11:00 AM",
          booked: true,
        },
        {
          time: "01:00 - 02:00 PM",
          booked: false,
        },
        {
          time: "03:00 - 04:00 PM",
          booked: true,
        },
      ],

      "At Home": [
        {
          time: "09:00 - 10:00 AM",
          booked: true,
        },
        {
          time: "11:00 - 12:00 PM",
          booked: false,
        },
        {
          time: "02:00 - 03:00 PM",
          booked: false,
        },
        {
          time: "04:00 - 05:00 PM",
          booked: true,
        },
      ],
    },

    /*
     * DAY 3
     */
    [getDateKey(addDays(today, 2))]: {
      "At Clinic": [
        {
          time: "10:00 - 11:00 AM",
          booked: false,
        },
        {
          time: "11:00 - 12:00 PM",
          booked: true,
        },
        {
          time: "03:30 - 04:30 PM",
          booked: false,
        },
      ],

      "Video Conference": [
        {
          time: "09:00 - 10:00 AM",
          booked: false,
        },
        {
          time: "12:00 - 01:00 PM",
          booked: true,
        },
        {
          time: "04:30 - 05:30 PM",
          booked: false,
        },
      ],

      "At Home": [
        {
          time: "09:00 - 10:00 AM",
          booked: true,
        },
        {
          time: "01:00 - 02:00 PM",
          booked: false,
        },
        {
          time: "03:30 - 04:30 PM",
          booked: false,
        },
      ],
    },

    /*
     * DAY 4
     */
    [getDateKey(addDays(today, 3))]: {
      "At Clinic": [
        {
          time: "09:00 - 10:00 AM",
          booked: false,
        },
        {
          time: "10:00 - 11:00 AM",
          booked: false,
        },
        {
          time: "02:00 - 03:00 PM",
          booked: true,
        },
      ],

      "Video Conference": [
        {
          time: "10:00 - 11:00 AM",
          booked: true,
        },
        {
          time: "01:00 - 02:00 PM",
          booked: false,
        },
        {
          time: "03:00 - 04:00 PM",
          booked: false,
        },
      ],

      "At Home": [
        {
          time: "09:00 - 10:00 AM",
          booked: false,
        },
        {
          time: "11:00 - 12:00 PM",
          booked: true,
        },
        {
          time: "04:00 - 05:00 PM",
          booked: false,
        },
      ],
    },

    /*
     * DAY 5
     */
    [getDateKey(addDays(today, 4))]: {
      "At Clinic": [
        {
          time: "09:00 - 10:00 AM",
          booked: true,
        },
        {
          time: "11:00 - 12:00 PM",
          booked: false,
        },
        {
          time: "03:30 - 04:30 PM",
          booked: false,
        },
      ],

      "Video Conference": [
        {
          time: "09:00 - 10:00 AM",
          booked: false,
        },
        {
          time: "10:00 - 11:00 AM",
          booked: false,
        },
        {
          time: "02:00 - 03:00 PM",
          booked: true,
        },
      ],

      "At Home": [
        {
          time: "10:00 - 11:00 AM",
          booked: true,
        },
        {
          time: "01:00 - 02:00 PM",
          booked: false,
        },
        {
          time: "04:30 - 05:30 PM",
          booked: false,
        },
      ],
    },

    /*
     * DAY 6
     */
    [getDateKey(addDays(today, 5))]: {
      "At Clinic": [
        {
          time: "09:00 - 10:00 AM",
          booked: false,
        },
        {
          time: "10:00 - 11:00 AM",
          booked: true,
        },
        {
          time: "03:00 - 04:00 PM",
          booked: false,
        },
      ],

      "Video Conference": [
        {
          time: "09:00 - 10:00 AM",
          booked: true,
        },
        {
          time: "12:00 - 01:00 PM",
          booked: false,
        },
        {
          time: "04:00 - 05:00 PM",
          booked: false,
        },
      ],

      "At Home": [
        {
          time: "10:00 - 11:00 AM",
          booked: false,
        },
        {
          time: "02:00 - 03:00 PM",
          booked: true,
        },
        {
          time: "05:00 - 06:00 PM",
          booked: false,
        },
      ],
    },

    /*
     * DAY 7
     */
    [getDateKey(addDays(today, 6))]: {
      "At Clinic": [
        {
          time: "09:00 - 10:00 AM",
          booked: false,
        },
        {
          time: "01:00 - 02:00 PM",
          booked: true,
        },
        {
          time: "04:00 - 05:00 PM",
          booked: false,
        },
      ],

      "Video Conference": [
        {
          time: "10:00 - 11:00 AM",
          booked: false,
        },
        {
          time: "02:00 - 03:00 PM",
          booked: false,
        },
        {
          time: "05:00 - 06:00 PM",
          booked: true,
        },
      ],

      "At Home": [
        {
          time: "09:00 - 10:00 AM",
          booked: true,
        },
        {
          time: "12:00 - 01:00 PM",
          booked: false,
        },
        {
          time: "03:00 - 04:00 PM",
          booked: false,
        },
      ],
    },
  };

    const isTeachersOrg = currentRole === "TeachersOrg" || currentRole === "teachersGlobal";
    const tabs = [
    // {
    //   id: "all",
    //   label: (
    //     <span className="AppointmentTab">
    //       <Target size={45} />
    //       <span>
    //         {isTeachersOrg ? "All SESSION" : "All Appointments"}
    //       </span>
    //     </span>
    //   ),
    //   content: <AppointmentList type="all" isTeachersOrg={isTeachersOrg} />,

    // },
    {
      id: "online",
      label: (
        <span className="AppointmentTab">
          {isTeachersOrg ? (
            <CheckCircle size={45} />
          ) : (
            <Video size={45} />
          )}
             Video Appointments
        </span>
      ),
      content: <AppointmentList type={isTeachersOrg ? "completed" : "online"} isTeachersOrg={isTeachersOrg} />,
    },
    {
      id: "home",
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
      content: <AppointmentList type={isTeachersOrg ? "canceled" : "home"} isTeachersOrg={isTeachersOrg} />,
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
      content: <AppointmentList type={isTeachersOrg ? "reschedule" : "clinic"} isTeachersOrg={isTeachersOrg} />,
    },
  ];

  const selectedDateKey = getDateKey(selectedDate);

  const selectedAvailability =
    availabilityByDate[selectedDateKey] || {};

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);

    // Clear previously selected time
  };

  const handleTimeSelect = () => {
  };

  return (
    <>
      {/* DATE SELECTOR */}
      <CurrentDates
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />

      {/* AVAILABLE TIME HEADER */}
      <div className="available-time-header">
        <h2>Available Time</h2>

        <button
          type="button"
          className="change-time-btn"
        >
          Change Time
        </button>
      </div>

      {/* SELECTED DATE */}
      <div className="selected-date-label">
        {selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </div>

      {/* TIME SLOTS */}
      {Object.entries(selectedAvailability).map(
        ([type, slots]) => (
          <div
            className="time-section"
            key={type}
          >
            <h3>{type}</h3>

            <div className="time-slots">
              {slots.map((slot) => {
                const isSelected =
                    selectedDateKey &&
                    slot.time;

                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={slot.booked}
                    className={`
                      time-slot
                      ${slot.booked ? "booked" : ""}
                      ${
                        isSelected
                          ? "selected"
                          : ""
                      }
                    `}
                    onClick={() => {
                      if (!slot.booked) {
                        handleTimeSelect(
                        );
                      }
                    }}
                  >
                    <span className="time-text">
                      {slot.time}
                    </span>

                    {slot.booked && (
                      <span className="slot-status">
                        Booked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* NO AVAILABILITY */}
      {Object.keys(selectedAvailability)
        .length === 0 && (
          <div className="no-slots">
            No time slots available for this date.
          </div>
      )}
      <Heading2 text="Upcoming Appointment"/>
      <Tabs tabs={tabs} variant="Horizontal" />
  </>
  );
};

/*
 * Convert Date into:
 * YYYY-MM-DD
 */
function getDateKey(date: Date): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/*
 * Add days without modifying
 * the original Date object.
 */
function addDays(
  date: Date,
  days: number
): Date {
  const result = new Date(date);

  result.setDate(
    result.getDate() + days
  );

  return result;
}

export default Dashboard;