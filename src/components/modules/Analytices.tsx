import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heading4 } from "../ui/HeadingPara.tsx";

import DashboardButtons from "../ui/Buttons.tsx";
import { ArrowRightIcon } from "lucide-animated";
import { authService } from "../../services/authService";
import { tokenManager } from "../../services/tokenManager";
import AnalyticesCard from "./Analytices/AnalyticesCards.tsx";
import SubscriptionAnalytics from "./Analytices/Subscriptiongraph.tsx";
import Appointmentgraph from "./Analytices/Appointmentgraph.tsx";
import SellReportGraph from "./Analytices/SellReportGraph.tsx";
import ZonalAdminTable from "./Analytices/ZonalAdminTable.tsx";
import AppointmentTable from "./Analytices/AppointmentTable.tsx";
import DoctorListCard from "./Analytices/DoctorListCard.tsx";
import { filebasename } from "../../api/config";
import Loader from "../ui/Loaders";


interface ZonalAdminRow {
  zonaladminname: string;
  location: string;
  numberadmins: number;
}

interface DoctorRow {
  id: number | string;
  profileImage?: string;
  name: string;
  designation: string;
}

interface AppointmentRow {
  id: string;
  profileImage?: string;
  name: string;
  designation: string;
  date: string;
  time: string;
  status: string;
}

const DashboardAnalyticsIndex: React.FC = () => {
  const [zonalAdminRows, setZonalAdminRows] = useState<ZonalAdminRow[]>([]);
  const [doctorRows, setDoctorRows] = useState<DoctorRow[]>([]);
  const [appointmentRows, setAppointmentRows] = useState<AppointmentRow[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = tokenManager.getAccessToken();

      if (!token) {
        console.error("No access token found");
        return;
      }

      setLoading(true);

      try {
        const currentUser = tokenManager.getUser();

        const [zonalResponse, doctorFlag3Response, doctorFlag5Response, appointmentsResponse] =
          await Promise.all([
            authService.getUsersByFlag(token, 6),
            authService.getUsersByFlag(token, 3),
            authService.getUsersByFlag(token, 5),
            authService.getAppoinments(token),
          ]);

        const zonalAdmins = (zonalResponse.data || []).map((item: any) => ({
          zonaladminname: item.name || "-",
          location: [item.roleData?.city || item.city, item.roleData?.state || item.state]
            .filter(Boolean)
            .join(", ") || "-",
          numberadmins: item.relatedData?.admins?.count ?? item.relatedData?.admins?.data?.length ?? 0,
        }));

        const mergedDoctors = [
          ...(doctorFlag3Response.data || []),
          ...(doctorFlag5Response.data || []),
        ];

        const uniqueDoctors = Array.from(
          new Map(
            mergedDoctors.map((item: any) => [
              item._id,
              {
                id: item.userId ?? item._id,
                // profileImage: `${filebasename}${item.profileImg}` ?? undefined,
                profileImage: item.profileImg
                ? `${filebasename}${item.profileImg}`
                : undefined,
                name: item.name || "N/A",
                designation: item.relatedData?.organizations?.name || "Global",
              },
            ])
          ).values()
        );

        // Filter appointments based on logged-in user's flag hierarchy
        let appointmentsData = appointmentsResponse.data || [];

        if (currentUser) {
          const loginUserFlag = currentUser.flag;
          const loginUserId = currentUser.userId;

          // Debug log
          console.log("Filtering appointments - Flag:", loginUserFlag, "UserId:", loginUserId);

          if (loginUserFlag && loginUserId) {
            appointmentsData = appointmentsData.filter((appointment: any) => {
              let shouldInclude = false;

              switch (Number(loginUserFlag)) {
                case 6: // Zonal Admin - show appointments where zonalAdmin's userId matches
                  shouldInclude = appointment.zonalAdmin?.userId === loginUserId;
                  console.log(`Flag 6 check - zonalAdmin.userId: ${appointment.zonalAdmin?.userId}, loginUserId: ${loginUserId}, include: ${shouldInclude}`);
                  break;

                case 7: // Admin - show appointments where admin's userId matches
                  shouldInclude = appointment.admin?.userId === loginUserId;
                  console.log(`Flag 7 check - admin.userId: ${appointment.admin?.userId}, loginUserId: ${loginUserId}, include: ${shouldInclude}`);
                  break;

                case 1: // Organization Admin - show appointments where organization's userId matches
                  shouldInclude = appointment.organization?.userId === loginUserId;
                  console.log(`Flag 1 check - organization.userId: ${appointment.organization?.userId}, loginUserId: ${loginUserId}, include: ${shouldInclude}`);
                  break;

                case 3: // Teacher - show appointments where teacher's userId matches
                  shouldInclude = appointment.teacherUser?.userId === loginUserId;
                  console.log(`Flag 3 check - teacherUser.userId: ${appointment.teacherUser?.userId}, loginUserId: ${loginUserId}, include: ${shouldInclude}`);
                  break;

                default:
                  shouldInclude = true;
              }

              return shouldInclude;
            });

            console.log("Filtered appointments count:", appointmentsData.length);
          } else {
            console.log("currentUser flag or userId is missing - showing all appointments");
          }
        } else {
          console.log("currentUser is null - showing all appointments");
        }

        const appointments = appointmentsData.map((item: any) => ({
          id: item._id,
          // profileImage: item.teacherUser?.profileImg ?? undefined,
          profileImage: item.teacherUser?.profileImg
                ? `${filebasename}${item.teacherUser?.profileImg}`
                : undefined,
          name: item.teacherUser?.name || "N/A",
          designation: item.teacherUser?.email || "N/A",
          date: item.date || "-",
          time: item.time || "-",
          status: item.status || "-",
          
        }));

        setZonalAdminRows(zonalAdmins);
        setDoctorRows(uniqueDoctors);
        setAppointmentRows(appointments);

      } catch (error) {
        console.error("Failed to fetch dashboard analytics data:", error);
      } finally{
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
    <div className="AnalyticesCard">
      <AnalyticesCard/>     
    </div>
    <div className="SubscriptionAnalyticsGraph">
      <SubscriptionAnalytics/>
    </div>
    <div className="boxShadow analyticsZonalAdmin">
      <div className="d-flex">
          <Heading4 text="Zonal Admin"/>
          <DashboardButtons onClick={() => navigate("/superadmin/zonal-admin")} text="See All" variant="greenBorder" icon={<ArrowRightIcon size={22} className="btn-icon" />} iconPosition="right" textsize="md"/>
      </div>
       <ZonalAdminTable rows={zonalAdminRows} loading={loading} />
    </div>
    <div className="analyticsZonalAdmin boxShadow">
       <div className="d-flex">
          <Heading4 text="Appointments"/>
          <DashboardButtons onClick={() => navigate("/superadmin/appointment")} text="See All" variant="greenBorder" icon={<ArrowRightIcon size={22} className="btn-icon" />} iconPosition="right" textsize="md"/>
       </div>
          <AppointmentTable appointments={appointmentRows} loading={loading} />
    </div>
    <div className="Appointmentstatistics d-flex">
        <div className="AppointmentstatisticsGraph">
          {loading ? <Loader /> : <Appointmentgraph />}
        </div>
        <div className="DoctorsListAnalytics boxShadow">
          <DoctorListCard doctors={doctorRows} />
        </div>
    </div>
    <div className="SellReportGraph ">
       <SellReportGraph/> 
    </div>
    </>
  );
};

export default DashboardAnalyticsIndex;