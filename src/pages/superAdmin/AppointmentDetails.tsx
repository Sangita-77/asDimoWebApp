import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, CalendarDays, ChevronDown, CreditCard, UserRound, X } from "lucide-react";
import { Heading1, Paragraph, Paragraph2 } from "../../components/ui/HeadingPara";
import DashboardButtons from "../../components/ui/Buttons";
import { BASE_URL, filebasename } from "../../api/config";
import { tokenManager } from "../../services/tokenManager";
import Loader from "../../components/ui/Loaders";
import "./AppointmentDetails.css";

interface UserDetails {
  userId?: number;
  name?: string;
  email?: string;
  phone?: string | null;
  address?: string;
  city?: string;
  state?: string;
  profileImg?: string | null;
  childAge?: string | null;
}

interface AppointmentDetailsData {
  _id: string;
  parentId: number;
  teacherId: number;
  date: string;
  time: string;
  status: string;
  zoomLink?: string;
  teacher?: { therapist_category?: string };
  teacherUser?: UserDetails;
  parentUser?: UserDetails;
  childDetails?: any;
  organization?: UserDetails;
  zonalAdmin?: UserDetails;
  admin?: UserDetails;
}

interface AvailableSlot {
  _id: string;
  userId: number;
  date: string;
  time: string;
  isBooked: boolean;
}

const valueOrFallback = (value?: string | number | null) =>
  value === undefined || value === null || value === "" ? "N/A" : String(value);

const AppointmentDetails: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<AppointmentDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<"reschedule" | "cancel" | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) {
        setError("Appointment ID is missing");
        setLoading(false);
        return;
      }

      try {
        const token = tokenManager.getAccessToken();
        const response = await fetch(`${BASE_URL}/appointments/${appointmentId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        const responseData = await response.json().catch(() => null);

        if (!response.ok || !responseData?.success) {
          throw new Error(responseData?.message || "Unable to load appointment details");
        }

        const appointmentData = responseData.data as AppointmentDetailsData;
        setAppointment(appointmentData);

        if (appointmentData.teacherUser?.userId) {
          setSlotsLoading(true);
          const slotsResponse = await fetch(
            `${BASE_URL}/appointments/available-slots/${appointmentData.teacherUser.userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
            }
          );
          const slotsResponseData = await slotsResponse.json().catch(() => null);

          if (!slotsResponse.ok || !slotsResponseData?.success) {
            throw new Error(slotsResponseData?.message || "Unable to load available slots");
          }

          const slots = (slotsResponseData.data || []).filter(
            (slot: AvailableSlot) => !slot.isBooked
          );
          setAvailableSlots(slots);
        }
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : String(fetchError));
      } finally {
        setSlotsLoading(false);
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const availableDates = Array.from(new Set(availableSlots.map((slot) => slot.date)));
  const availableTimes = availableSlots
    .filter((slot) => slot.date === selectedDate)
    .map((slot) => slot.time);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(availableSlots.find((slot) => slot.date === date)?.time || "");
  };

  const closeModal = () => {
    if (!actionLoading) {
      setActiveModal(null);
      setActionError(null);
    }
  };

  const handleCancelAppointment = async () => {
    if (!appointment || !cancellationReason.trim()) {
      setActionError("Cancellation reason is required");
      return;
    }

    setActionLoading(true);
    setActionError(null);

    try {
      const token = tokenManager.getAccessToken();
      const response = await fetch(`${BASE_URL}/appointments/cancel/${appointment._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ reason: cancellationReason.trim() }),
      });
      const responseData = await response.json().catch(() => null);

      if (!response.ok || !responseData?.success) {
        throw new Error(responseData?.message || "Unable to cancel appointment");
      }

      setAppointment((current) => current ? { ...current, status: responseData.data?.status || "cancelled" } : current);
      setActiveModal(null);
      setCancellationReason("");
    } catch (cancelError) {
      setActionError(cancelError instanceof Error ? cancelError.message : String(cancelError));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRescheduleAppointment = async () => {
    if (!appointment || !selectedDate || !selectedTime || !rescheduleReason.trim()) {
      setActionError("Date, time, and reschedule reason are required");
      return;
    }

    setActionLoading(true);
    setActionError(null);

    try {
      const token = tokenManager.getAccessToken();
      const response = await fetch(`${BASE_URL}/appointments/reschedule/${appointment._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          reason: rescheduleReason.trim(),
        }),
      });
      const responseData = await response.json().catch(() => null);

      if (!response.ok || !responseData?.success) {
        throw new Error(responseData?.message || "Unable to reschedule appointment");
      }

      setAppointment((current) => current ? {
        ...current,
        date: responseData.data?.date || selectedDate,
        time: responseData.data?.time || selectedTime,
        status: responseData.data?.status || current.status,
      } : current);
      setActiveModal(null);
      setRescheduleReason("");
    } catch (rescheduleError) {
      setActionError(rescheduleError instanceof Error ? rescheduleError.message : String(rescheduleError));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error || !appointment) {
    return <div className="error-message appointment-details-error">{error || "Appointment not found"}</div>;
  }

  const parent = appointment.parentUser || {};
