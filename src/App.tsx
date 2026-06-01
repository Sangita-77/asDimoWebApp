import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthMain from "./pages/auth/authMain";
import AuthMiddleware from "./middleware/AuthMiddleware";

import { routes } from "./routes/AppRoutes";

import DashboardLayOut from "./components/layout/DashboardLayout";

import SuperAdminDashboard from "./pages/superAdmin/index";
import SuperAdminSettings from "./pages/superAdmin/Settings";

import ZonalAdminIndex from "./pages/zonalAdmin";
import OrganizationAdminIndex from "./pages/organization";

function App() {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;