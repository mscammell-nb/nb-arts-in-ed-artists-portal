import { Link } from "react-router-dom";
import { useQueryForDataMutation } from "@/redux/api/quickbaseApi";
import { useState, useEffect } from "react";
import Spinner from "../ui/Spinner";
import PerformersPage from "./PerformersPage";

const DashboardPage = () => {
  const userUid = localStorage.getItem("userUid");
  const [
    queryForData,
    {
      data: artistData,
      isSuccess: isArtistDataSuccess,
      isLoading: isArtisDataLoading,
      isError: isArtistDataError,
    },
  ] = useQueryForDataMutation();

  // States
  const [isApproved, setIsApproved] = useState(false);
  const [isRegistrationExpired, setIsRegistrationExpired] = useState(false);
  const [artistName, setArtistName] = useState(null); // TODO: delete this if not needed

  const queryBody = {
    from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
    select: [3, 6, 29, 30],
    where: `{10.EX.${userUid}}`,
  };

  useEffect(() => {
    if (!artistData) {
      queryForData(queryBody);
    }
  }, [queryForData]);

  useEffect(() => {
    if (artistData) {
      setIsApproved(artistData.data[0][29].value);
      setIsRegistrationExpired(artistData.data[0][30].value);
      setArtistName(artistData.data[0][6].value);
      localStorage.setItem("artistRecordId", artistData.data[0][3].value);
    }
  }, [artistData]);

  if (!artistData && !isArtistDataError) {
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
    return <PerformersPage />;
  }
};

export default DashboardPage;
