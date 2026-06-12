import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthMain from "./pages/auth/authMain";
import AuthMiddleware from "./middleware/AuthMiddleware";

import { routes } from "./routes/AppRoutes";
import { basename } from "./api/config";

import DashboardLayOut from "./components/layout/DashboardLayout";

import SuperAdminDashboard from "./pages/superAdmin/index";
<<<<<<< HEAD
import SupZonaladmin from "./pages/superAdmin/ZonalAdmin";
import ZonalAdminDetails from "./pages/superAdmin/ZonalAdminDetails";
=======

import SupZonaladmin from "./pages/superAdmin/zonalAdmin";

import SupOrganization from "./pages/superAdmin/organizationAdmin";
import SupTherapist from "./pages/superAdmin/therapistAdmin";
import SupParent from "./pages/superAdmin/parentAdmin";
>>>>>>> 3a5a2bcbf37e90319f79ec7a5abf35d427ba251d
import SupAdmin from "./pages/superAdmin/Admin";
import SupAppointment from "./pages/superAdmin/appoinmentList";

import SuperAdminSettings from "./pages/superAdmin/Settings";



import ZonalAdminIndex from "./pages/zonalAdmin";

import OrganizationAdminIndex from "./pages/organization";

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {/* Login */}
        <Route path={routes.LOGIN} element={<AuthMain />} />

        {/* ================= SUPER ADMIN ================= */}

        <Route path={routes.SUPERADMIN} element={
            <AuthMiddleware allowedFlags={["SuperAdmin"]}>
              <DashboardLayOut />
            </AuthMiddleware>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="zonal-admin" element={<SupZonaladmin />} />
          <Route path="zonal-admin-details" element={<ZonalAdminDetails />} />
          <Route path="admin" element={<SupAdmin />} />
          <Route path="organization" element={<SupOrganization />} />
          <Route path="therapist" element={<SupTherapist />} />
          <Route path="parent" element={<SupParent />} />
          <Route path="appointment" element={<SupAppointment />} />
          <Route path="settings" element={<SuperAdminSettings />} />
        </Route>

        {/* ================= ZONAL ADMIN ================= */} 

        <Route path={routes.ZONALADMIN} element={
            <AuthMiddleware allowedFlags={["zonalAdmin"]}>
              <ZonalAdminIndex />
            </AuthMiddleware>
          }
        />

        {/* ================= ORGANIZATION ADMIN ================= */}

        <Route path={routes.ORGANIZATIONADMIN} element={
            <AuthMiddleware allowedFlags={["OrganizationAdmin"]}>
              <OrganizationAdminIndex />
            </AuthMiddleware>
          }
        />

        {/* ================= ADMIN ================= */}

        <Route path={routes.ADMIN} element={
            <AuthMiddleware allowedFlags={["Admin"]}>
              <OrganizationAdminIndex />
            </AuthMiddleware>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
