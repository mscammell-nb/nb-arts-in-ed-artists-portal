import {
  FISCAL_YEAR_FIRST_DAY,
  FISCAL_YEAR_FIRST_MONTH,
} from "@/constants/constants";
import { signOut } from "@/redux/slices/authSlice";

export const capitalizeString = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatAuthErrorMessage = (message) => {
  const removedAuthPrefix = message.substring("auth/".length);
  const removedDashes = removedAuthPrefix.replaceAll("-", " ");
  const capitalized =
    removedDashes.at(0).toUpperCase() + removedDashes.slice(1);
  return capitalized;
};

/**
 * isDuringCutoff returns true if the current date is within the cutoff period.
 *
 * The cutoff period is the period between the first day of the fiscal year
 * and the specified cutoff end date. If no cutoff end date is specified,
 * the default is the first day of the fiscal year.
 *
 * @param  {number} [cutoffEndMonth=FISCAL_YEAR_FIRST_MONTH]
 * @param  {number} [cutoffEndDay=FISCAL_YEAR_FIRST_DAY]
 * @return {boolean}
 */
export const isDuringCutoff = (
  cutoffStartMonth,
  cutoffStartDay,
  cutoffEndMonth = FISCAL_YEAR_FIRST_MONTH,
  cutoffEndDay = FISCAL_YEAR_FIRST_DAY,
) => {
  const date = new Date();
  const currMonth = date.getMonth();
  const currDay = date.getDate();

  const currentDate = new Date(date.getFullYear(), currMonth, currDay);
  const startDate = new Date(
    date.getFullYear(),
    cutoffStartMonth,
    cutoffStartDay,
  );
  let endDate = new Date(date.getFullYear(), cutoffEndMonth, cutoffEndDay);

  return currentDate >= startDate && currentDate <= endDate;
};

/**
 * isSecondFiscalYear returns true if the current date is in the second part of
 * the fiscal year.
 *
 * The second part of the fiscal year is the period after the first day of the
 * fiscal year.
 *
 * @return {boolean}
 */
export const isSecondFiscalYear = () => {
  const d = new Date();
  const month = d.getMonth();
  const day = d.getDate();
  return (
    month > FISCAL_YEAR_FIRST_MONTH ||
    (month == FISCAL_YEAR_FIRST_MONTH && day >= FISCAL_YEAR_FIRST_DAY)
  );
};

/**
 * getCurrentFiscalYearKey returns the current fiscal year key.
 *
 * The current fiscal year key is the year of the current fiscal year
 * minus 2000 minus the start year (2013).
 *
 * For example, if the current year is 2023, the current fiscal year
 * key is 10.
 *
 * @return {number} The current fiscal year key.
 */
export const getCurrentFiscalYearKey = () => {
  const d = new Date();
  const year = d.getFullYear();
  const START_YEAR = 13;

  const isSecond = isSecondFiscalYear();
  return isSecond ? year - 2000 - START_YEAR + 1 : year - 2000 - START_YEAR;
};

export const getNextFiscalYearKey = () => {
  return getCurrentFiscalYearKey() + 1;
};

/**
 * getFirstFiscalYear returns the first fiscal year as a string.
 *
 * The first fiscal year is the previous year and the current year, separated by a slash.
 * For example, if the current year is 2023, the first fiscal year will be '22/23'.
 *
 * @return {string} The first fiscal year as a string.
 */
export const getFirstFiscalYear = () => {
  const d = new Date();
  const year = d.getFullYear();
  return (year - 1).toString().slice(2) + "/" + year.toString().slice(2);
};

/**
 * getSecondFiscalYear returns the second fiscal year as a string.
 *
 * The second fiscal year is the current year and the next year, separated by a slash.
 * For example, if the current year is 2023, the second fiscal year will be '23/24'.
 *
 * @return {string} The second fiscal year as a string.
 */
export const getSecondFiscalYear = () => {
  const d = new Date();
  const year = d.getFullYear();
  return year.toString().slice(2) + "/" + (year + 1).toString().slice(2);
};

/**
 * getFirstFiscalYearKey returns the first fiscal year key.
 *
 * The first fiscal year key is the year of the current fiscal year minus 2000 minus the start year (2013).
 * This function is useful for determining the fiscal year key of the current year.
 *
 * For example, if the current year is 2023, the first fiscal year key will be 10.
 *
 * @return {number} The first fiscal year key.
 */
export const getFirstFiscalYearKey = () => {
  const d = new Date();
  const year = d.getFullYear();
  const START_YEAR = 13;
  return year - 2000 - START_YEAR;
};

/**
 * getSecondFiscalYearKey returns the second fiscal year key.
 *
 * The second fiscal year key is the year of the current fiscal year minus 2000 minus the start year (2013) plus one.
 * This function is useful for determining the fiscal year key of the year after the current year.
 *
 * For example, if the current year is 2023, the second fiscal year key will be 11.
 *
 * @return {number} The second fiscal year key.
 */
export const getSecondFiscalYearKey = () => {
  const d = new Date();
  const year = d.getFullYear();
  const START_YEAR = 13;
  return year - 2000 - START_YEAR + 1;
};

