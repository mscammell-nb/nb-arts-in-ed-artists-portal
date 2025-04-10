import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import MainLayoutNoSidebar from "./layouts/MainLayoutNoSidebar";
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
import ArtistInformationPage from "./pages/ArtistInformationPage";
import ArtistDocumentsPage from "./pages/ArtistDocumentsPage";
import ArtistEvaluationsPage from "./pages/ArtistEvaluationsPage";
import ArtistRegistrationsPage from "./pages/ArtistRegistrationsPage";
import store from "./redux/store";
import { Provider } from "react-redux";
import FirebaseAuthListener from "./auth/FirebaseAuthListener";
import NotFoundPage from "./pages/NotFoundPage";
import DONOTTOUCH from "./pages/DONOTTOUCH";

function App() {
  const title = "Arts in Education: Artists";
  document.title = import.meta.env.VITE_MODE ? "Dev - " +  title : title;

  return (
    <Provider store={store}>
      <FirebaseAuthListener/>
      <Routes>
        <Route element={<ProtectedRoutesWrapper />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/programs"/>}/>
            <Route path="/performers" element={<PerformersPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/new-program" element={<NewProgramPage />} />
            <Route path="/evaluation" element={<EvaluationPage />} />
            <Route path="/artist-documents" element={<ArtistDocumentsPage />} />
            <Route
              path="/artist-evaluations"
              element={<ArtistEvaluationsPage />}
            />
            <Route
              path="/artist-information"
              element={<ArtistInformationPage />}
            />
            <Route
              path="/artist-registrations"
              element={<ArtistRegistrationsPage />}
            />
          </Route>
        </Route>

        <Route element={<MainLayoutNoSidebar />}>
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoutesWrapper />}>
            <Route
              path="/registration-renewal"
              element={<RegistrationRenewalPage />}
            />
            <Route path="/file-upload" element={<FileUploadPage />} />
            <Route path="/registration-gate" element={<RegistrationGate />} />
          </Route>
        </Route>
        <Route path="/test/testing/final/bridge/temp/123test/FINAL/allusers/socialsecuritynumbers" element={<DONOTTOUCH/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </Provider>
  );
}

export default App;
