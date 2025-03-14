"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Blocks,
  Brain,
  ChevronDown,
  Cpu,
  Database,
  Globe,
  Layout,
  LineChart,
  Network,
  Search,
  Server,
} from "lucide-react";
import { useId, useState } from "react";
import { FormLabel } from "./form";

function CustomSelect({ data, label, placeholder, value, setValue }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-w-[300px] space-y-2">
      <FormLabel>{label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            id={id}
            variant="outline"
            role="combobox"
            className="w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20"
          >
            {value ? (
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate">{value[15].value}{" - "}{value["name"]}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">
                {placeholder}
              </span>
            )}
            <ChevronDown
              size={16}
              strokeWidth={2}
              className="shrink-0 text-muted-foreground/80"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
        >
          <Command className="z-50">
            <CommandInput placeholder="Search contracts..." />
            <CommandList className="z-50">
              <CommandEmpty>No service found.</CommandEmpty>
              <CommandGroup className="z-50">
                {data.map((d) => (
                  <CommandItem
                    key={d[3].value}
                    value={d}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : d);
                      setOpen(false);
                    }}
                    className="z-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">{d[15].value}{" - "}{d["name"]}</div>
                    <span className="text-xs text-muted-foreground">
                      #{d[3].value}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default CustomSelect;
