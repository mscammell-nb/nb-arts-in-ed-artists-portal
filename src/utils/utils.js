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

// Calculates the key of the current fiscal year
export const getCurrentFiscalYearKey = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const START_YEAR = 13;
  const fiscalYearKey =
    month > 6 ? year - 2000 - START_YEAR + 1 : year - 2000 - START_YEAR;
  return fiscalYearKey;
};

// Parses a phone number in this format: (123) 456-7890 -> 1234567890
export const parsePhoneNumber = (phoneNumber) => phoneNumber.replace(/\D/g, "");

export const getCurrentFiscalYear = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const fiscalYear =
    month > 5
      ? year.toString().slice(2) + "/" + (year + 1).toString().slice(2)
      : (year - 1).toString().slice(2) + "/" + year.toString().slice(2);

  return fiscalYear;
};

export const getNextFiscalYear = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const fiscalYear =
    month > 5
      ? (year + 1).toString().slice(2) + "/" + (year + 2).toString().slice(2)
      : year.toString().slice(2) + "/" + (year + 1).toString().slice(2);

  return fiscalYear;
};

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