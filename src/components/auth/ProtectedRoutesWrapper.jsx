import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutesWrapper = () => {
  const user = useSelector((state) => state.auth.user);
  // TODO: add JWT token validation
  const authToken = localStorage.getItem("authToken");
  return authToken ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutesWrapper;
