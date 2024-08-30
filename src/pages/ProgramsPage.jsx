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

const BUTTON_LINKS = [
  { label: "New Program", url: "/create-program", isTargetBlank: false },
  { label: "View-Pay Invoice", url: "/program-invoice", isTargetBlank: false },
  { label: "View Conctracts", url: "/program-contracts", isTargetBlank: false },
  { label: "Step-by-Step Help", url: "#", isTargetBlank: true },
];

const ProgramsPage = () => {
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

  return (
    <>
      <div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="2024-25" />
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
    </>
  );
};

export default ProgramsPage;
