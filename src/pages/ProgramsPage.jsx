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

const BUTTON_LINKS = [
  { label: "New Program", url: "/create-program", isTargetBlank: false },
  { label: "View-Pay Invoice", url: "/program-invoice", isTargetBlank: false },
  { label: "View Conctracts", url: "/program-contracts", isTargetBlank: false },
  { label: "Step-by-Step Help", url: "#", isTargetBlank: true },
];

const ProgramsPage = () => {
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
              <SelectItem value="apple">2023-24</SelectItem>
              <SelectItem value="banana">2024-25</SelectItem>
              <SelectItem value="blueberry">2025-26</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        {BUTTON_LINKS.map((link, index) => (
          <Link
            key={index}
            to={link.url}
            target={link.isTargetBlank ? "_blank" : ""}
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
