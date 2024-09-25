import { useEffect, useState } from "react";
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
import {
  useQueryForDataQuery,
  useLazyQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import Table from "@/components/Table";
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

const TABLE_HEADINGS = ["Program Group Legend"];
const TABLE_ROWS = [
  [
    "1. Requires Printed Employees",
    "4. Pending BOCES Administrator / Board Approval",
  ],
  ["2. Insurance Required", "5. Accepted"],
  ["3. Unpaid", "6. Not Accepted"],
];

const formatFiscalYear = (fiscalYear) => `20${fiscalYear}`;

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
    dateCreated: formatDate(new Date(record[1].value)),
    program: record[11].value,
    paid: record[31].value,
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
  const [
    trigger,
    {
      data: programsData,
      isLoading: isProgramsDataLoading,
      isSuccess: isProgramsDataSuccess,
      isError: isProgramsDataError,
      error: programsDataError,
    },
  ] = useLazyQueryForDataQuery();

  useEffect(() => {
    trigger({
      from: import.meta.env.VITE_QUICKBASE_PROGRAMS_TABLE_ID,
      select: [3, 8, 14, 16, 1, 11, 31, 32, 33],
      where: `{8.EX.${localStorage.getItem("artistRecordId")}}AND{16.EX.${fiscalYear.slice(2)}}`,
    });
  }, [fiscalYear, trigger]);

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

  // TODO: delete this later
  if (isProgramsDataSuccess) {
    console.log(programsData);
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
                    <SelectItem
                      key={item[3].value}
                      value={formatFiscalYear(item[6].value)}
                    >
                      {formatFiscalYear(item[6].value)}
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
          {BUTTON_LINKS.map((link, index) => (
            <Link
              key={index}
              to={link.url}
              target={link.isTargetBlank ? "_blank" : null}
              className={buttonVariants({ variant: "bocesSecondary" })}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Table headings={TABLE_HEADINGS} rows={TABLE_ROWS} />

        <DataTable
          columns={programTableColumns}
          data={formatProgramsData(programsData)}
        />
      </div>
    </div>
  );
};

export default ProgramsPage;
