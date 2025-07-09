import DataGrid from "@/components/data-grid/data-grid";
import Spinner from "@/components/ui/Spinner";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import {
  baseContractColumns,
  requestsAwaitingApprovalColumns,
} from "@/utils/TableColumns";
import {
  formatCurrency,
  getCurrentFiscalYear,
  getLatestDate,
} from "@/utils/utils";
import { compareAsc, format } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const formatRequestsAwaitingApprovalData = (
  requestsAwaitingApprovalData,
  requestsDates,
) => {
  const { data } = requestsAwaitingApprovalData;
  return data.map((record) => {
    const requestorName = record[24].value + " " + record[25].value;
    const id = record[3].value;
    const requestedDates =
      requestsDates?.data.length > 0
        ? requestsDates.data.filter((rd) => rd[9].value === record[3].value)
        : null;
    return {
      id: id,
      program: record[7].value,
      description: record[8].value,
      amount: formatCurrency(record[9].value),
      requestor: requestorName,
      district: record[14].value,
      requestedDates: requestedDates,
    };
  });
};
const formatContractsData = (record) => {
  return {
    id: record[3]?.value,
    coser: record[28]?.value,
    requestor: record[35].value + " " + record[36].value,
    requestorEmail: record[34].value,
    requestorPhone: record[37].value,
    programTitle: record[20]?.value,
    fiscalYear: record[24]?.value,
    cost: record[22]?.value,
    dateOfService: record[30]?.value,
    district: record[23]?.value,
    invoiceDate: record[32]?.value,
  };
};

function ArtistContractsPage() {
  const { artistRecordId, has3References } = useSelector(
    (state) => state.artist,
  );
  const [futureContracts, setFutureContracts] = useState([]);
  const [pastContracts, setPastContracts] = useState([]);
  const {
    data: requestsAwaitingApprovalData,
    isLoading: isRequestsAwaitingApprovalDataLoading,
    isError: isRequestsAwaitingApprovalDataError,
    error: requestsAwaitingApprovalDataError,
  } = useQueryForDataQuery(
    artistRecordId
      ? {
          from: import.meta.env.VITE_QUICKBASE_PROGRAM_REQUESTS_TABLE_ID,
          select: [3, 7, 8, 9, 14, 22, 24, 25, 26, 27, 74, 75],
          // AND if status is not yet reviewed, and if both district and boces are approved
          where: `{23.EX.'${artistRecordId}'}AND{10.EX.${getCurrentFiscalYear()}}AND{35.EX.'Approved'}AND{36.EX.'Approved'}AND{74.EX.'Not Reviewed'}`,
        }
      : { skip: true, refetchOnMountOrArgChange: true },
  );
  const {
    data: requestedDatesData,
    isLoading: isRequestedDatesDataLoading,
    isError: isRequestedDatesDataError,
    error: requestedDatesDataError,
  } = useQueryForDataQuery(
    artistRecordId
      ? {
          from: import.meta.env.VITE_QUICKBASE_PROGRAM_REQUEST_DATES_TABLE_ID,
          select: [3, 6, 9, 15, 18, 22],
          where: `{24.EX.'${artistRecordId}'}`,
          sortBy: [{ fieldId: 11 }, { order: "DESC" }],
        }
      : { skip: true, refetchOnMountOrArgChange: true },
  );

  const { data: allContractsData, isLoading: isAllContractsDataLoading } =
    useQueryForDataQuery(
      artistRecordId
        ? {
            from: import.meta.env.VITE_QUICKBASE_CONTRACTS_TABLE_ID,
            select: [
              3, 6, 9, 15, 18, 20, 22, 23, 24, 28, 30, 32, 34, 35, 37, 36,
            ],
            where: `{33.EX.'${artistRecordId}'}`,
            sortBy: [{ fieldId: 11 }, { order: "DESC" }],
          }
        : { skip: true, refetchOnMountOrArgChange: true },
    );
  useEffect(() => {
    if (isAllContractsDataLoading || isRequestedDatesDataLoading) return;
    if (allContractsData?.data) {
      setFutureContracts([]);
      setPastContracts([]);
      console.log(allContractsData.data.length);
      //   Go through each contract, add to future if there is a requestedDate that is in the future, else add to past
      allContractsData.data.forEach((contract) => {
        // requestedDatesData [9] and contract[18]
        const dates = requestedDatesData?.data.filter(
          (rd) => rd[9].value === contract[18].value,
        );
        const latestDate = getLatestDate(contract, requestedDatesData);
        // Once we have the latest date, compare it to today, maintain the same format  yyyy-MM-dd
        const today = format(new Date(), "yyyy-MM-dd");
        if (compareAsc(latestDate, today) === 1) {
          setFutureContracts((prev) => [
            ...prev,
            { ...formatContractsData(contract), requestedDates: dates },
          ]);
        } else {
          setPastContracts((prev) => [
            ...prev,
            { ...formatContractsData(contract), requestedDates: dates },
          ]);
        }
      });
    }
  }, [
    allContractsData,
    isAllContractsDataLoading,
    isRequestedDatesDataLoading,
  ]);

  if (
    isRequestedDatesDataLoading ||
    isRequestsAwaitingApprovalDataLoading ||
    isAllContractsDataLoading
  ) {
    return (
      <div className="flex h-full w-full justify-center pt-24">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {requestsAwaitingApprovalData && (
        <DataGrid
          columns={requestsAwaitingApprovalColumns}
          data={formatRequestsAwaitingApprovalData(
            requestsAwaitingApprovalData,
            requestedDatesData,
          )}
          tableTitle="Requests Awaiting Approval"
          usePagination
          allowExport
        />
      )}
      {futureContracts.length > 0 && (
        <DataGrid
          columns={baseContractColumns}
          data={futureContracts}
          tableTitle="Future Contracts"
          usePagination
          allowExport
        />
      )}
      {pastContracts.length > 0 && (
        <DataGrid
          columns={baseContractColumns}
          data={pastContracts}
          tableTitle="Past Contracts"
          usePagination
          allowExport
        />
      )}
    </div>
  );
}

export default ArtistContractsPage;
