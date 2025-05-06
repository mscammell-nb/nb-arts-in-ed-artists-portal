import { FISCAL_YEAR_FIRST_MONTH } from "@/constants/constants";
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

// Calculates the key of the current fiscal year
export const getCurrentFiscalYearKey = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const START_YEAR = 13;
  const fiscalYearKey =
    month >= FISCAL_YEAR_FIRST_MONTH
      ? year - 2000 - START_YEAR + 1
      : year - 2000 - START_YEAR;
  return fiscalYearKey;
};

export const getNextFiscalYearKey = () => {
  return getCurrentFiscalYearKey() + 1;
};

// Parses a phone number in this format: (123) 456-7890 -> 1234567890
export const parsePhoneNumber = (phoneNumber) => phoneNumber.replace(/\D/g, "");

export const getCurrentFiscalYear = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const fiscalYear =
    month >= FISCAL_YEAR_FIRST_MONTH
      ? year.toString().slice(2) + "/" + (year + 1).toString().slice(2)
      : (year - 1).toString().slice(2) + "/" + year.toString().slice(2);

  return fiscalYear;
};

export const getNextFiscalYear = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const fiscalYear =
    month >= FISCAL_YEAR_FIRST_MONTH
      ? (year + 1).toString().slice(2) + "/" + (year + 2).toString().slice(2)
      : year.toString().slice(2) + "/" + (year + 1).toString().slice(2);

  return fiscalYear;
};

export const getCutoffFiscalYearKey = (cutoffMonth, cutoffDay) => {
  const date = new Date();
  const currMonth = date.getMonth();
  const currDay = date.getDate();

  if (
    (currMonth > cutoffMonth && currMonth < FISCAL_YEAR_FIRST_MONTH) ||
    (currMonth == cutoffMonth && currDay >= cutoffDay)
  ) {
    return getNextFiscalYearKey();
  } else {
    return getCurrentFiscalYearKey();
  }
};

export const getCutoffFiscalYear = (cutoffMonth, cutoffDay) => {
  const date = new Date();
  const currMonth = date.getMonth();
  const currDay = date.getDate();

  if (
    (currMonth > cutoffMonth && currMonth < FISCAL_YEAR_FIRST_MONTH) ||
    (currMonth == cutoffMonth && currDay >= cutoffDay)
  ) {
    return getNextFiscalYear();
  } else {
    return getCurrentFiscalYear();
  }
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
