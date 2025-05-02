import DataGrid from "@/components/data-grid/data-grid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Spinner from "@/components/ui/Spinner";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import {
  contractColumns,
  contractsThatRequireAnInvoiceColumns,
} from "@/utils/TableColumns";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ArtistInvoicesPage() {
  const artistRecordId = useSelector((state) => state.auth.artistRecordId);
  const [contractsThatRequireAnInvoice, setContractsThatRequireAnInvoice] =
    useState([]);
  const {
    data: contractsData,
    isLoading: isContractsDataLoading,
    isError: isContractsDataError,
    error: contractsDataError,
  } = useQueryForDataQuery(
    artistRecordId
      ? {
          from: import.meta.env.VITE_QUICKBASE_CONTRACTS_TABLE_ID,
          select: [3, 20, 22, 23, 24, 28, 30, 32, 34, 35, 36, 37],
          where: `{33.EX.${artistRecordId}}`,
        }
      : { skip: true, refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (isContractsDataLoading) {
      return;
    } else if (contractsData?.data) {
      setContractsThatRequireAnInvoice(
        getContractsThatRequireAnInvoice(contractsData),
      );
    }
  }, [isContractsDataLoading, contractsData]);

  const getContractsThatRequireAnInvoice = (contractsData) => {
    const { data } = contractsData;
    const contractsThatRequireAnInvoice = [];
    data.forEach((contract) => {
      const dateParts = contract[30].value.split("-");
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1;
      const day = parseInt(dateParts[2]);

      const serviceDate = new Date(year, month, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      serviceDate.setHours(0, 0, 0, 0);

      if (contract[32].value == "" && serviceDate < today) {
        contractsThatRequireAnInvoice.push(contract);
      }
    });
    return contractsThatRequireAnInvoice;
  };

  const formatContractsData = (contractsData) => {
    return contractsData.map((record) => ({
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
    }));
  };
  return (
    <div className="flex w-full flex-col justify-center gap-5">
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Note!</AlertTitle>
        <AlertDescription>
          You can only add an invoice for contracts that are past the date of
          service.
        </AlertDescription>
      </Alert>
      {!isContractsDataLoading && contractsData?.data ? (
        <>
          {contractsThatRequireAnInvoice.length > 0 && (
            <>
              {/* ALERT SAYING THAT THERE ARE CONTRACTS THAT REQUIRE AN INVOICE */}
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Missing Invoices!</AlertTitle>
                <AlertDescription>
                  There are contracts that require an invoice. Please complete
                  the invoice for these contracts.
                </AlertDescription>
              </Alert>
              {/* LIST OF ALL CONTRACTS RELATED TO THE ARTIST THAT REQUIRE AN INVOICE */}
              <DataGrid
                tableTitle={"Contracts that require an invoice"}
                columns={contractsThatRequireAnInvoiceColumns}
                data={formatContractsData(contractsThatRequireAnInvoice)}
                usePagination
                allowExport
                readOnly
              />
            </>
          )}
          <DataGrid
            tableTitle={"All contracts"}
            columns={contractColumns}
            data={formatContractsData(contractsData.data)}
            usePagination
            allowExport
            readOnly
          />
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
