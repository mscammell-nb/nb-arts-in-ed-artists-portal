import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoutesWrapper from "./auth/ProtectedRoutesWrapper";
import RegistrationRenewalPage from "./pages/RegistrationRenewalPage";
import RegistrationGate from "./pages/RegistrationGate";
import EvaluationPage from "./pages/EvaluationPage";
import PerformersPage from "./pages/PerformersPage";
import store from "./redux/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoutesWrapper />}>
            <Route
              path="/registration-renewal"
              element={<RegistrationRenewalPage />}
            />
            <Route path="/registration-gate" element={<RegistrationGate />} />
            <Route path="/performers" element={<PerformersPage />} />
            <Route path="/evaluation" element={<EvaluationPage />} />
          </Route>
        </Route>
      </Routes>
    </Provider>
  );
}

export default App;
