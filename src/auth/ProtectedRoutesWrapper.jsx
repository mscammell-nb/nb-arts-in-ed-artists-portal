import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutesWrapper = () => {
  const authToken = localStorage.getItem("accessToken");

  return authToken ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutesWrapper;
