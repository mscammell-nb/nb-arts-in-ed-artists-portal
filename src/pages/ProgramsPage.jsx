import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import { getCurrentFiscalYear } from "@/utils/utils";
import Spinner from "@/components/ui/Spinner";
import { programTableColumns } from "@/utils/TableColumns";
import DataGrid from "@/components/ui/data-grid";
import { PROGRAMS_EDITABLE_FIELDS } from "@/utils/constants";

const BUTTON_LINKS = [
  { label: "New Program", url: "/new-program", isTargetBlank: false },
  { label: "View-Pay Invoice", url: "/program-invoice", isTargetBlank: false },
  { label: "View Contracts", url: "/program-contracts", isTargetBlank: false },
  { label: "Step-by-Step Help", url: "#", isTargetBlank: true },
];
const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${month}/${day}/${year}`;
};

const formatProgramsData = (programsData) => {
  const { data } = programsData;

  return data.map((record) => ({
    id: record[3].value,
    fiscalYear: record[16].value,
    dateCreated: formatDate(new Date(record[1].value)),
    program: record[11].value,
    paid: record[31].value ? "Yes" : "No",
    status: record[32].value,
    programGroupLegend: record[33].value,
  }));
};

const ProgramsPage = () => {
  const fiscalYear = getCurrentFiscalYear();
  const {
    data: programsData,
    isLoading: isProgramsDataLoading,
    isError: isProgramsDataError,
    error: programsDataError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_PROGRAMS_TABLE_ID,
    select: [1, 3, 8, 11, 16, 31, 32, 33],
    where: `{8.EX.${localStorage.getItem("artistRecordId")}}`,
  });
  const [
    updateRecord,
    { isLoading: isUpdateLoading, isError: isUpdateError, error: updateError },
  ] = useAddOrUpdateRecordMutation();

  if (isProgramsDataLoading) {
    return (
      <div className="flex h-full w-full justify-center pt-24">
        <Spinner />
      </div>
    );
  }

  if (isProgramsDataError) {
    console.error(programsDataError);
    return (
      <>
        <p>There was an error while fetching the programs data.</p>
        <p>
          Status: {programsDataError.status} - {programsDataError.data.message}
        </p>
      </>
    );
  }

  const updateFunction = (records) => {
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
      })
    })
    console.log(groupByIdAndField(acceptedChanges));
  };
  const groupByIdAndField = (arr) => {
    const res = [];
    const grouped = {};
    arr.forEach((item) => {
      if (!grouped[item.id]) {
        grouped[item.id] = {};
      }
      grouped[item.id][item.field] = {value: item.value};
    });

    for (const id in grouped){
      const group = grouped[id];
      const formattedGroup = {"3": {value: id}};

      for (const field in group){
        formattedGroup[field] = group[field];
      }
      res.push(formattedGroup);
    }
    return res;
  }

  return (
    <div className="flex w-full flex-col justify-center gap-5 pb-10">
      <DataGrid
        columns={programTableColumns}
        data={formatProgramsData(programsData)}
        tableTitle={"Programs"}
        usePagination
        allowExport
        customButtons={BUTTON_LINKS.map(
          (link, index) =>
            (link.label !== "New Program" ||
              fiscalYear === getCurrentFiscalYear()) && (
              <Link
                key={index}
                to={link.url}
                target={link.isTargetBlank ? "_blank" : null}
                className={buttonVariants({ variant: "lighter" })}
              >
                {link.label}
              </Link>
            ),
        )}
        updateFunction={updateFunction}
        editableFields = {PROGRAMS_EDITABLE_FIELDS}
      />
    </div>
  );
};

export default ProgramsPage;
