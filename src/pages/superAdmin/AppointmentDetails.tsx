import React from "react";
import {
  CalendarDays,
  X,
  UserRound,
  Building2,
  CreditCard,
  ChevronDown,
} from "lucide-react";  
import {CalendarDaysIcon, ArrowLeftIcon, XIcon, UserIcon} from 'lucide-animated';
import { Heading1, Paragraph, Paragraph2 } from "../../components/ui/HeadingPara";

import DashboardButtons from "../../components/ui/Buttons";

import "./AppointmentDetails.css";

const AppointmentDetails: React.FC = () => {

  const patientName = "Rajiv Sharma";
  const patientInfo = [
    { label: "Parent Name", value: "Rajiv Sharma" },
    { label: "Date of Birth", value: "12 March 2018" },
    { label: "Age", value: "8 Years" },
  ];

  const contactInfo = [
    { label: "Contact Number", value: "+91 98765 43210" },
    { label: "Email", value: "rajiv@email.com" },
    { label: "Address", value: "Kolkata, West Bengal" },
  ];

  const doctorInfo = [
    { label: "Doctor Name", value: "Dr. Arjun Mehta" },
    { label: "Specialization", value: "Child Neurologist" },
    { label: "Qualification", value: "MBBS, MD, DM" },
    { label: "Contact", value: "+91 90000 00000" },
    { label: "Appointment Date", value: "14 April 2026" },
    { label: "Appointment Time", value: "09:00 AM - 11:00 AM" },
    { label: "Consultation Type", value: "Physical Visit" },
  ];

  const organisationInfo = [
    { label: "Organisation Name", value: "Dr. Arjun Mehta" },
    { label: "Admin Name", value: "Child Neurologist" },
    { label: "Zonal Admin Name", value: "MBBS, MD, DM" },
  ];

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="appointment-header">
        <div>
          <Heading1 text="Appointment DETAILS"/>
          <Paragraph text="View and manage appointment information."/>
        </div>

        <div className="header-actions">
          <DashboardButtons text="Reschedule" variant="blueborder" textsize="sm" icon={<CalendarDaysIcon size={18} className="icon" />}/>
          <DashboardButtons textsize="sm" variant="redborder" text="Cancel Appointment" icon={<XIcon size={18} />} />
          <DashboardButtons text="Back to Appointments" variant="blueborder" textsize="sm" icon={<ArrowLeftIcon size={18} className="icon" />}/>
        </div>
      </div>

      {/* ================= PATIENT DETAILS ================= */}
      <section className="details-card patient-card">

        <div className="card-title blue-title">
          <span className="title-icon">
            <UserIcon size={20} />
          </span>
          <Paragraph2 text="Patient/Appointment Taking Person Details"/>
        </div>

        <div className="patient-content">

          <div className="patient-profile">
            
            <div className="patient-avatar">
              <img
                src="/images/patient-avatar.jpg"
                alt={patientName}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />

              <span className="patient-initial hidden">
                {patientName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="info-list">
              {patientInfo.map((item, index) => (
                <InfoRow
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </div>

          <div className="vertical-divider" />

            <div className="info-list parent-info">
              {contactInfo.map((item, index) => (
                <InfoRow
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>

        </div>
      </section>

      {/* ================= DOCTOR + ORGANISATION ================= */}
      <div className="two-column">

        {/* Doctor */}
        <section className="details-card">
          <div className="card-title blue-title">
            <span className="title-icon">
              <UserRound size={20} />
            </span>
            <Paragraph2 text="Appointed Doctor Details"/>
          </div>

          <div className="card-body">
            {doctorInfo.map((item, index) => (
              <InfoRow
                key={index}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        </section>

        {/* Organisation */}
        <section className="details-card">
          <div className="card-title purple-title">
            <span className="title-icon">
              <Building2 size={20} />
            </span>

            <span>Organisation Details</span>
          </div>

            <div className="card-body">
              {organisationInfo.map((item, index) => (
                <InfoRow
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
        </section>

      </div>

      {/* ================= PAYMENT ================= */}
      <section className="details-card payment-card">

        <div className="card-title grey-title">
          <span className="title-icon">
            <CreditCard size={20} />
          </span>

          <span>Payment Details</span>
        </div>

        <div className="payment-body">

          <div className="payment-row">
            <span>Appointment Fee</span>
            <strong>₹ 2,000.00</strong>
          </div>

          <div className="payment-row">
            <span>Tax (18%)</span>
            <strong>₹ 360.00</strong>
          </div>

          <div className="payment-row">
            <span>Discount</span>
            <strong>- ₹ 200.00</strong>
          </div>

          <div className="payment-row total-row">
            <span>Total Amount</span>
            <strong>₹ 2160.00</strong>
          </div>

          <div className="payment-row">
            <span>Payment Status</span>
            <span className="paid-badge">Paid</span>
          </div>

          <div className="payment-row">
            <span>Payment Method</span>
            <strong>UPI</strong>
          </div>

          <div className="payment-row">
            <span>Transaction ID</span>
            <strong>TXN987654321</strong>
          </div>

          <div className="payment-row">
            <span>Payment Date</span>
            <strong>10 April 2026-09:32 AM</strong>
          </div>

        </div>
      </section>

      {/* ================= RESCHEDULE + CANCEL ================= */}
      <div className="two-column bottom-section">

        {/* Reschedule */}
        <section className="details-card action-card reschedule-card">

          <div className="card-title green-title">
            <span className="title-icon">
              <CalendarDays size={20} />
            </span>

            <span>Reschedule Appointment</span>
          </div>

          <div className="form-body">

            <div className="form-row">

              <div className="form-group">
                <label>New Date</label>

                <div className="input-wrapper">
                  <input type="date" />
                </div>
              </div>

              <div className="form-group">
                <label>New Time Slot</label>

                <div className="select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select time
                    </option>
                    <option>09:00 AM - 10:00 AM</option>
                    <option>10:00 AM - 11:00 AM</option>
                    <option>11:00 AM - 12:00 PM</option>
                  </select>

                  <ChevronDown size={16} />
                </div>
              </div>

            </div>

            <div className="form-group">
              <label>Reason for Reschedule</label>
              <textarea />
            </div>

            <button className="action-button reschedule-button">
              <CalendarDays size={17} />
              Reschedule Appointment
            </button>

          </div>
        </section>

        {/* Cancel */}
        <section className="details-card action-card cancel-card">

          <div className="card-title red-title">
            <span className="title-icon">
              <X size={21} />
            </span>

            <span>Cancel Appointment</span>
          </div>

          <div className="form-body">

            <div className="form-group">
              <label>Cancellation Reason</label>
              <input type="text" />
            </div>

            <div className="form-group">
              <label>Additional Comments (Optional)</label>
              <textarea />
            </div>

            <button className="action-button cancel-button">
              <X size={18} />
              Cancel Appointment
            </button>

          </div>
        </section>

      </div>
    </>
  );
};


/* ================= REUSABLE INFO ROW ================= */

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <strong className="info-value">{value}</strong>
    </div>
  );
};

export default AppointmentDetails;