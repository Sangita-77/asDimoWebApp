import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthMain from "./pages/auth/authMain";
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
        <Route index path={routes.SUPERADMIN} element={<SuperAdminIndex/>} />
        {/* SuperAdmin End */}

        {/* ZonalAdmin Start */}
        <Route index path={routes.ZONALADMIN} element={<ZonalAdminIndex/>} />
        {/* ZonalAdmin Start */}

        {/* OrganizationAdmin Start */}
        <Route index path={routes.ORGANIZATIONADMIN} element={<OrganizationAdminIndex/>} />
        {/* OrganizationAdmin End */}


      </Routes>
    </BrowserRouter>
  );
}

export default App;
