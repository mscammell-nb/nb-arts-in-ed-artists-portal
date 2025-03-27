import { Button } from "@/components/ui/button";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import { signOut } from "@/redux/slices/authSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import { handleSignout } from "@/utils/utils";

const RegistrationGate = () => {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: artistData,
    isSuccess: isArtistDataSuccess,
    isLoading: isArtistDataLoading,
  } = useQueryForDataQuery(
    user
      ? {
          from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
          select: [3, 6, 29, 30],
          where: `{10.EX.${user.uid}}`,
        }
      : { skip: !user, refetchOnMountOrArgChange: true },
  );

  const [isApproved, setIsApproved] = useState(false);
  const [isRegistrationExpired, setIsRegistrationExpired] = useState(false);

  useEffect(() => {
    if (artistData?.data && !isArtistDataLoading) {
      setIsApproved(artistData.data[0][29].value);
      setIsRegistrationExpired(artistData.data[0][30].value);
      localStorage.setItem("artistRecordId", artistData.data[0][3].value);
      localStorage.setItem("artist/org", artistData.data[0][6].value);
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
    return (
      <div className="flex flex-col gap-4 items-start">
        <div>Your registration request is pending</div>
        <Button onClick={()=>handleSignOut(dispatch, navigate)}>Sign out</Button>
      </div>
    );
  }

  if (isRegistrationExpired) {
    return (
      <div className="space-y-6">
        <div>
          Your registration has expired. Please go to the{" "}
          <Link to={"/registration-renewal"} className="underline">
            Registration Renewal
          </Link>{" "}
          page to submit a new registration.{" "}
        </div>
        <div className="space-x-3">
          <Button>
            <Link to={"/registration-renewal"}>Registration Renewal</Link>
          </Button>
          <Button variant="outline" onClick={() => handleSignout()}>
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  if (isArtistDataSuccess) {
    return <Navigate to="/performers" />;
  }
};

export default RegistrationGate;
