import DataGrid from "@/components/data-grid/data-grid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Spinner from "@/components/ui/Spinner";
import { EVALUATIONS_EDITABLE_FIELDS } from "@/constants/constants";
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import { contractColumns, evalTableColumns } from "@/utils/TableColumns";
import { getCurrentFiscalYear, groupByIdAndField } from "@/utils/utils";
import { AlertCircle } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import EvaluationPage from "./EvaluationPage";

const formatEvaluationsData = (
  evaluationsData,
  isProgramsDataLoading,
  programData,
) => {
  const { data } = evaluationsData;

  return data.map((record) => {
    let programName = "-";
    if (!isProgramsDataLoading && programData) {
      let filtered = programData.data.filter(
        (d) => d[3].value === record[25].value,
      );
      if (filtered.length > 0) programName = filtered[0][11].value;
    }
    return {
      id: record[3].value,
      programName: programName,
      evaluationDate: formatDate(record[2].value),
      servicePerformed: record[13].value ? "Yes" : "No",
      approverName: record[14].value,
      guideUsed: record[15].value ? "Yes" : "No",
      studentsAttentive: record[16].value ? "Yes" : "No",
      studentConduct: record[17].value ? "Yes" : "No",
      teacherRemained: record[18].value ? "Yes" : "No",
      spaceSetUp: record[19].value ? "Yes" : "No",
      equipmentUsed: record[20].value ? "Yes" : "No",
      onSchedule: record[21].value ? "Yes" : "No",
      additionalComments: record[22].value,
    };
  });
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

const formatDate = (timestamp) => {
  if (!timestamp) return "-";
  const date = new Date(timestamp);

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${month}/${day}/${year}`;
};

const AddSheet = ({ open, onOpenChange, sheetProps }) => {
  const closeSheet = () => onOpenChange(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange} className="z-20">
      <SheetContent className="w-full overflow-y-auto sm:w-1/3">
        <SheetHeader>
          <SheetTitle className="text-3xl">{sheetProps.title}</SheetTitle>
          <SheetDescription className="hidden">
            {"Add a new Evaluation"}
          </SheetDescription>
        </SheetHeader>
        {!sheetProps.isContractsLoading &&
          !sheetProps.isProgramsDataLoading && (
            <EvaluationPage
              contractData={sheetProps.contractData.data}
              programData={sheetProps.programsData.data}
              closeSheet={closeSheet}
            />
          )}
      </SheetContent>
    </Sheet>
  );
};

const ArtistEvaluationsPage = () => {
  const [contractsMissingEvaluations, setContractsMissingEvaluations] =
    React.useState([]);
  const artistRecordId = useSelector((state) => state.artist?.artistRecordId);
  const {
    data: evaluationData,
    isLoading: evaluationDataLoading,
    isError: evaluationDataError,
  } = useQueryForDataQuery(
    artistRecordId
      ? {
          from: import.meta.env.VITE_QUICKBASE_EVALUATIONS_TABLE_ID,
          select: [
            2, 3, 6, 7, 8, 9, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 25,
          ],
          where: `{24.EX.'${artistRecordId}'}`,
        }
      : { skip: true, refetchOnMountOrArgChange: true },
  );

  const {
    data: programsData,
    isLoading: isProgramsDataLoading,
    isError: isProgramsDataError,
    error: programsDataError,
  } = useQueryForDataQuery(
    artistRecordId
      ? {
          from: import.meta.env.VITE_QUICKBASE_PROGRAMS_TABLE_ID,
          select: [1, 3, 8, 11, 16, 31, 32, 33],
          where: `{8.EX.'${artistRecordId}'}AND{16.EX.'${getCurrentFiscalYear()}'}`,
        }
      : { skip: true, refetchOnMountOrArgChange: true },
  );
  const { data: contractData, isLoading: isContractsLoading } =
    useQueryForDataQuery(
      artistRecordId
        ? {
            from: import.meta.env.VITE_QUICKBASE_CONTRACTS_TABLE_ID,
            // select: [1, 3, 8, 10, 12, 13, 15, 16, 24, 46, 30],
            select: [3, 20, 22, 23, 24, 28, 30, 32, 34, 35, 36, 37, 46, 49],

            where: `{33.EX.'${artistRecordId}'}AND{24.EX.'${getCurrentFiscalYear()}'}`,
          }
        : { skip: true, refetchOnMountOrArgChange: true },
    );

  const [
    updateRecord,
    {
      data: editArtistEvaluation,
      isLoading: isEditArtistEvaluationLoading,
      isSuccess: isEditArtistEvaluationSuccess,
      isError: isEditArtistEvaluationError,
      error: editArtistEvaluationError,
    },
  ] = useAddOrUpdateRecordMutation();

  const updateFunction = (records) => {
    const editableFields = EVALUATIONS_EDITABLE_FIELDS;
    const acceptedChanges = [];
    Object.keys(records).forEach((recordKey) => {
      const id = recordKey;
      Object.keys(records[recordKey]).forEach((key) => {
        if (editableFields.has(key)) {
          acceptedChanges.push({
            id,
            field: editableFields.get(key).field,
            value: records[id][key],
          });
        }
      });
    });
    const updatedFields = groupByIdAndField(acceptedChanges);
    updateRecord({
      to: import.meta.env.VITE_QUICKBASE_EVALUATIONS_TABLE_ID,
      data: updatedFields,
    });
  };

  React.useEffect(() => {
    if (
      !isContractsLoading &&
      contractData?.data &&
      !evaluationDataLoading &&
      evaluationData?.data
    ) {
      const contractsMissingEvaluations = contractData.data.filter(
        (contract) => {
          const dateParts = contract[30].value.split("-");
          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1;
          const day = parseInt(dateParts[2]);
          const serviceDate = new Date(year, month, day);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          serviceDate.setHours(0, 0, 0, 0);

          // Only continue if service date is in the past or evaluation is completed
          if (serviceDate >= today || contract[49].value) {
            return false;
          }
          return true;
        },
      );
      setContractsMissingEvaluations(contractsMissingEvaluations);
    }
  }, [contractData, isContractsLoading, evaluationDataLoading, evaluationData]);

  if (
    evaluationDataLoading ||
    isEditArtistEvaluationLoading ||
    isContractsLoading
  ) {
    return (
      <div className="flex h-full w-full justify-center pt-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {contractsMissingEvaluations.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing Evaluations!</AlertTitle>
          <AlertDescription>
            There are contracts that require an Evaluation. Please complete the
            Evaluation for these contracts.
            <span className="font-bold">
              No payment will be made until the evaluation is completed.
            </span>
          </AlertDescription>
        </Alert>
      )}
      {evaluationData && (
        <DataGrid
          tableTitle={"Contracts that require an Evaluation"}
          data={formatContractsData(contractsMissingEvaluations)}
          columns={contractColumns}
          CustomAddComponent={AddSheet}
          addButtonText="Add Evaluation"
          sheetProps={{
            title: "Add Evaluation",
            programsData,
            isProgramsDataLoading,
            contractData: { data: contractsMissingEvaluations },
            isContractsLoading,
            loading: isProgramsDataLoading || isContractsLoading,
          }}
          usePagination
          allowExport
          readOnly
        />
      )}
      {evaluationData && (
        <DataGrid
          tableTitle={"Artist Evaluations"}
          data={formatEvaluationsData(
            evaluationData,
            isProgramsDataLoading,
            programsData,
          )}
          columns={evalTableColumns}
          CustomAddComponent={AddSheet}
          addButtonText="Add Evaluation"
          sheetProps={{
            title: "Add Evaluation",
            programsData,
            isProgramsDataLoading,
            contractData: { data: contractsMissingEvaluations },
            isContractsLoading,
            loading: isProgramsDataLoading || isContractsLoading,
          }}
          usePagination
          allowExport
          updateFunction={updateFunction}
          editableFields={EVALUATIONS_EDITABLE_FIELDS}
        />
      )}
    </div>
  );
};

export default ArtistEvaluationsPage;
