import {
  FISCAL_YEAR_FIRST_MONTH,
  REGISTRATION_CUTOFF_DAY,
  REGISTRATION_CUTOFF_MONTH,
  TICKET_VENDOR,
} from "@/constants/constants";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import { useSelector } from "react-redux";
import { getNextFiscalYear } from "./utils";

export const isRegistrationExpiring = () => {
  const { user } = useSelector((state) => state.auth);

  const {
    data: registrationData,
    isLoading: isRegistrationDataLoading,
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

  const {
    data: artistData,
    isLoading: isArtistDataLoading,
    isError: isArtistsError,
    error: artistDataError,
  } = useQueryForDataQuery(
    user
      ? {
          from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
          select: [3, 10, 46],
          where: `{10.EX.${user.uid}}`,
        }
      : { skip: !user, refetchOnMountOrArgChange: true },
  );

  const nextFiscalYear = getNextFiscalYear();
  const date = new Date();
  const currMonth = date.getMonth();
  const currDay = date.getDate();

  if (
    isRegistrationDataLoading ||
    isRegistrationDataError ||
    isArtistDataLoading ||
    isArtistsError
  )
    return false;

  const isTicketVendor = artistData?.data[0][46].value === TICKET_VENDOR;

  if (isTicketVendor) return false;

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
