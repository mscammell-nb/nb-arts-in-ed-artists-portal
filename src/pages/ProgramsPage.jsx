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
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import Table from "@/components/Table";

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

const ProgramsPage = () => {
  const [fiscalYear, setFiscalYear] = useState();

  const {
    data: fiscalYearsData,
    isError: isFiscalYearsDataError,
    error: fiscalYearsDataError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_FISCAL_YEARS_TABLE_ID,
    select: [3, 6],
  });

  if (isFiscalYearsDataError) {
    console.error(fiscalYearsDataError);
    return (
      <>
        <p>There was an error getting the fiscal years data.</p>
        <p>
          Status: {fiscalYearsDataError.status} -{" "}
          {fiscalYearsDataError.data.message}
        </p>
      </>
    );
  }

  const getCurrentFiscalYear = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const nextYearLastTwoDigits = nextYear.toString().substring(2, 4);

    return currentYear + "/" + nextYearLastTwoDigits;
  };

  return (
    <>
      <div>
        <Select onValueChange={setFiscalYear} value={fiscalYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={getCurrentFiscalYear()} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fiscal years</SelectLabel>
              {fiscalYearsData &&
                fiscalYearsData.data.map((item) => (
                  <SelectItem key={item[3].value} value={"20" + item[6].value}>
                    20{item[6].value}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
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
    </>
  );
};

export default ProgramsPage;
