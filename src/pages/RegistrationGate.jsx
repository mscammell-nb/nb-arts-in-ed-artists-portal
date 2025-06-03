import { Button } from "@/components/ui/button";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import { setArtistData } from "@/redux/slices/artistSlice";
import { updateCutoffDates } from "@/redux/slices/cutoffSlice";
import { isRegistrationExpiring } from "@/utils/isRegistrationExpiring";
import {
  getCurrentFiscalYear,
  getNextFiscalYear,
  handleSignout,
  isDuringCutoff,
} from "@/utils/utils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Clock,
  FileText,
  LogOut,
  RefreshCcw,
  RefreshCcwDot,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RegistrationGate = () => {
  const user = useSelector((state) => state.auth.user);
  const registeredNextYear = !isRegistrationExpiring(user);
  const programCutoffStartDate = useSelector(
    (state) => state.cutoff.programCutoffStartDate,
  );

  const programCutoffEndDate = useSelector(
    (state) => state.cutoff.programCutoffEndDate,
  );
  const tempCutoffStartDate = new Date(programCutoffStartDate);
  const startMonth = tempCutoffStartDate.getMonth();
  const startDay = tempCutoffStartDate.getDate();
  const tempCutoffEndDate = new Date(programCutoffEndDate);
  const endMonth = tempCutoffEndDate.getMonth();
  const endDay = tempCutoffEndDate.getDate();
  const duringCutoff = isDuringCutoff(startMonth, startDay, endMonth, endDay);
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
          select: [3, 6, 29, 30, 48, 58, 62, 63],
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
        setArtistData({
          artistOrg: artistData.data[0][6].value,
          artistRecordId: artistData.data[0][3].value,
        }),
        dispatch(
          updateCutoffDates({
            registrationCutoffStartDate: artistData.data[0][48].value,
            registrationCutoffEndDate: artistData.data[0][63].value,
            programCutoffStartDate: artistData.data[0][58].value,
            programCutoffEndDate: artistData.data[0][62].value,
          }),
        ),
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
      <div className=" -mt-14 flex w-full flex-1 flex-col items-center justify-center">
        <div className=" max-w-[500px] rounded-xl border border-slate-200 bg-white p-8 text-center shadow-lg ">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="mb-3 text-xl font-semibold text-slate-800">
            Registration Pending
          </h1>
          <p className="mb-8 leading-relaxed text-slate-600">
            Your registration request is currently being processed. We'll notify
            you once it's complete.
          </p>
          <Button
            onClick={() => handleSignout(dispatch, navigate)}
            className="text-md flex w-full items-center gap-3 py-5 font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    );
  }

  // IF during cutoff and have registration for next year but not this year, show pending for next year
  if (duringCutoff && registeredNextYear && !registrationData?.data[0]) {
    return (
      <>
        <Alert variant="warning" className="mb-4 bg-amber-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Registration Status</AlertTitle>
          <AlertDescription>
            Your request for registration for the next fiscal year{" "}
            <span className="font-bold">{getNextFiscalYear()}</span> is pending
            review.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-6 rounded-lg border border-slate-200 bg-white p-8 shadow-md">
          <div className="flex items-start space-x-4 rounded-lg border border-blue-200 bg-blue-50 p-6">
            <Calendar className="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-600" />
            <div>
              <h3 className="mb-2 text-lg font-semibold text-blue-900">
                Fiscal Year Information
              </h3>
              <p className="leading-relaxed text-blue-800">
                The next fiscal year starts on{" "}
                <span className="font-medium">July 1, 2025</span>
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-start space-x-3">
              <FileText className="mt-0.5 h-5 w-5 text-slate-600" />
              <div>
                <h4 className="mb-2 font-medium text-slate-800">
                  What happens next?
                </h4>
                <p className="mb-3 text-sm leading-relaxed text-slate-600">
                  We will review your registration request and notify you of the
                  status. If you are approved you can access the website at the
                  start of the next fiscal year.
                </p>
                <p className="text-sm text-slate-600">
                  If you have any questions, please contact "ENTER SUPPORT EMAIL
                  HERE".
                </p>
              </div>
            </div>
          </div>
          <Button
            className="flex items-center gap-3 self-start p-5 text-lg"
            onClick={() => handleSignout(dispatch, navigate)}
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </>
    );
  }

  if (artistData.data[0][30].value) {
    return (
      <div className=" -mt-14 flex w-full flex-1 flex-col items-center justify-center">
        <div className=" max-w-[500px] rounded-xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="mb-3 text-xl font-semibold text-slate-800">
            Registration Expired
          </h1>
          <p className="mb-8 leading-relaxed text-slate-600">
            Your registration has expired. Please go to the{" "}
            <Link to={"/registration-renewal"} className="underline">
              Registration Renewal
            </Link>{" "}
            page to submit a new registration.
          </p>
          <div className="flex flex-col gap-3">
            <Button className="text-md flex w-full items-center gap-3 py-5 font-medium" onClick={()=>navigate("/registration-renewal")}>
              <RefreshCcw className="h-4 w-4" />
              Registration Renewal
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSignout(dispatch, navigate)}
              className="text-md flex w-full items-center gap-3 py-5 font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isArtistDataSuccess) {
    return <Navigate to="/programs" />;
  }
};

export default RegistrationGate;
