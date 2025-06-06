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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { FormLabel } from "./form";

function CustomSelect({
  data,
  label,
  placeholder,
  value,
  setValue,
  nameOnly = false,
  searchKey = "",
  search = true,
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-w-[300px] space-y-2">
      <FormLabel>{label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
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
                <span className="truncate">
                  {!nameOnly && value["identifier"] + " - "}
                  {value["name"]}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
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
          <Command>
            {search && <CommandInput placeholder={`Search ${searchKey}`} />}
            <CommandList>
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup>
                {data.map((d) => (
                  <CommandItem
                    key={d["id"]}
                    value={d}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : d);
                      setOpen(false);
                    }}
                    className="z-50 flex items-center justify-between hover:bg-background"
                  >
                    <div className="flex items-center gap-2 text-primary">
                      {!nameOnly && d["identifier"] + " - "}
                      {d["name"]}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      #{d["id"]}
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
