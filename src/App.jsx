import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/auth/register" element={<h1>Register</h1>} />
      <Route path="/auth/login" element={<h1>Login</h1>} />
    </Routes>
  );
}

export default App;
