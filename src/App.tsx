import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import ForgetPassword from "./pages/auth/ForgetPassword";
import { routes } from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.LOGIN} element={<Login/>} />
        <Route path={routes.FORGETPASSWORD} element={<ForgetPassword/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
