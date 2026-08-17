import React, { useEffect, useState } from "react";
import DashboardCard from "../../ui/DashboardCard";
import ZonalAdminImage from "../../../assets/Images/ZonalAdminDashIcon.svg";
import OrganizationDashIcon from "../../../assets/Images/OrganizationDashIcon.svg";
import DoctorsDashIcon from "../../../assets/Images/DoctorsDashIcon.svg";
import ParentsDashIcon from "../../../assets/Images/ParentsDashIcon.svg";
import SubscriptionsDashIcon from "../../../assets/Images/SubscriptionsDashIcon.svg";
import AppointmentDashIcon from "../../../assets/Images/AppointmentDashIcon.svg";
import { authService } from "../../../services/authService";
import { tokenManager } from "../../../services/tokenManager";

interface UserCounts {
  organizationAdmin: number;
  parent: number;
  therapist: number;
  zonalAdmin: number;
  admin: number;
}

const AnalyticesCard: React.FC = () => {
  const [counts, setCounts] = useState<UserCounts>({
    organizationAdmin: 0,
    parent: 0,
    therapist: 0,
    zonalAdmin: 0,
    admin: 0,
  });

  useEffect(() => {
    const loadUserCounts = async () => {
      const token = tokenManager.getAccessToken();
      if (!token) return;

      try {
        const response = await authService.getUserCounts(token);
        if (response.success && response.data) {
          setCounts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard user counts:", error);
      }
    };

    loadUserCounts();
  }, []);

  return (
    <>
        <DashboardCard
        title="Zonal Admin"
        description="Total Number of Zonal Admin"
        total={String(counts.zonalAdmin)}
        image={ZonalAdminImage}
        buttonLink="/superadmin/zonal-admin"
        />
        <DashboardCard
        title="Admin"
        description="Total Number of Admin"
        total={String(counts.admin)}
        image={ZonalAdminImage}
        buttonLink="/superadmin/admin"
        />
        <DashboardCard
        title="Organization"
        description="Total Number of Organization"
        total={String(counts.organizationAdmin)}
        image={OrganizationDashIcon}
        buttonLink="/superadmin/organization"
        />
        <DashboardCard
        title="Doctors / Therapists"
        description="Total Doctors / Therapists"
        total={String(counts.therapist)}
        image={DoctorsDashIcon}
        buttonLink="/superadmin/therapist"
        />
        <DashboardCard
        title="Users / Parents"
        description="Total Number of users / parents"
        total={String(counts.parent)}
        image={ParentsDashIcon}
        buttonLink="/superadmin/parent"
        />
        <DashboardCard
        title="Subscriptions"
        description="Total Number of Subscriptions"
        total="11"
        image={SubscriptionsDashIcon}
        buttonLink="/superadmin/report"
        />
        <DashboardCard
        title="Appointment"
        description="Total Number of Appointment"
        total="11"
        image={AppointmentDashIcon}
        buttonLink="/superadmin/appointment"
        />  
        <DashboardCard
        title="PE"
        description="Total Pe"
        total="11"
        image={AppointmentDashIcon}
        buttonLink="/superadmin/appointment"
        />    
    </>

  );
};

export default AnalyticesCard;
