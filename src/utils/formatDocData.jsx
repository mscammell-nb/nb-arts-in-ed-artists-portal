export const formatDocData = (docData) => {
  const { data } = docData;
  return data.map((record) => {
    let versionNumber = [...record[7].value.versions];
    versionNumber = versionNumber.pop().versionNumber;
    return {
      id: record[3].value,
      fiscalYear: record[11].value,
      documentType: record[6].value,
      artist: record[9].value,
      documentName: record[7].value.versions[0].fileName,
      versionNumber: versionNumber,
      file: record[7],
    };
  });
};
