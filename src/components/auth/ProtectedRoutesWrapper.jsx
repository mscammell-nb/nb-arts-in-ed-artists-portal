import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutesWrapper = () => {
  const user = useSelector((state) => state.auth.user);
  // return <Outlet /> // delete this later
  const authToken = localStorage.getItem("authToken");
  return authToken ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutesWrapper;
