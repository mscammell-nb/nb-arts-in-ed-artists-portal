import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import RegisterForm from "./components/auth/RegistrationForm";
import LoginForm from "./components/auth/LoginForm";
import ProtectedRoutesWrapper from "./components/auth/ProtectedRoutesWrapper";
import DashboardPage from "./components/pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/auth/register" element={<RegisterForm />} />
        <Route path="/auth/login" element={<LoginForm />} />
        <Route path="/" element={<ProtectedRoutesWrapper user={432} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
