import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthMain from "./pages/auth/authMain";
import AuthMiddleware from "./middleware/AuthMiddleware";
import { routes } from "./routes/AppRoutes";

import SuperAdminIndex from "./pages/superAdmin";
import ZonalAdminIndex from "./pages/zonalAdmin";
import OrganizationAdminIndex from "./pages/organization";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.LOGIN} element={<AuthMain/>} />


        {/* SuperAdmin Start */}
        <Route
          path={routes.SUPERADMIN}
          element={
            <AuthMiddleware allowedFlags={["SuperAdmin"]}>
              <SuperAdminIndex/>
            </AuthMiddleware>
          }
        />
        {/* SuperAdmin End */}

        {/* ZonalAdmin Start */}
        <Route
          path={routes.ZONALADMIN}
          element={
            <AuthMiddleware allowedFlags={["zonalAdmin"]}>
              <ZonalAdminIndex/>
            </AuthMiddleware>
          }
        />
        {/* ZonalAdmin Start */}

        {/* OrganizationAdmin Start */}
        <Route
          path={routes.ORGANIZATIONADMIN}
          element={
            <AuthMiddleware allowedFlags={["OrganizationAdmin"]}>
              <OrganizationAdminIndex/>
            </AuthMiddleware>
          }
        />
        {/* OrganizationAdmin End */}


      </Routes>
    </BrowserRouter>
  );
}

export default App;
