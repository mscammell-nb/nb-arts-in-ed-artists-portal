import DataGrid from "@/components/ui/data-grid";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Spinner from "@/components/ui/Spinner";
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import { getCurrentFiscalYear, groupByIdAndField } from "@/utils/utils";
import EvaluationPage from "./EvaluationPage";
import { evalTableColumns } from "@/utils/TableColumns";
import { EVALUATIONS_EDITABLE_FIELDS } from "@/constants/constants";

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
        (d) => d[3].value === record[7].value,
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
      <SheetContent className="sm:max-w-1/3 w-1/3 overflow-y-scroll">
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
  const {
    data: evaluationData,
    isLoading: evaluationDataLoading,
    isError: evaluationDataError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_EVALUATIONS_TABLE_ID,
    select: [2, 3, 6, 7, 8, 9, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    where: `{8.EX.${localStorage.getItem("artistRecordId")}}`,
  });

  const {
    data: programsData,
    isLoading: isProgramsDataLoading,
    isError: isProgramsDataError,
    error: programsDataError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_PROGRAMS_TABLE_ID,
    select: [1, 3, 8, 11, 16, 31, 32, 33],
    where: `{8.EX.${localStorage.getItem("artistRecordId")}}AND{16.EX.${getCurrentFiscalYear()}}`,
  });
  const { data: contractData, isLoading: isContractsLoading } =
    useQueryForDataQuery({
      from: import.meta.env.VITE_QUICKBASE_CONTRACTS_TABLE_ID,
      select: [1, 3, 8, 10, 12, 13, 15, 16],
      where: `{9.EX.${localStorage.getItem("artistRecordId")}}AND{15.EX.${getCurrentFiscalYear()}}`,
    });

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

  if (evaluationDataLoading || isEditArtistEvaluationLoading) {
    return (
      <div className="flex h-full w-full justify-center pt-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-4xl font-bold">Artist Evaluations</p>
      <Separator className="my-4" />
      {evaluationData && (
        <DataGrid
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
            contractData,
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
