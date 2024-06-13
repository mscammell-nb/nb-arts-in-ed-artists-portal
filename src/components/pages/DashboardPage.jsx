import { Link } from "react-router-dom";

const DashboardPage = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <Link to="/evaluation-form" className="underline">Evaluation Form</Link>
    </>
  );
};

export default DashboardPage;
