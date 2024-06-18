// Why are we using objects as parameters? Refer to this article: https://www.freecodecamp.org/news/elegant-patterns-in-modern-javascript-roro-be01e7669cbd/

// Constants
const QB_REALM_HOSTNAME = "nassauboces.quickbase.com";
const API_URL = "https://api.quickbase.com/v1";

// This object emulates an enum
const Methods = Object.freeze({
  Get: "GET",
  Post: "POST",
  Delete: "DELETE",
});

// This function sends a request to the quickbase API with the given parameters
const fetchApi = async ({
  apiUrl,
  requestMethod,
  requestHeaders,
  requestBody = null,
}) => {
  try {
    return await fetch(apiUrl, {
      method: requestMethod,
      headers: requestHeaders,
      body: requestBody !== null ? JSON.stringify(requestBody) : requestBody,
      // credentials: "include",
    });
  } catch (error) {
    console.error(error);
    throw new Error(`An error ocurred while fetching the data: ${error}`);
  }
};

// Function to copy to clipboard
const copyToClipboard = async (codeBlockId) => {
  const codeBlock = document.getElementById(codeBlockId).textContent;
  try {
    await navigator.clipboard.writeText(codeBlock);
    console.log("Content copied to clipboard");
  } catch (error) {
    console.error("Failed to copy: ", error);
  }
};

// ************************* Records  *************************

// Get records function
const getRecords = async ({
  authorizationToken,
  tableId,
  fieldIds = [],
  whereQuery = null,
  sortByQuery = [],
  groupByQuery = [],
  options = {},
}) => {
  const requestHeaders = {
    "Content-Type": "application/json",
    "QB-Realm-Hostname": QB_REALM_HOSTNAME,
    Authorization: `QB-USER-TOKEN ${authorizationToken}`,
  };

  const requestBody = {
    from: tableId,
    select: fieldIds,
    where: whereQuery,
    sortBy: sortByQuery,
    groupBy: groupByQuery,
    options,
  };

  const response = await fetchApi({
    apiUrl: `${API_URL}/records/query`,
    requestMethod: Methods.Post,
    requestHeaders,
    requestBody,
  });

  return response;
};

// This function can be used to add a new record or edit an existing one.
const addOrUpdateRecords = async ({
  authorizationToken,
  tableId,
  data,
  mergeFieldId = null,
  fieldsToReturn = [],
}) => {
  const requestHeaders = {
    "Content-Type": "application/json",
    "QB-Realm-Hostname": QB_REALM_HOSTNAME,
    Authorization: `QB-USER-TOKEN ${authorizationToken}`,
  };

  const requestBody = {
    to: tableId,
    data,
    mergeFieldId,
    fieldsToReturn,
  };

  if (mergeFieldId === null) {
    delete requestBody.mergeFieldId;
  }

  const response = await fetchApi({
    apiUrl: `${API_URL}/records`,
    requestMethod: Methods.Post,
    requestHeaders,
    requestBody,
  });

  return response;
};

// Delete records function
const deleteRecords = async ({ authorizationToken, tableId, whereQuery }) => {
  const requestHeaders = {
    "Content-Type": "application/json",
    "QB-Realm-Hostname": QB_REALM_HOSTNAME,
    Authorization: `QB-USER-TOKEN ${authorizationToken}`,
  };

  const requestBody = {
    from: tableId,
    where: whereQuery,
  };

  const response = await fetchApi({
    apiUrl: `${API_URL}/records`,
    requestMethod: Methods.Delete,
    requestHeaders,
    requestBody,
  });

  return response;
};

// Test getRecords function (this function is for testing purposes only)
const testGetRecords = async () => {
  const paramsObject = {
    authorizationToken: "b9dwzc_br69_0_ijeb4kefqwg6cf3rmrmdprkqaz",
    tableId: "bt2zdgh3c",
    fieldIds: [3, 6, 8, 17, 7],
    sortByQuery: [
      {
        fieldId: 3,
        order: "ASC",
      },
    ],
  };

  try {
    const jsonData = await getRecords(paramsObject);
    console.log("getRecords function");
    console.log(jsonData);
  } catch (error) {
    console.error(error);
  }
};

// Test addRecords function (this function is for testing purposes only)
const testAddOrUpdateRecords = async () => {
  const paramsObject = {
    authorizationToken: "b9dwzc_br69_0_ijeb4kefqwg6cf3rmrmdprkqaz",
    tableId: "bt2zdgh3c",
    data: [
      {
        3: {
          value: 14,
        },
        6: {
          value: "Bayer Leverkusen",
        },
        8: {
          value: "Bundesliga",
        },
        9: {
          value: 64,
        },
        18: {
          value: 4,
        },
      },
    ],
    fieldsToReturn: [6, 7, 8],
  };

  try {
    const jsonData = await addOrUpdateRecords(paramsObject);
    console.log(jsonData);
  } catch (error) {
    console.error(error);
  }
};

// Test deleteRecords function (this function is for testing purposes only)
const testDeleteRecords = async () => {
  const paramsObject = {
    authorizationToken: "b9dwzc_br69_0_ijeb4kefqwg6cf3rmrmdprkqaz",
    tableId: "bt2zdgh3c",
    whereQuery: "{3.EX.'2'}",
  };

  try {
    const jsonData = await deleteRecords(paramsObject);
    console.log(jsonData);
  } catch (error) {
    console.error(error);
  }
};

// ************************* Fields  *************************

// Get properties of an individual field
const getField = async ({
  authorizationToken,
  fieldId,
  tableId,
  includeFieldPerms = false,
}) => {
  const requestHeaders = {
    "Content-Type": "application/json",
    "QB-Realm-Hostname": QB_REALM_HOSTNAME,
    Authorization: `QB-USER-TOKEN ${authorizationToken}`,
  };

  const response = await fetchApi({
    apiUrl: `${API_URL}/fields/${fieldId}?tableId=${tableId}&includeFieldPerms=${includeFieldPerms}`,
    requestMethod: Methods.Get,
    requestHeaders,
  });

  return response;
};

