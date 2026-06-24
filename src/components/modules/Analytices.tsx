import React from "react";
import { Heading4 } from "../ui/HeadingPara.tsx";

import DashboardButtons from "../ui/Buttons.tsx";
import {ArrowRightIcon} from 'lucide-animated';

import AnalyticesCard from "./Analytices/AnalyticesCards.tsx";
import SubscriptionAnalytics from "./Analytices/Subscriptiongraph.tsx";
import Appointmentgraph from "./Analytices/Appointmentgraph.tsx";
import SellReportGraph from "./Analytices/SellReportGraph.tsx";
import ZonalAdminTable from "./Analytices/ZonalAdminTable.tsx";
import AppointmentTable from "./Analytices/AppointmentTable.tsx";
import DoctorListCard from "./Analytices/DoctorListCard.tsx";

const dashboardAnalyticsindex: React.FC= ({
}) => {
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
          <DashboardButtons text="See All" variant="greenBorder" icon={<ArrowRightIcon size={22} className="btn-icon" />} iconPosition="right" textsize="md"/>
      </div>
       <ZonalAdminTable/>
    </div>
    <div className="analyticsZonalAdmin boxShadow">
       <div className="d-flex">
          <Heading4 text="Appointments"/>
          <DashboardButtons text="See All" variant="greenBorder" icon={<ArrowRightIcon size={22} className="btn-icon" />} iconPosition="right" textsize="md"/>
       </div>
          <AppointmentTable/>
    </div>
    <div className="Appointmentstatistics d-flex">
        <div className="AppointmentstatisticsGraph">
          <Appointmentgraph/>
        </div>
        <div className="DoctorsListAnalytics boxShadow">
          <DoctorListCard/>
        </div>
    </div>
    <div className="SellReportGraph ">
       <SellReportGraph/> 
    </div>
    </>
  );
};

export default dashboardAnalyticsindex;