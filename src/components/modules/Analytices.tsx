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

        const appointments = (appointmentsResponse.data || []).map((item: any) => ({
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