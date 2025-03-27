import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DataGrid from "@/components/ui/data-grid";
import Spinner from "@/components/ui/Spinner";
import {
  FISCAL_YEAR_FIRST_MONTH,
  REGISTRATION_CUTOFF_DAY,
  REGISTRATION_CUTOFF_MONTH,
} from "@/constants/constants";
import { registrationColumns } from "@/utils/TableColumns";
import { getNextFiscalYear } from "@/utils/utils";
import { useSelector } from "react-redux";
import { useQueryForDataQuery } from "../redux/api/quickbaseApi";

const formatData = (unformattedData) => {
  const { data } = unformattedData;
  return data.map((record) => {
    return {
      id: record[3].value,
      artist: record[8].value,
      email: record[9].value,
      phone: record[11].value,
      altPhone: record[12].value,
      numPerformers: record[21].value,
      approved: record[6].value,
      fiscalYear: record[25].value,
    };
  });
};

const ArtistRegistrationsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    data: registrationData,
    isError: isRegistrationDataError,
    error: registrationDataError,
  } = useQueryForDataQuery(
    user
      ? {
          from: import.meta.env.VITE_QUICKBASE_ARTIST_REGISTRATIONS_TABLE_ID,
          select: [3, 6, 8, 9, 11, 12, 14, 21, 23, 25, 28],
          where: `{13.EX.${user.uid}}`,
        }
      : { skip: !user, refetchOnMountOrArgChange: true },
  );

  if (!registrationData && !isRegistrationDataError)
    return (
      <div className="flex h-full w-full justify-center pt-24">
        <Spinner />
      </div>
    );

  if (isRegistrationDataError && registrationDataError) {
    console.log("User Data Error: ", registrationDataError);
    return (
      <div className="flex w-full justify-center pt-24">
        <p className="text-xl font-semibold text-destructive">
          An error occurred while obtaining the registration list.
        </p>
      </div>
    );
  }

  const isRegistrationExpiring = () => {
    const nextFiscalYear = getNextFiscalYear();
    const date = new Date();
    const currMonth = date.getMonth();
    const currDay = date.getDate();

    // Check if artist is already registered for next fiscal year
    const registeredNextYear = registrationData.data.forEach((registration) => {
      if (registration[25].value === nextFiscalYear) {
        return false;
      }
    });

    if (registeredNextYear) return false;

    // Not registered for next fiscal year, check month and day
    if (
      currMonth >= REGISTRATION_CUTOFF_MONTH &&
      currDay >= REGISTRATION_CUTOFF_DAY &&
      currMonth < FISCAL_YEAR_FIRST_MONTH
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="w-full">
      {isRegistrationExpiring() && (
        <Card className="z-999 flex min-w-fit max-w-xl bg-yellow-100 text-gray-800 shadow-lg">
          <CardHeader className="flex flex-col items-start">
            <CardHeader className="text-xl font-semibold">
              Your Registration Is Expiring Soon!
            </CardHeader>
            <CardContent className="mt-2 max-w-xl text-sm">
              Your registration will be expiring on&nbsp;
              <span className="font-semibold underline">June 1st.</span>
              &nbsp;Please renew your registration to be eligible to apply for
              programs.
            </CardContent>
            <a
              href="/registration-renewal"
              className="m-6 cursor-pointer rounded-lg bg-yellow-500 px-4 py-2 font-semibold hover:bg-yellow-400 focus:outline-none"
            >
              Re-register Now
            </a>
          </CardHeader>
        </Card>
      )}
      <DataGrid
        allowExport
        data={formatData(registrationData)}
        columns={registrationColumns}
        tableTitle={"Artist Registrations"}
        readOnly
      />
    </div>
  );
};

export default ArtistRegistrationsPage;

// TODO See if any columns need to be changed or have error checking (if fields can be left blank what do we show?)
// TODO Change parameters on when to show a warning that the registration is about to expire.
