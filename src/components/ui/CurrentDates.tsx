import React from "react";
import "./UIstyles.css";

interface DateSlot {
  date: Date;
  booked: boolean;
}

interface DateSlotsProps {
  bookedDates?: string[];
  onDateSelect?: (date: Date) => void;
}

const CurrentDates: React.FC<DateSlotsProps> = ({
  bookedDates = [],
  onDateSelect,
}) => {
  const today = new Date();

  const dates: DateSlot[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    const dateString = date.toISOString().split("T")[0];

    return {
      date,
      booked: bookedDates.includes(dateString),
    };
  });

  const currentMonth = today.toLocaleDateString("en-US", {
  month: "long",
});

  return (
    <div className="boxShadow">
    <div className="currentMonth">{currentMonth}</div>    
    <div className="d-flex date-slots">
      {dates.map(({ date, booked }) => {
        const day = date.toLocaleDateString("en-US", {
          weekday: "short",
        });

        return (
          <button
            key={date.toISOString()}
            className={`date-slot ${booked ? "booked" : ""}`}
            onClick={() => onDateSelect?.(date)}
          >
            <span className="date-day">{day}</span>
            <span className="date-number">{date.getDate()}</span>
          </button>
        );
      })}
    </div>
    </div>
  );
};

export default CurrentDates;