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
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useQueryForDataQuery } from "../redux/api/quickbaseApi";

const userUid = localStorage.getItem("uid");

const ArtistRegistrationsPage = () => {
  const {
    data: registrationData,
    isError: isRegistrationDataError,
    error: registrationDataError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_ARTIST_REGISTRATIONS_TABLE_ID,
    select: [3, 6, 8, 9, 11, 12, 14, 21, 23, 25, 28],
    where: `{13.EX.${userUid}}`,
  });

  const {
    data: artistData,
    isError: isArtistDataError,
    error: artistDataError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
    select: [30],
    where: `{10.EX.${userUid}}`,
  });

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
    (!registrationData && !isRegistrationDataError) ||
    (!artistData && !isArtistDataError)
  )
    return (
      <div className="flex h-full w-full justify-center pt-24">
        <Spinner />
      </div>
    );

  if (
    (isRegistrationDataError && registrationDataError) ||
    (isArtistDataError && artistDataError)
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

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-fit">
        <section className="flex flex-col space-y-6">
          {artistData.data[0][30].value && (
            <Card className="z-999 flex min-w-fit max-w-xl bg-red-200 text-gray-800 shadow-lg">
              <CardHeader className="flex flex-col items-start">
                <CardHeader className="text-xl font-semibold">
                  Your Registration Has Expired
                </CardHeader>
                <CardContent className="mt-2 max-w-xl text-sm">
                  Your registration has expired for this fiscal year, please
                  re-register to be eligible to apply for programs.
                </CardContent>
                <a
                  href="/registration-renewal"
                  className="font-semi m-6 cursor-pointer rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-400 focus:outline-none"
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