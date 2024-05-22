import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutesWrapper = ({ user }) => {
  return user ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default ProtectedRoutesWrapper;
