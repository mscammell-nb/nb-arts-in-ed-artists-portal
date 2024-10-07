import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import DataTable from "@/components/DataTable";
import { programTableColumns } from "@/utils/ProgramTableColumns";
import { Label } from "@/components/ui/label";
import { getCurrentFiscalYear } from "@/utils/utils";
import Spinner from "@/components/ui/Spinner";

const BUTTON_LINKS = [
  { label: "New Program", url: "/create-program", isTargetBlank: false },
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
    dateCreated: formatDate(new Date(record[1].value)),
    program: record[11].value,
    paid: record[31].value ? "Yes" : "No",
    status: record[32].value,
    programGroupLegend: record[33].value,
  }));
};

const ProgramsPage = () => {
  const [fiscalYear, setFiscalYear] = useState(getCurrentFiscalYear());

  const {
    data: fiscalYearsData,
    isLoading: isFiscalYearsDataLoading,
    isError: isFiscalYearsDataError,
    error: fiscalYearsDataError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_FISCAL_YEARS_TABLE_ID,
    select: [3, 6],
  });
  const {
    data: programsData,
    isLoading: isProgramsDataLoading,
    isError: isProgramsDataError,
    error: programsDataError,
  } = useQueryForDataQuery(
    {
      from: import.meta.env.VITE_QUICKBASE_PROGRAMS_TABLE_ID,
      select: [1, 3, 8, 11, 16, 31, 32, 33],
      where: `{8.EX.${localStorage.getItem("artistRecordId")}}AND{16.EX.${fiscalYear}}`,
    },
    { skip: !fiscalYear },
  );

  if (isFiscalYearsDataLoading || isProgramsDataLoading) return <Spinner />;

  if (isFiscalYearsDataError) {
    console.error(fiscalYearsDataError);
    return (
      <>
        <p>There was an error while fetching the fiscal years data.</p>
        <p>
          Status: {fiscalYearsDataError.status} -{" "}
          {fiscalYearsDataError.data.message}
        </p>
      </>
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

  return (
    <div className="flex justify-center pb-10">
      <div className="w-2/3 md:w-[920px]">
        <div>
          <Label htmlFor="fiscalYearDropdown" className="text-lg font-semibold">
            Fiscal Year
          </Label>
          <Select
            id="fiscalYearDropdown"
            onValueChange={setFiscalYear}
            value={fiscalYear}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={getCurrentFiscalYear()} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fiscal years</SelectLabel>
                {fiscalYearsData &&
                  fiscalYearsData.data.map((item) => (
                    <SelectItem key={item[3].value} value={item[6].value}>
                      {item[6].value}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="mt-1">
            Listed below are all programs for the school year of {fiscalYear}
          </p>
        </div>

        <div className="mt-4 flex gap-4">
          {BUTTON_LINKS.map(
            (link, index) =>
              (link.label !== "New Program" ||
                fiscalYear === getCurrentFiscalYear()) && (
                <Link
                  key={index}
                  to={link.url}
                  target={link.isTargetBlank ? "_blank" : null}
                  className={buttonVariants({ variant: "" })}
                >
                  {link.label}
                </Link>
              ),
          )}
        </div>

        <DataTable
          columns={programTableColumns}
          data={formatProgramsData(programsData)}
          usePagination
        />
      </div>
    </div>
  );
};

export default ProgramsPage;
