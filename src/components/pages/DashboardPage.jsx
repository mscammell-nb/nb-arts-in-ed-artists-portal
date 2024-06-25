import { Link } from "react-router-dom";

const DashboardPage = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <Link to="/evaluation" className="underline">Evaluation Form</Link>
      <br></br>
      <Link to="/registration-renewal" className="underline">Registration Renewal</Link>
    </>
  );
};

export default DashboardPage;
