import DashboardCard from "../../ui/DashboardCard";
import ZonalAdminImage from "../../../assets/Images/ZonalAdminDashIcon.svg";
import OrganizationDashIcon from "../../../assets/Images/OrganizationDashIcon.svg";
import DoctorsDashIcon from "../../../assets/Images/DoctorsDashIcon.svg";
import ParentsDashIcon from "../../../assets/Images/ParentsDashIcon.svg";
import SubscriptionsDashIcon from "../../../assets/Images/SubscriptionsDashIcon.svg";
import AppointmentDashIcon from "../../../assets/Images/AppointmentDashIcon.svg";


const AnalyticesCard: React.FC = () => {
  return (
    <>
        <DashboardCard
        title="Zonal Admin"
        description="Total Number of Zonal Admin"
        total="11"
        image={ZonalAdminImage}
        buttonLink="/superadmin/zonal-admin"
        />
        <DashboardCard
        title="Admin"
        description="Total Number of Admin"
        total="11"
        image={ZonalAdminImage}
        buttonLink="/superadmin/admin"
        />
        <DashboardCard
        title="Organization"
        description="Total Number of Organization"
        total="11"
        image={OrganizationDashIcon}
        buttonLink="/superadmin/organization"
        />
        <DashboardCard
        title="Doctors / Therapists"
        description="Total Doctors / Therapists"
        total="11"
        image={DoctorsDashIcon}
        buttonLink="/superadmin/therapist"
        />
        <DashboardCard
        title="Users / Parents"
        description="Total Number of users / parents"
        total="11"
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