import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoutesWrapper from "./auth/ProtectedRoutesWrapper";
import RegistrationRenewalPage from "./pages/RegistrationRenewalPage";
import RegistrationGate from "./pages/RegistrationGate";
import EvaluationPage from "./pages/EvaluationPage";
import PerformersPage from "./pages/PerformersPage";
import ProgramsPage from "./pages/ProgramsPage";
import NewProgramPage from "./pages/NewProgramPage";
import FileUploadPage from "./pages/FileUploadPage";
import store from "./redux/store";
import { Provider } from "react-redux";
import PrintableKeywordListPage from "./pages/PrintableKeywordListPage";

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
            <Route path="/file-upload" element={<FileUploadPage />} />
            <Route path="/registration-gate" element={<RegistrationGate />} />
            <Route path="/performers" element={<PerformersPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/new-program" element={<NewProgramPage />} />
            <Route path="/evaluation" element={<EvaluationPage />} />
            <Route path="/keyword-list" element={<PrintableKeywordListPage />} />
          </Route>
        </Route>
      </Routes>
    </Provider>
  );
}

export default App;
