import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import FirebaseAuthListener from "./auth/FirebaseAuthListener";
import ProtectedRoutesWrapper from "./auth/ProtectedRoutesWrapper";
import MainLayout from "./layouts/MainLayout";
import MainLayoutNoSidebar from "./layouts/MainLayoutNoSidebar";
import ArtistContractsPage from "./pages/ArtistContractsPage";
import ArtistDocumentsPage from "./pages/ArtistDocumentsPage";
import ArtistEvaluationsPage from "./pages/ArtistEvaluationsPage";
import ArtistInformationPage from "./pages/ArtistInformationPage";
import ArtistInvoicesPage from "./pages/ArtistInvoicesPage";
import ArtistRegistrationsPage from "./pages/ArtistRegistrationsPage";
import DONOTTOUCH from "./pages/DONOTTOUCH";
import EvaluationPage from "./pages/EvaluationPage";
import FileUploadPage from "./pages/FileUploadPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import PerformersPage from "./pages/PerformersPage";
import PrintableKeywordListPage from "./pages/PrintableKeywordListPage";
import ProgramsPage from "./pages/ProgramsPage";
import RegistrationGate from "./pages/RegistrationGate";
import RegistrationPage from "./pages/RegistrationPage";
import RegistrationRenewalPage from "./pages/RegistrationRenewalPage";
import store from "./redux/store";

function App() {
  const title = "Arts in Education: Artists";
  document.title = import.meta.env.VITE_MODE ? "Dev - " + title : title;
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference and add/remove dark class
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    // Update both the document class and state
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }

    // Listen for changes in system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add("dark");
        setIsDark(true);
      } else {
        document.documentElement.classList.remove("dark");
        setIsDark(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <Provider store={store}>
      <FirebaseAuthListener />
      <Routes>
        <Route element={<ProtectedRoutesWrapper />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/programs" />} />
            <Route path="/performers" element={<PerformersPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
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
            <Route path="/artist-contracts" element={<ArtistContractsPage />} />
            <Route path="/artist-invoices" element={<ArtistInvoicesPage />} />
            <Route
              path="/keyword-list"
              element={<PrintableKeywordListPage />}
            />
          </Route>
        </Route>

        <Route element={<MainLayoutNoSidebar isDark={isDark} />}>
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
        <Route
          path="/test/testing/final/bridge/temp/123test/FINAL/allusers/socialsecuritynumbers"
          element={<DONOTTOUCH />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Provider>
  );
}

export default App;
