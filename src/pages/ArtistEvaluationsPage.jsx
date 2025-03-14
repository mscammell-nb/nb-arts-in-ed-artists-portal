import EvaluationsDataTable from "@/components/EvaluationsDataTable";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/Spinner";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import { getCurrentFiscalYear } from "@/utils/utils";

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

  if (evaluationDataLoading) {
    return (
      <div className="flex w-2/3 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-4/5">
      <p className="font-bold text-4xl">Artist Evaluations</p>
      <Separator className="my-4"/>
      {evaluationData && (
        <EvaluationsDataTable
          data={formatEvaluationsData(
            evaluationData,
            isProgramsDataLoading,
            programsData,
          )}
          usePagination
        />
      )}
    </div>
  );
};

export default ArtistEvaluationsPage;
