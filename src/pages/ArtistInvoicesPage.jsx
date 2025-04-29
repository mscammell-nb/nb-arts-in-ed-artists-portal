import DataGrid from "@/components/data-grid/data-grid";
import Spinner from "@/components/ui/Spinner";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import { contractColumns } from "@/utils/TableColumns";
import { format } from "prettier";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ArtistInvoicesPage() {
  // TODO: Display an alert that informs the user of contracts that require an invoice
  // TODO: Display a list of all contracts related to the artist
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
          select: [1, 3, 8, 11, 12, 16, 20, 22, 24, 25, 26, 27, 29, 30, 32, 33],
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
      if (contract[32].value == "") {
        contractsThatRequireAnInvoice.push(contract);
      }
    });
    return contractsThatRequireAnInvoice;
  };
  const formatContractsData = (contractsData) => {
    // TODO: ADD MORE FIELDS
    return contractsData.map((record) => ({
      id: record[3].value,
      coser: 403,
      requestedBy: "Someone"
    }));
  };
  return (
    <div className="flex w-full flex-col justify-center gap-5">
      {(!isContractsDataLoading && contractsData?.data) ? (
        <>
          {contractsThatRequireAnInvoice.length > 0 && (
            <>
              {/* ALERT SAYING THAT THERE ARE CONTRACTS THAT REQUIRE AN INVOICE */}
              <div className="rounded-md border border-red-400 bg-red-50 p-4 text-sm font-semibold text-red-700">
                There are contracts that require an invoice. Please complete the
                invoice for these contracts.
              </div>
              {/* LIST OF ALL CONTRACTS RELATED TO THE ARTIST THAT REQUIRE AN INVOICE */}
              <DataGrid
                tableTitle={"Contracts that require an invoice"}
                columns={contractColumns}
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
