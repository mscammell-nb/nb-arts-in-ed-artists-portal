import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import RegisterForm from "./components/auth/RegistrationForm";
import LoginForm from "./components/auth/LoginForm";
import ProtectedRoutesWrapper from "./components/auth/ProtectedRoutesWrapper";
import DashboardPage from "./components/pages/DashboardPage";
import EvaluationForm from "./components/pages/EvaluationForm";
import store from "./redux/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/auth/register" element={<RegisterForm />} />
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/" element={<ProtectedRoutesWrapper />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/evaluation-form" element={<EvaluationForm />} />
          </Route>
        </Route>
      </Routes>
    </Provider>
  );
}

export default App;
