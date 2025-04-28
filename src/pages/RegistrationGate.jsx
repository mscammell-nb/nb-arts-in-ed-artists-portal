import { Button } from "@/components/ui/button";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import { setArtist } from "@/redux/slices/authSlice";
import { isRegistrationExpiring } from "@/utils/isRegistrationExpiring";
import { getCurrentFiscalYear, handleSignout } from "@/utils/utils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Spinner from "../components/ui/Spinner";

const RegistrationGate = () => {
  const { user } = useSelector((state) => state.auth);
  const registeredNextYear = !isRegistrationExpiring(user);
  const currFiscalYear = getCurrentFiscalYear();

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
          select: [3, 6, 29, 30, 48],
          where: `{10.EX.${user.uid}}`,
        }
      : { skip: !user, refetchOnMountOrArgChange: true },
  );

  const {
    data: registrationData,
    isLoading: isRegistrationDataLoading,
    isError: isRegistrationDataError,
    error: registrationDataError,
  } = useQueryForDataQuery(
    user
      ? {
          from: import.meta.env.VITE_QUICKBASE_ARTIST_REGISTRATIONS_TABLE_ID,
          select: [3, 6, 25],
          where: `{13.EX.${user.uid}} AND {25.EX.${currFiscalYear}}`,
          sortBy: [{ fieldId: 25 }, { order: "DESC" }],
        }
      : { skip: !user, refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (artistData?.data && !isArtistDataLoading) {
      dispatch(
        setArtist({
          artistOrg: artistData.data[0][6].value,
          artistRecordId: artistData.data[0][3].value,
          cutoffDate: artistData.data[0][48].value,
        }),
      );
    }
  }, [artistData, isArtistDataLoading]);

  if (isArtistDataLoading || isRegistrationDataLoading) {
    return (
      <div className="flex h-full w-full justify-center pt-24">
        <Spinner />
      </div>
    );
  }

  if (registrationData?.data[0] && !registrationData.data[0][6].value) {
    return (
      <div className="flex flex-col items-start gap-4">
        <div>Your registration request is pending</div>
        <Button onClick={() => handleSignout(dispatch, navigate)}>
          Sign out
        </Button>
      </div>
    );
  }

  if (artistData.data[0][30].value) {
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
          <Button
            variant="outline"
            onClick={() => handleSignout(dispatch, navigate)}
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  if (isArtistDataSuccess) {
    return <Navigate to="/programs" />;
  }
};

export default RegistrationGate;
