import EvaluationsDataTable from "@/components/EvaluationsDataTable";
import Spinner from "@/components/ui/Spinner";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";

const formatProgramsData = (programsData) => {
  console.log("hello", programsData);
  const { data } = programsData;

  return data.map((record) => ({
    id: record[3].value,
    dateCreated: formatDate(new Date(record[1].value)),
    program: record[8].value,
    inactive: record[16].value,
  }));
};
const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${month}/${day}/${year}`;
};

const ArtistEvaluationsPage = () => {
  const {
    data: contractData,
    isLoading: contractDataLoading,
    isError: contractDataError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_CONTRACTS_TABLE_ID,
    select: [1, 3, 8, 10, 12, 13, 15, 16],
    where: `{9.EX.${localStorage.getItem("artistRecordId")}}`,
  });
  if (contractDataLoading) {
    return (
      <div className="flex w-2/3 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-2/3 md:w-[920px]">
      <EvaluationsDataTable
        data={formatProgramsData(contractData)}
        usePagination
      />
    </div>
  );
};

export default ArtistEvaluationsPage;
