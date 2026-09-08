import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, } from "lucide-react"; 
import "./Calendar.css";

interface CalendarProps { value?: Date; onChange?: (date: Date) => void; minDate?: Date; maxDate?: Date; }

const Calendar: React.FC<CalendarProps> = ({ value, onChange, minDate, maxDate, }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>( value || null );

  const [currentMonth, setCurrentMonth] = useState( value || new Date() ); 
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthName = currentMonth.toLocaleString("en-US", {
    month: "long",
  });

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const previousMonthDays = new Date(
      year,
      month,
      0
    ).getDate();

    const result: {
      date: Date;
      currentMonth: boolean;
    }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      result.push({
        date: new Date(year, month - 1, previousMonthDays - i),
        currentMonth: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      result.push({
        date: new Date(year, month, day),
        currentMonth: true,
      });
    }

    const remaining = 42 - result.length;

    for (let day = 1; day <= remaining; day++) {
      result.push({
        date: new Date(year, month + 1, day),
        currentMonth: false,
      });
    }

    return result;
  }, [year, month]);

  const previousMonth = () => {
    setCurrentMonth(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(year, month + 1, 1)
    );
  };

  const isSameDay = (date1: Date | null, date2: Date) => {
    if (!date1) return false;

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isToday = (date: Date) => {
    return isSameDay(new Date(), date);
  };

  const isDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;

    return false;
  };

  const handleDateClick = (date: Date) => {
    if (isDisabled(date)) return;

    setSelectedDate(date);
    onChange?.(date);
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          type="button"
          className="calendar-nav-button"
          onClick={previousMonth}
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="calendar-month">
          <CalendarDays size={18} />

          <span>
            {monthName} {year}
          </span>
        </div>

        <button
          type="button"
          className="calendar-nav-button"
          onClick={nextMonth}
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>
     <div className="calenderBody">
        <div className="calendar-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day) => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            )
          )}
        </div>

        <div className="calendar-days">
          {days.map(({ date, currentMonth }, index) => {
            const selected = isSameDay(selectedDate, date);
            const today = isToday(date);
            const disabled = isDisabled(date);

            return (
              <button
                key={`${date.toISOString()}-${index}`}
                type="button"
                disabled={disabled}
                className={[
                  "calendar-day",
                  !currentMonth ? "other-month" : "",
                  selected ? "selected" : "",
                  today ? "today" : "",
                  disabled ? "disabled" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleDateClick(date)}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;