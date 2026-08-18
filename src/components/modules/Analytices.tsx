import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heading4 } from "../ui/HeadingPara.tsx";

import DashboardButtons from "../ui/Buttons.tsx";
import { ArrowRightIcon } from "lucide-animated";
import { authService } from "../../services/authService";
import { tokenManager } from "../../services/tokenManager";
import AnalyticesCard from "./Analytices/AnalyticesCards.tsx";
// import SubscriptionAnalytics from "./Analytices/Subscriptiongraph.tsx";
// import Appointmentgraph from "./Analytices/Appointmentgraph.tsx";
// import SellReportGraph from "./Analytices/SellReportGraph.tsx";
import ZonalAdminTable from "./Analytices/ZonalAdminTable.tsx";
import AppointmentTable from "./Analytices/AppointmentTable.tsx";
// import DoctorListCard from "./Analytices/DoctorListCard.tsx";
import { filebasename } from "../../api/config";
// import Loader from "../ui/Loaders";


interface ZonalAdminRow {
  zonaladminname: string;
  location: string;
  numberadmins: number;
  numberorganizations: number;
  numbertherapists: number;
  numbersubscriptions: number;
  numberpes: number;
  userId: string | number;
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
  profileImageParent?: string;
  user: string;
  doctor: string;
  admin: string;
  name: string;
  designation: string;
  date: string;
  time: string;
  status: string;
}

interface UserCounts {
  organizationAdmin: number;
  parent: number;
  therapist: number;
  zonalAdmin: number;
  admin: number;
  totalAppointments: number;
}

const DashboardAnalyticsIndex: React.FC = () => {
  const [zonalAdminRows, setZonalAdminRows] = useState<ZonalAdminRow[]>([]);
  // const [doctorRows, setDoctorRows] = useState<DoctorRow[]>([]);
  const [, setDoctorRows] = useState<DoctorRow[]>([]);
  const [appointmentRows, setAppointmentRows] = useState<AppointmentRow[]>([]);
  const [userCounts, setUserCounts] = useState<UserCounts>({
    organizationAdmin: 0,
    parent: 0,
    therapist: 0,
    zonalAdmin: 0,
    admin: 0,
    totalAppointments: 0,
  });
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

        const [zonalResponse, doctorFlag3Response, doctorFlag5Response, appointmentsResponse, userCountsResponse] =
          await Promise.all([
            authService.getUsersByFlag(token, 6),
            authService.getUsersByFlag(token, 3),
            authService.getUsersByFlag(token, 5),
            authService.getAppoinments(token),
            authService.getUserCounts(token),
          ]);

        const zonalAdmins = (zonalResponse.data || []).map((item: any) => ({
          zonaladminname: item.name || "-",
          location: [item.roleData?.city || item.city, item.roleData?.state || item.state]
            .filter(Boolean)
            .join(", ") || "-",
          numberadmins: item.relatedData?.admins?.count ?? item.relatedData?.admins?.data?.length ?? 0,
          numberorganizations: item.relatedData?.organizations?.count ?? item.relatedData?.organizations?.data?.length ?? 0,
          numbertherapists: item.relatedData?.therapists?.count ?? item.relatedData?.therapists?.data?.length ?? 0,
          numbersubscriptions: item.relatedData?.subscriptions?.count ?? item.relatedData?.subscriptions?.data?.length ?? 0,
          numberpes: item.relatedData?.pes?.count ?? item.relatedData?.pes?.data?.length ?? 0,
          userId: item.userId ?? item._id,
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

        // console.log("Fetched appointments count:", appointmentsData);

        if (currentUser) {
          const loginUserFlag = currentUser.flag;
          const loginUserId = currentUser.userId;

          // Debug log
          // console.log("Filtering appointments - Flag:", loginUserFlag, "UserId:", loginUserId);

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

            // console.log("Filtered appointments count:", appointmentsData.length);
          } else {
            console.log("currentUser flag or userId is missing - showing all appointments");
          }
        } else {
          console.log("currentUser is null - showing all appointments");
        }

        // console.log("Final appointments data>>>>>>>>:", appointmentsData);
        const appointments = appointmentsData.map((item: any) => ({
          id: item._id,
          // profileImage: item.teacherUser?.profileImg ?? undefined,
          profileImage: item.teacherUser?.profileImg
                ? `${filebasename}${item.teacherUser?.profileImg}`
                : undefined,
          profileImageParent: item.parentUser?.profileImg
                ? `${filebasename}${item.parentUser.profileImg}`
                : undefined,
          // The API provides the booked user's details in `parentUser` and the
          // assigned administrator's details in `admin`.
          user: item.parentUser?.name || "N/A",
          doctor: item.teacherUser?.name || "N/A",
          admin: item.admin?.name || "N/A",
          name: item.teacherUser?.name || "N/A",
          designation: item.teacher?.therapist_category || "N/A",
          date: item.date || "-",
          time: item.time || "-",
          status: item.status || "-",
          
        }));

        setZonalAdminRows(zonalAdmins);
        setDoctorRows(uniqueDoctors);
        setAppointmentRows(appointments);

        // Set user counts
        if (userCountsResponse.success && userCountsResponse.data) {
          setUserCounts(userCountsResponse.data);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard analytics data:", error);
      } finally{
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Function to get heading text and count based on login flag
  const getHeadingByFlag = () => {
    const currentUser = tokenManager.getUser();
    const flag = Number(currentUser?.flag) || 0;

    switch (flag) {
      case 0:
        return { text: "Zonal Admin", count: userCounts.zonalAdmin };
      case 6:
        return { text: "Admin", count: userCounts.admin };
      case 7:
        return { text: "Organization", count: userCounts.organizationAdmin };
      case 1:
        return { text: "Doctors / Therapists", count: userCounts.therapist };
      case 3:
      case 5:
        return { text: "Users / Parents", count: userCounts.parent };
      default:
        return { text: "Zonal Admin", count: userCounts.zonalAdmin };
    }
  };

  const headingInfo = getHeadingByFlag();

  return (
    <>
    <div className="AnalyticesCard">
      <AnalyticesCard/>     
    </div>
    {/* <div className="SubscriptionAnalyticsGraph">
      <SubscriptionAnalytics/>
    </div> */}

    <div className="analyticsZonalAdmin boxShadow">
       <div className="d-flex">
          <Heading4 text="APPOINTMENTS"/>
          <DashboardButtons onClick={() => navigate("/superadmin/appointment")} text="View All" variant="SolidBlue" textsize="md"/>
       </div>
          <AppointmentTable appointments={appointmentRows} loading={loading} displayLimit={6} />
    </div>
    <div className="analyticsZonalAdmin">
      <div className="d-flex">
          <Heading4 text={headingInfo.text} span={`(${headingInfo.count})`}/>
          <DashboardButtons onClick={() => navigate("/superadmin/zonal-admin")} text="See All" variant="greenBorder" icon={<ArrowRightIcon size={22} className="btn-icon" />} iconPosition="right" textsize="md"/>
      </div>
       <ZonalAdminTable rows={zonalAdminRows} loading={loading} />
    </div>
    {/* <div className="Appointmentstatistics d-flex">
        <div className="AppointmentstatisticsGraph">
          {loading ? <Loader /> : <Appointmentgraph />}
        </div>
        <div className="DoctorsListAnalytics boxShadow">
          <DoctorListCard doctors={doctorRows} />
        </div>
    </div> */}
    {/* <div className="SellReportGraph ">
       <SellReportGraph/> 
    </div> */}
    </>
  );
};

export default DashboardAnalyticsIndex;
