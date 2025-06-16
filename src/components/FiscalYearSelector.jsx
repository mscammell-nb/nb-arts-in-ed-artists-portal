import { OLDEST_FISCAL_YEAR_KEY } from "@/constants/constants";
import { updateFiscalYear } from "@/redux/slices/fiscalYearSlice";
import { getNextFiscalYearKey } from "@/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const FiscalYearSelector = ({ title }) => {
  const FiscalYearState = useSelector((state) => state.fiscalYear);
  const dispatch = useDispatch();

  const getOptions = () => {
    const options = [];
    for (let i = OLDEST_FISCAL_YEAR_KEY; i <= getNextFiscalYearKey(); i++) {
      const baseYear = 2012 + i; // key 1 = 2013, key 2 = 2014, etc.
      const startYear = baseYear.toString().slice(-2);
      const endYear = (baseYear + 1).toString().slice(-2);
      const fiscalYear = `${startYear}/${endYear}`;

      options.push(
        <SelectItem
          key={i}
          value={JSON.stringify({ fiscalYear, fiscalYearKey: i })}
        >
          {fiscalYear}
        </SelectItem>,
      );
    }
    return options;
  };

  const handleChange = (value) => {
    const parsedValue = JSON.parse(value);
    dispatch(
      updateFiscalYear({
        fiscalYear: parsedValue.fiscalYear,
        fiscalYearKey: parsedValue.fiscalYearKey,
      }),
    );
  };

  return (
    <Select
      id="fiscal-year-select"
      value={JSON.stringify({
        fiscalYear: FiscalYearState.fiscalYear,
        fiscalYearKey: FiscalYearState.fiscalYearKey,
      })}
      onValueChange={handleChange}
    >
      <SelectTrigger className="flex w-28 items-center rounded-xl border-4 border-border bg-accent py-5 text-white">
        <SelectValue placeholder="Select fiscal year" />
      </SelectTrigger>
      <SelectContent>{getOptions()}</SelectContent>
    </Select>
  );
};
