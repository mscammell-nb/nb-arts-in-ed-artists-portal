import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getNextFiscalYear } from "@/utils/utils";
import { Check, X } from "lucide-react";
import { useQueryForDataQuery } from "../redux/api/quickbaseApi";
import { useSelector } from "react-redux";


const ArtistRegistrationsPage = () => {
  const {user} = useSelector((state) => state.auth);
  const {
    data: registrationData,
    isError: isRegistrationDataError,
    error: registrationDataError,
  } = useQueryForDataQuery(user ?{
    from: import.meta.env.VITE_QUICKBASE_ARTIST_REGISTRATIONS_TABLE_ID,
    select: [3, 6, 8, 9, 11, 12, 14, 21, 23, 25, 28],
    where: `{13.EX.${user.uid}}`,
  }: {skip:!user, refetchOnMountOrArgChange: true});

  const renderStatusIcon = (value) => {
    switch (value) {
      case true:
        return <Check size={18} strokeWidth={1.75} />;
      case false:
        return <X size={18} strokeWidth={1.75} />;
      default:
        return "N/A";
    }
  };

  if (
    (!registrationData && !isRegistrationDataError)
  )
    return (
      <div className="flex h-full w-full justify-center pt-24">
        <Spinner />
      </div>
    );

  if (
    (isRegistrationDataError && registrationDataError)
  ) {
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

    // Check if registered for next fiscal year
    const registeredNextYear = registrationData.data.forEach((registration) => {
      if (registration[25].value === nextFiscalYear) {
        return false;
      }
    });

    if (registeredNextYear) return false;

    // Not registered for next fiscal year, check month
    if (currMonth > 3 && currMonth < 6) {
      return true;
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-fit">
        <section className="flex flex-col space-y-6">
          {isRegistrationExpiring() && (
            <Card className="z-999 flex min-w-fit max-w-xl bg-yellow-100 text-gray-800 shadow-lg">
              <CardHeader className="flex flex-col items-start">
                <CardHeader className="text-xl font-semibold">
                  Your Registration Is Expiring Soon!
                </CardHeader>
                <CardContent className="mt-2 max-w-xl text-sm">
                  Your registration will be expiring on&nbsp;
                  <span className="font-semibold underline">June 1st.</span>
                  &nbsp;Please renew your registration to be eligible to apply
                  for programs.
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
          <Card>
            <CardHeader>
              <CardTitle>Registration Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">
                      Artist/Organization
                    </TableHead>
                    <TableHead className="text-center">Fiscal Year</TableHead>
                    <TableHead className="text-center">
                      Number of Performers
                    </TableHead>
                    <TableHead className="text-center">Phone</TableHead>
                    <TableHead className="text-center">Alt Phone</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Approved</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrationData &&
                    registrationData.data.map((registration) => (
                      <TableRow key={registration[3].value}>
                        <TableCell className="text-center">
                          {registration[8].value}
                        </TableCell>
                        <TableCell className="text-center">
                          {registration[25].value}
                        </TableCell>
                        <TableCell className="text-center">
                          {registration[21].value || "N/A"}
                        </TableCell>
                        <TableCell className="text-center">
                          {registration[11].value}
                        </TableCell>
                        <TableCell className="text-center">
                          {registration[12].value}
                        </TableCell>
                        <TableCell className="text-center">
                          {registration[9].value}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            {renderStatusIcon(registration[6].value)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ArtistRegistrationsPage;

// TODO See if any columns need to be changed or have error checking (if fields can be left blank what do we show?)
// TODO Change parameters on when to show a warning that the registration is about to expire.
