export const formatDocData = (docData) => {
  const { data } = docData;
  return data.map((record) => {
    let versionNumber = record[7].value.versions.slice(-1);
    console.log("NUMBERS", versionNumber);
    return {
      id: record[3].value,
      fiscalYear: record[11].value,
      documentType: record[6].value,
      artist: record[9].value,
      documentName: record[7].value.versions.slice(-1)[0].fileName,
      versionNumber: versionNumber,
      file: record[7],
    };
  });
};
