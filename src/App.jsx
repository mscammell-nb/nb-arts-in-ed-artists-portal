import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { Button } from "./components/ui/button";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          path="/auth/register"
          element={
            <>
              <h1>Register</h1>
              <Button variant="bocesPrimary">Register</Button>
              <Button variant="outline">another button</Button>
            </>
          }
        />
        <Route path="/auth/login" element={<h1>Login</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
