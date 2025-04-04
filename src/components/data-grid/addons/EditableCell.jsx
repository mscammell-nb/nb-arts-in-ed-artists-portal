import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * Handles changes to editable cell values
 * 
 */
const handleCellChange = (columnId, value, setValue, recordId, form, setForm) => {
  const copy = form;
  copy[recordId] = { ...copy[recordId], [columnId]: value, recordId };
  setForm(copy);
  setValue(value);
};

/**
 * Creates editable column configurations based on the provided columns and editing state
 * 
 */
const editableColumns = (columns, setEditing, editing, editableFields, form, setForm) => {
  // Use memoization to prevent unnecessary re-renders
  return useMemo(() => columns.map((column) => {
    if (editing && column.id && column.id === "edit")
      return { ...column, cell: () => null };
    return editing && editableFields.has(column.accessorKey)
      ? {
          ...column,
          cell: ({ row, column, getValue }) => {
            const originalValue =
              editableFields.get(column.id).type === "boolean"
                ? getValue() === "Yes"
                  ? true
                  : false
                : getValue();
            const [inputValue, setInputValue] = useState(originalValue);

            // Handle boolean type fields
            if (
              editableFields.get(column.id).type === "boolean" ||
              editableFields.get(column.id).type === "yes/no"
            ) {
              // Create a memoized callback for the value change handler
              const handleValueChange = useCallback((e) => {
                handleCellChange(
                  column.id,
                  e,
                  setInputValue,
                  row.original.id,
                  form,
                  setForm
                );
              }, [column.id, row.original.id, form, setForm]);
              
              return (
                <Select
                  value={inputValue}
                  onValueChange={handleValueChange}
                  className="w-full rounded border border-gray-200 p-1"
                  // Add accessibility attributes
                  aria-label={`Edit ${column.id}`}
                >
                  <SelectTrigger
                    className={cn(
                      inputValue === originalValue ? "bg-white" : "bg-yellow-200"
                    )}
                    aria-label={`Current value: ${inputValue}`}
                  >
                    <SelectValue placeholder="Select a value" />
                  </SelectTrigger>
                  <SelectContent>
                    {editableFields
                      .get(column.id)
                      .options.map((option, idx) => (
                        <React.Fragment key={idx}>{option}</React.Fragment>
                      ))}
                  </SelectContent>
                </Select>
              );
            }

            // Handle other editable field types
            // Create a memoized callback for the change handler
            const handleInputChange = useCallback((e) => {
              handleCellChange(
                column.id,
                e.target.value,
                setInputValue,
                row.original.id,
                form,
                setForm
              );
            }, [column.id, row.original.id, form, setForm]);
            
            return (
              <Input
                placeholder="Enter value..."
                value={inputValue}
                onChange={handleInputChange}
                className={cn(
                  "w-full rounded border border-gray-200 p-1 text-gray-600 placeholder:text-gray-400",
                  inputValue === originalValue ? "bg-white" : "bg-yellow-200"
                )}
                // Add accessibility attributes
                aria-label={`Edit ${column.id}`}
                aria-invalid={inputValue !== originalValue}
              />
            );
          },
        }
      : column;
  }), [columns, editing, editableFields, form, setForm]);
};

export default editableColumns;
