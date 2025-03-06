import { Link } from "react-router-dom";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import { useState, useEffect } from "react";
import Spinner from "../components/ui/Spinner";
import { Navigate } from "react-router-dom";

const RegistrationGate = () => {
  const uid = localStorage.getItem("uid");
  const {
    data: artistData,
    isSuccess: isArtistDataSuccess,
    isLoading: isArtistDataLoading,
    isError: isArtistDataError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
    select: [3, 6, 29, 30],
    where: `{10.EX.${uid}}`,
  });

  const [isApproved, setIsApproved] = useState(false);
  const [isRegistrationExpired, setIsRegistrationExpired] = useState(false);

  useEffect(() => {
    if (artistData && !isArtistDataLoading) {
      setIsApproved(artistData.data[0][29].value);
      setIsRegistrationExpired(artistData.data[0][30].value);
      localStorage.setItem("artistRecordId", artistData.data[0][3].value);
    }
  }, [artistData, isArtistDataLoading]);

  if (isArtistDataLoading) {
    return (
      <div className="flex h-full w-full justify-center pt-24">
        <Spinner />
      </div>
    );
  }

  if (!isApproved) {
    return <div>Your registration request is pending</div>;
  }

  if (isRegistrationExpired) {
    return (
      <div>
        Your registration has expired. Please go to the{" "}
        <Link to={"/registration-renewal"} className="underline">
          Registration Renewal
        </Link>{" "}
        page to submit a new registration.{" "}
      </div>
    );
  }

  if (isArtistDataSuccess) {
    return <Navigate to="/performers" />;
  }
};

export default RegistrationGate;
