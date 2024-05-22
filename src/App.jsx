import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import RegisterForm from "./components/auth/RegistrationForm";
import LoginForm from "./components/auth/LoginForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/auth/register" element={<RegisterForm />} />
        <Route path="/auth/login" element={<LoginForm />} />
      </Route>
    </Routes>
  );
}

export default App;
