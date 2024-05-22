import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import RegisterForm from "./components/auth/RegistrationForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/auth/register" element={<RegisterForm />} />
        <Route path="/auth/login" element={<h1>Login</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