//   const child = appointment.childDetails?.[0] || {};
//   console.log("Child Details:", child); // Debugging line to check child details
  const child = appointment.childDetails?.[0] || {};  
  const teacher = appointment.teacherUser || {};
  const imageUrl = parent.profileImg ? `${filebasename}${parent.profileImg}` : undefined;
  const patientName = valueOrFallback(parent.name);
  const childAge = valueOrFallback(child.childAge);
  const patientInfo = [
    { label: "Parent Name", value: patientName },
    // { label: "Parent ID", value: appointment.parentId },
    { label: "Appointment ID", value: appointment._id },
    { label: "Age", value: childAge + " years" },
  ];
  const contactInfo = [
    { label: "Contact Number", value: parent.phone },
    { label: "Email", value: parent.email },
    { label: "Address", value: [parent.address, parent.city, parent.state].filter(Boolean).join(", ") },
  ];
  const doctorInfo = [
    { label: "Doctor Name", value: teacher.name },
    { label: "Specialization", value: appointment.teacher?.therapist_category },
    { label: "Contact", value: teacher.phone },
    { label: "Appointment Date", value: appointment.date },
    { label: "Appointment Time", value: appointment.time },
    { label: "Status", value: appointment.status },
    { label: "Zoom Link", value: appointment.zoomLink },
  ];
  const organisationInfo = [
    { label: "Organisation Name", value: appointment.organization?.name },
    { label: "Admin Name", value: appointment.admin?.name },
    { label: "Zonal Admin Name", value: appointment.zonalAdmin?.name },
  ];

  return (
    <>
      <div className="appointment-header">
        <div><Heading1 text="Appointment DETAILS" /><Paragraph text="View and manage appointment information." /></div>
        <div className="header-actions">
          <DashboardButtons text="Reschedule" variant="blueborder" textsize="sm" icon={<CalendarDays size={18} />} onClick={() => { setActionError(null); setActiveModal("reschedule"); }} />
          <DashboardButtons text="Cancel Appointment" variant="redborder" textsize="sm" icon={<X size={18} />} onClick={() => { setActionError(null); setActiveModal("cancel"); }} />
          <DashboardButtons text="Back to Appointments" variant="blueborder" textsize="sm" icon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} />
        </div>
      </div>

      <section className="details-card patient-card">
        <div className="card-title blue-title"><span className="title-icon"><UserRound size={20} /></span><Paragraph2 text="Patient/Appointment Taking Person Details" /></div>
        <div className="patient-content">
          <div className="patient-profile">
            <div className="patient-avatar">{imageUrl ? <img src={imageUrl} alt={patientName} /> : <span className="patient-initial">{patientName.charAt(0)}</span>}</div>
            <div className="info-list">{patientInfo.map((item) => <InfoRow key={item.label} label={item.label} value={item.value} />)}</div>
          </div>
          <div className="vertical-divider" />
          <div className="info-list parent-info">{contactInfo.map((item) => <InfoRow key={item.label} label={item.label} value={item.value} />)}</div>
        </div>
      </section>

      <div className="two-column">
        <section className="details-card"><div className="card-title blue-title"><span className="title-icon"><UserRound size={20} /></span><Paragraph2 text="Appointed Doctor Details" /></div><div className="card-body">{doctorInfo.map((item) => <InfoRow key={item.label} label={item.label} value={item.value} />)}</div></section>
        <section className="details-card"><div className="card-title purple-title"><span className="title-icon"><Building2 size={20} /></span><span>Organisation Details</span></div><div className="card-body">{organisationInfo.map((item) => <InfoRow key={item.label} label={item.label} value={item.value} />)}</div></section>
      </div>

      {/* <section className="details-card payment-card">
        <div className="card-title grey-title"><span className="title-icon"><CreditCard size={20} /></span><span>Payment Details</span></div>
        <div className="payment-body"><div className="payment-row"><span>Appointment ID</span><strong>{appointment._id}</strong></div><div className="payment-row"><span>Appointment Status</span><span className="paid-badge">{appointment.status}</span></div><div className="payment-row"><span>Zoom Link</span><strong>{valueOrFallback(appointment.zoomLink)}</strong></div></div>
      </section> */}
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

      {activeModal && <div className="appointment-modal-backdrop" role="presentation" onClick={closeModal}>
        <section className="details-card action-card appointment-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
          <div className={`card-title ${activeModal === "reschedule" ? "green-title" : "red-title"}`}><span className="title-icon">{activeModal === "reschedule" ? <CalendarDays size={20} /> : <X size={21} />}</span><span>{activeModal === "reschedule" ? "Reschedule Appointment" : "Cancel Appointment"}</span><button className="modal-close" type="button" aria-label="Close" onClick={closeModal}><X size={19} /></button></div>
          {actionError && <div className="error-message">{actionError}</div>}
          <div className="form-body">{activeModal === "reschedule" ? <>
            <div className="form-row"><div className="form-group"><label>New Date</label><div className="select-wrapper"><select value={selectedDate} onChange={(event) => handleDateChange(event.target.value)} disabled={slotsLoading} required><option value="">{slotsLoading ? "Loading dates..." : "Select date"}</option>{availableDates.map((date) => <option key={date} value={date}>{date}</option>)}</select><ChevronDown size={16} /></div></div><div className="form-group"><label>New Time Slot</label><div className="select-wrapper"><select value={selectedTime} onChange={(event) => setSelectedTime(event.target.value)} disabled={slotsLoading || !selectedDate} required><option value="">Select time</option>{availableTimes.map((time) => <option key={time} value={time}>{time}</option>)}</select><ChevronDown size={16} /></div></div></div>
            <div className="form-group"><label>Reason for Reschedule</label><textarea value={rescheduleReason} onChange={(event) => setRescheduleReason(event.target.value)} /></div><button className="action-button reschedule-button" type="button" onClick={handleRescheduleAppointment} disabled={actionLoading || slotsLoading}><CalendarDays size={17} />{actionLoading ? "Rescheduling..." : "Reschedule Appointment"}</button>
          </> : <><div className="form-group"><label>Cancellation Reason</label><input type="text" value={cancellationReason} onChange={(event) => setCancellationReason(event.target.value)} /></div><div className="form-group"><label>Additional Comments (Optional)</label><textarea /></div><button className="action-button cancel-button" type="button" onClick={handleCancelAppointment} disabled={actionLoading}><X size={18} />{actionLoading ? "Cancelling..." : "Cancel Appointment"}</button></>}</div>
        </section>
      </div>}
    </>
  );
};

interface InfoRowProps { label: string; value?: string | number | null; }
const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => <div className="info-row"><span className="info-label">{label}</span><strong className="info-value">{valueOrFallback(value)}</strong></div>;

export default AppointmentDetails;
