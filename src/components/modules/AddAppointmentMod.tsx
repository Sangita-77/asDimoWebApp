
import React, { useState } from "react";
import {
  LayoutGrid,
  Building2,
  Stethoscope,
  UserRound,
  CalendarDays,
  Video,
  House,
  Hospital,
} from "lucide-react";

import ProfileForm from "../ui/FormAdd";
import type { Field } from "../ui/FormAdd";
import DashboardButtons from "../ui/Buttons";
import Calendar from "../ui/CalenderAppointment";
import "./BookAppointment.css";

type SessionType = "Video Session" | "Clinic Session" | "Home Session";
type PaymentStatus = "Paid" | "Unpaid";

const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM"];

const sessions: { name: SessionType; icon: React.ReactNode }[] = [
  { name: "Video Session", icon: <Video /> },
  { name: "Clinic Session", icon: <Hospital /> },
  { name: "Home Session", icon: <House /> },
];

const appointmentFields: Field[] = [
  {
    name: "parent",
    label: "Select Parent",
    fieldType: "select",
    width: "full",
    required: true,
    placeholder: "Select Parent",
    icon: <UserRound />,
    options: [
      { label: "Parent 1", value: "Parent 1" },
      { label: "Parent 2", value: "Parent 2" },
      { label: "Parent 3", value: "Parent 3" },
    ],
  },
  {
    name: "category",
    label: "Select Category",
    fieldType: "select",
    width: "half",
    required: true,
    placeholder: "Select Category",
    icon: <LayoutGrid />,
    options: [
      { label: "Speech Therapy", value: "Speech Therapy" },
      { label: "Occupational Therapy", value: "Occupational Therapy" },
      { label: "Behavior Therapy", value: "Behavior Therapy" },
    ],
  },
  {
    name: "city",
    label: "Select City",
    fieldType: "select",
    width: "half",
    required: true,
    placeholder: "Select City",
    icon: <Building2 />,
    options: [
      { label: "Mumbai", value: "Mumbai" },
      { label: "Pune", value: "Pune" },
      { label: "Delhi", value: "Delhi" },
    ],
  },
  {
    name: "therapist",
    label: "Select Therapist",
    fieldType: "select",
    width: "full",
    required: true,
    placeholder: "Select Therapist",
    icon: <Stethoscope />,
    options: [
      { label: "Therapist 1", value: "Therapist 1" },
      { label: "Therapist 2", value: "Therapist 2" },
      { label: "Therapist 3", value: "Therapist 3" },
    ],
  },
];

const BookAppointment: React.FC = () => {
  const [appointmentFormData, setAppointmentFormData] = useState<
    Record<string, any>
  >({});

  const [formKey, setFormKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [selectedTimes, setSelectedTimes] = useState<
    Partial<Record<SessionType, string>>
  >({});

  const [payment, setPayment] = useState<PaymentStatus>("Unpaid");
  const [payableAmount, setPayableAmount] = useState("1500");

  const handleTimeSelect = (session: SessionType, time: string) => {
    setSelectedTimes((previous) => ({
      ...previous,
      [session]: time,
    }));
  };

  const handleCancel = () => {
    setAppointmentFormData({});
    setFormKey((previous) => previous + 1);
    setSelectedDate(null);
    setSelectedTimes({});
    setPayment("Unpaid");
    setPayableAmount("1500");
  };

  const getFormattedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleBooking = () => {
    const { parent, category, city, therapist } = appointmentFormData;

    if (!parent || !category || !city || !therapist) {
      alert("Please select Parent, Category, City and Therapist.");
      return;
    }

    if (!selectedDate) {
      alert("Please select an appointment date.");
      return;
    }

    if (Object.keys(selectedTimes).length === 0) {
      alert("Please select at least one session time.");
      return;
    }

    const bookingData = {
      parent,
      category,
      city,
      therapist,
      date: getFormattedDate(selectedDate),
      sessions: selectedTimes,
      payment,
      payableAmount: payment === "Paid" ? 0 : Number(payableAmount),
    };

    console.log("Appointment Booking:", bookingData);
    alert("Appointment booked successfully!");
  };

  return (
    <div className="appointment-form">
      {/* Appointment Details */}
      <div className="appointment-profile-form">
        <ProfileForm
          key={formKey}
          fields={appointmentFields}
          showProfilePicture={false}
          showSubmitButton={false}
          onSubmit={() => {}}
          onChange={setAppointmentFormData}
        />
      </div>

      {/* Date and Time */}
      <div className="form-group full-width date-section">
        <label className="section-label">
          <span className="section-icon">
            <CalendarDays />
          </span>
          Select Date
        </label>

        <div className="date-time-container">
          <div className="appointment-calendar">
            <Calendar
              value={selectedDate ?? undefined}
              onChange={(date) => {
                setSelectedDate(date);
                setSelectedTimes({});
              }}
              minDate={new Date()}
              availableDates={[]}
            />
          </div>

          {/* Time Slots */}
          <div className="time-slots-container">
            <h3>Select Time</h3>

            {sessions.map((session) => (
              <div className="session-group" key={session.name}>
                <div className="session-heading">
                  <span>{session.icon}</span>
                  <p>{session.name}</p>
                </div>

                <div className="time-buttons">
                  {timeSlots.map((time) => (
                    <button
                      type="button"
                      key={time}
                      className={
                        selectedTimes[session.name] === time
                          ? "selected-time"
                          : ""
                      }
                      onClick={() => handleTimeSelect(session.name, time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="payment-options">
        <label>
          <input
            type="radio"
            name="payment"
            value="Paid"
            checked={payment === "Paid"}
            onChange={() => setPayment("Paid")}
          />
          <span className="custom-radio" />
          Paid
        </label>

        <label>
          <input
            type="radio"
            name="payment"
            value="Unpaid"
            checked={payment === "Unpaid"}
            onChange={() => setPayment("Unpaid")}
          />
          <span className="custom-radio" />
          Unpaid
        </label>
      </div>

      {/* Footer */}
      <div className="appointment-footer">
        {payment === "Unpaid" && (
          <div className="payable-amount">
            <label>Payable Amount -</label>
            <span>₹</span>
            <input
              type="number"
              min="0"
              value={payableAmount}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPayableAmount(event.target.value)
              }
            />
          </div>
        )}

        <div className="TimeSlotsActions d-flex">
          <DashboardButtons
            text="Cancel"
            variant="SolidBlue"
            textsize="md"
            type="button"
            onClick={handleCancel}
          />

          <DashboardButtons
            text="Book Appointment"
            variant="SolidYellow"
            textsize="md"
            type="submit"
            onClick={handleBooking}
          />
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