export const getCurrentFiscalYear = () => {
  const isSecond = isSecondFiscalYear();
  return isSecond ? getSecondFiscalYear() : getFirstFiscalYear();
};

export const getNextFiscalYear = () => {
  const d = new Date();
  const year = d.getFullYear();
  const isSecond = isSecondFiscalYear();
  return isSecond
    ? getSecondFiscalYear()
    : year.toString().slice(2) + "/" + (year + 1).toString().slice(2);
};

export const getCutoffFiscalYearKey = (
  cutoffStartMonth,
  cutoffStartDay,
  cutoffEndMonth = FISCAL_YEAR_FIRST_MONTH,
  cutoffEndDay = FISCAL_YEAR_FIRST_DAY,
) => {
  const isCutoff = isDuringCutoff(
    cutoffStartMonth,
    cutoffStartDay,
    cutoffEndMonth,
    cutoffEndDay,
  );
  return isCutoff ? getSecondFiscalYearKey() : getFirstFiscalYearKey();
};

export const getCutoffFiscalYear = (
  cutoffStartMonth,
  cutoffStartDay,
  cutoffEndMonth = FISCAL_YEAR_FIRST_MONTH,
  cutoffEndDay = FISCAL_YEAR_FIRST_DAY,
) => {
  const isCutoff = isDuringCutoff(
    cutoffStartMonth,
    cutoffStartDay,
    cutoffEndMonth,
    cutoffEndDay,
  );
  const isSecond = isSecondFiscalYear();
  if (isSecond) return getSecondFiscalYear();
  return isCutoff ? getSecondFiscalYear() : getFirstFiscalYear();
};

// Parses a phone number in this format: (123) 456-7890 -> 1234567890
export const parsePhoneNumber = (phoneNumber) => phoneNumber.replace(/\D/g, "");

const getFileName = (contentDisposition) => {
  if (!contentDisposition) return null;

  const filenameStarMatch = contentDisposition.match(
    /filename\*=utf-8''([^;]+)/i,
  );
  // RFC 5987 encoded (ex: filename*=utf-8''filename.txt)
  if (filenameStarMatch && filenameStarMatch[1])
    return decodeURIComponent(filenameStarMatch[1]);

  // Normal format
  const filenameMatch = contentDisposition.match(/filename\*="?(.+?)"?$/);
  if (filenameMatch && filenameMatch[1]) return filenameMatch[1];

  return null;
};

export const downloadFile = async (tableId, fieldId, id, versionNumber) => {
  let headers = {
    "QB-Realm-Hostname": import.meta.env.VITE_QB_REALM_HOSTNAME,
    "User-Agent": "{User-Agent}",
    Authorization: `QB-USER-TOKEN ${import.meta.env.VITE_QUICKBASE_AUTHORIZATION_TOKEN}`,
    "Content-Type": "application/octet-stream",
  };
  fetch(
    `https://api.quickbase.com/v1/files/${tableId}/${id}/${fieldId}/${versionNumber}`,
    {
      method: "GET",
      headers: headers,
    },
  )
    .then(async (res) => {
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        const base64Data = await res.text();
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");

        downloadLink.href = linkSource;
        downloadLink.download = getFileName(
          res.headers.get("content-disposition"),
        );
        downloadLink.click();
        return;
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

export const uploadFile = async (fileUpload, field) => {
  let base64 = await fileToBase64(fileUpload);
  base64 = base64.split("base64,")[1];

  return {
    [field]: {
      value: {
        fileName: fileUpload.name,
        data: base64,
      },
    },
  };
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
export const deleteRow = async (tableId, fieldId, rowId, refetch) => {
  let headers = {
    "QB-Realm-Hostname": import.meta.env.VITE_QB_REALM_HOSTNAME,
    "User-Agent": "{User-Agent}",
    Authorization: `QB-USER-TOKEN ${import.meta.env.VITE_QUICKBASE_AUTHORIZATION_TOKEN}`,
    "Content-Type": "application/json",
  };
  const body = {
    from: tableId,
    where: `{${fieldId}.EX.${rowId}}`,
  };
  fetch(`https://api.quickbase.com/v1/records`, {
    method: "DELETE",
    headers: headers,
    body: JSON.stringify(body),
  })
    .then((res) => {
      return res.json().then((res) => refetch());
    })
    .catch((err) => {
      console.error(err);
    });
};

export const groupByIdAndField = (arr) => {
  const res = [];
  const grouped = {};
  arr.forEach((item) => {
    if (!grouped[item.id]) {
      grouped[item.id] = {};
    }
    grouped[item.id][item.field] = { value: item.value };
  });

  for (const id in grouped) {
    const group = grouped[id];
    const formattedGroup = { 3: { value: id } };

    for (const field in group) {
      formattedGroup[field] = group[field];
    }
    res.push(formattedGroup);
  }
  return res;
};

export const handleSignout = async (dispatch, navigate) => {
  await dispatch(signOut());
  localStorage.clear();
  navigate("/login");
};

export const formatCurrency = (value) => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};