const testGetField = async () => {
  const paramsObject = {
    authorizationToken: "b9dwzc_br69_0_ijeb4kefqwg6cf3rmrmdprkqaz",
    fieldId: 7,
    tableId: "bt2zdgh3c",
    includeFieldPerms: true,
  };

  try {
    const jsonData = await getField(paramsObject);
    console.log(jsonData);
  } catch (error) {
    console.error(error);
  }
};

// This function is used to get the usage for a field
const getFieldUsage = async ({ authorizationToken, fieldId, tableId }) => {
  const requestHeaders = {
    "Content-Type": "application/json",
    "QB-Realm-Hostname": QB_REALM_HOSTNAME,
    Authorization: `QB-USER-TOKEN ${authorizationToken}`,
  };

  const response = await fetchApi({
    apiUrl: `${API_URL}/fields/usage/${fieldId}?tableId=${tableId}`,
    requestMethod: Methods.GET,
    requestHeaders,
  });

  return response;
};

const testGetFieldUsage = async () => {
  const paramsObject = {
    authorizationToken: "b9dwzc_br69_0_ijeb4kefqwg6cf3rmrmdprkqaz",
    fieldId: 7,
    tableId: "bt2zdgh3c",
  };

  try {
    const jsonData = await getFieldUsage(paramsObject);
    console.log(jsonData);
  } catch (error) {
    console.error(error);
  }
};

// ************************* Auth  *************************

// This function is used to get a temporary token for a dbid
const getTemporaryToken = async ({ dbid, appToken }) => {
  const requestHeaders = {
    "Content-Type": "application/json",
    "QB-Realm-Hostname": QB_REALM_HOSTNAME,
    // Authorization: `QB-USER-TOKEN ${authorizationToken}`,
    "QB-App-Token": "bwc4w68dj3qyfsbwggavvbsuihcj",
  };

  const response = await fetchApi({
    apiUrl: `${API_URL}/auth/temporary/${dbid}`,
    requestMethod: Methods.Get,
    requestHeaders,
  });

  return response;
};

// Tests the getTemporaryToken function (this function is for testing purposes only)
const testGetTemporaryToken = async () => {
  const paramsObject = {
    dbid: "bt2zdgh3c",
  };

  try {
    const jsonData = await getTemporaryToken(paramsObject);
    console.log(jsonData);
  } catch (error) {
    console.error(error);
  }
};

// ************************* Files  *************************

// This function is ussed to download the file attachment
const downloadFile = async ({
  authorizationToken,
  tableId,
  recordId,
  fieldId,
  versionNumber,
}) => {
  const requestHeaders = {
    "Content-Type": "application/json",
    "QB-Realm-Hostname": QB_REALM_HOSTNAME,
    Authorization: `QB-USER-TOKEN ${authorizationToken}`,
  };

  const response = await fetchApi({
    apiUrl: `${API_URL}/files/${tableId}/${recordId}/${fieldId}/${14}`,
    requestMethod: Methods.Get,
    requestHeaders,
  });

  const file = response.body;

  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    console.log("READER RESULT");
    console.log(reader.result);
    return reader.result;
  };
  reader.onerror = function (error) {
    console.log("Error: ", error);
  };
};

const testDownloadFile = async () => {
  const paramsObject = {
    authorizationToken: "b9dwzc_br69_0_ijeb4kefqwg6cf3rmrmdprkqaz",
    tableId: "bt2zdgh3c",
    recordId: 5,
    fieldId: 26,
    versionNumber: 0,
  };

  try {
    const jsonData = await downloadFile(paramsObject);
    console.log(jsonData);
  } catch (error) {
    console.error(error);
  }
};

// This function deletes one file attachment
const deleteFile = async ({
  authorizationToken,
  tableId,
  recordId,
  fieldId,
}) => {
  const requestHeaders = {
    "Content-Type": "application/json",
    "QB-Realm-Hostname": QB_REALM_HOSTNAME,
    Authorization: `QB-USER-TOKEN ${authorizationToken}`,
  };

  // We need to query the version number of the record whose file we want to delete.
  // This is because the Quickbase REST API lacks a way to represent the current version
  // number, unlike the SOAP API, which uses "0" to denote the current version number.
  const records = await getRecords({
    authorizationToken: "b9dwzc_br69_0_ijeb4kefqwg6cf3rmrmdprkqaz",
    tableId: "bt2zdgh3c",
    fieldIds: [fieldId], // id of the file field
    whereQuery: `{3.EX.${recordId}}`, // Record ID of the record whose file we want to delete.
  });

  const { versions } = records.data[0][fieldId].value;

  // We loop over the versions to find the current one,
  // which the same as the the greates version number.
  const versionNumber = versions.reduce(
    (maxVersion, version) =>
      Math.max(maxVersion, parseInt(version.versionNumber)),
    0,
  );

  const response = await fetchApi({
    apiUrl: `${API_URL}/files/${tableId}/${recordId}/${fieldId}/${versionNumber}`,
    requestMethod: Methods.Delete,
    requestHeaders,
  });

  return response;
};

const testDeleteFile = async () => {
  const paramsObject = {
    authorizationToken: "b9dwzc_br69_0_ijeb4kefqwg6cf3rmrmdprkqaz",
    tableId: "bt2zdgh3c",
    recordId: 5,
    fieldId: 26,
  };

  try {
    const jsonData = await deleteFile(paramsObject);
    console.log(jsonData);
  } catch (error) {
    console.error(error);
  }
};
