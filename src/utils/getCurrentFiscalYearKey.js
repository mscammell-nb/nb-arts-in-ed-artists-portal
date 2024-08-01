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