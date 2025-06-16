import DataGrid from "@/components/data-grid/data-grid";
import { FiscalYearSelector } from "@/components/fiscalYearSelector";
import NewProgramForm from "@/components/NewProgramForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Spinner from "@/components/ui/Spinner";
import {
  PROGRAMS_EDITABLE_FIELDS,
  SERVICE_TYPE_DEFINITIONS,
} from "@/constants/constants";
import { cn } from "@/lib/utils";
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import { programTableColumns } from "@/utils/TableColumns";
import {
  getCurrentFiscalYear,
  getNextFiscalYear,
  groupByIdAndField,
  isDuringCutoff,
} from "@/utils/utils";
import { AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AddProgramSheet = ({ open, onOpenChange, sheetProps }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Add New Program</DialogTitle>
          <DialogDescription>
            Please fill out the form to add a new program
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] lg:h-[600px]">
          <NewProgramForm onSubmitSuccess={() => onOpenChange(false)} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const BUTTON_LINKS = [
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
    description: record[12].value,
    keywords: record[20].value,
    category: record[22].value,
    length: record[26].value,
    grades: record[27].value,
    serviceType: record[24].value,
    cost: record[25].value,
    costDetails: record[29].value,
    performers: record[30].value,
    status: record[32].value,
    programGroupLegend: record[33].value,
    editableFields:
      record[32].value === "Accepted"
        ? ["program", "cost", "description"]
        : null,
  }));
};

const ProgramsPage = () => {
  const { artistRecordId, has3References } = useSelector(
    (state) => state.artist,
  );
  const programCutoffStartDate = useSelector(
    (state) => state.cutoff.programCutoffStartDate,
  );

  const programCutoffEndDate = useSelector(
    (state) => state.cutoff.programCutoffEndDate,
  );

  const selectedFiscalYear = useSelector(
    (state) => state.fiscalYear.fiscalYear,
  );

  const fiscalYear = getCurrentFiscalYear();
  const nextFiscalYear = getNextFiscalYear();
  const tempCutoffStartDate = new Date(programCutoffStartDate);
  const startMonth = tempCutoffStartDate.getMonth();
  const startDay = tempCutoffStartDate.getDate();
  const tempCutoffEndDate = new Date(programCutoffEndDate);
  const endMonth = tempCutoffEndDate.getMonth();
  const endDay = tempCutoffEndDate.getDate();
  const duringCutoff = isDuringCutoff(startMonth, startDay, endMonth, endDay);

  const {
    data: programsData,
    isLoading: isProgramsDataLoading,
    isError: isProgramsDataError,
    error: programsDataError,
  } = useQueryForDataQuery(
    artistRecordId
      ? {
          from: import.meta.env.VITE_QUICKBASE_PROGRAMS_TABLE_ID,
          select: [1, 3, 8, 11, 12, 16, 20, 22, 24, 25, 26, 27, 29, 30, 32, 33],
          where: `{8.EX.'${artistRecordId}'}`,
          sortBy: [{ fieldId: 11 }, { order: "DESC" }],
        }
      : { skip: true, refetchOnMountOrArgChange: true },
  );
  const [
    updateRecord,
    { isLoading: isUpdateLoading, isError: isUpdateError, error: updateError },
  ] = useAddOrUpdateRecordMutation();

  if (isProgramsDataLoading || isUpdateLoading) {
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
    const editableFields = PROGRAMS_EDITABLE_FIELDS;
    const acceptedChanges = [];
    Object.keys(records).forEach((recordKey) => {
      const id = recordKey;
      Object.keys(records[recordKey]).forEach((key) => {
        if (editableFields.has(key)) {
          let value = records[id][key];
          if (key === "serviceType") {
            value = SERVICE_TYPE_DEFINITIONS.find(
              (service) => service.title === records[id][key],
            ).id;
          }
          acceptedChanges.push({
            id,
            field: editableFields.get(key).field,
            value,
          });
        }
      });
    });
    const updatedFields = groupByIdAndField(acceptedChanges);
    updateRecord({
      to: import.meta.env.VITE_QUICKBASE_PROGRAMS_TABLE_ID,
      data: updatedFields,
    });
  };

  // Filter data based on selected fiscal year
  const filteredProgramsData = programsData
    ? {
        data: programsData.data.filter((record) => {
          return record[16].value === selectedFiscalYear;
        }),
      }
    : { data: [] };

  return (
    <div className="w-full">
      {!has3References && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not enough references!</AlertTitle>
          <AlertDescription>
            You are required to have at least 3 references to submit a new
            program.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex w-full flex-col justify-center gap-5 pb-10">
        <DataGrid
          columns={programTableColumns}
          data={formatProgramsData(filteredProgramsData)}
          tableTitle={<FiscalYearSelector />}
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
                  className={cn(
                    buttonVariants({ variant: "lighter" }),
                    "border dark:border-white",
                  )}
                >
                  {link.label}
                </Link>
              ),
          )}
          updateFunction={updateFunction}
          editableFields={PROGRAMS_EDITABLE_FIELDS}
          rowSpecificEditing
          {...(has3References &&
            selectedFiscalYear === nextFiscalYear && {
              CustomAddComponent: AddProgramSheet,
              sheetProps: { title: "Add New Program" },
              addButtonText: "Add New Program",
            })}
        />
      </div>
    </div>
  );
};

export default ProgramsPage;
