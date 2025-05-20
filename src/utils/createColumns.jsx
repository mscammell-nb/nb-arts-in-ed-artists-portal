import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Check,
  CheckCircle,
  ClipboardCheck,
  Clock,
  Fingerprint,
  X,
  XCircle,
} from "lucide-react";
import { formatCurrency } from "./utils";

export const StatusBadge = ({ status }) => {
  return (
    <div
      className={`inline-flex items-center rounded-full px-2 py-1 ${status.color}`}
    >
      {status.icon}
      <span className="text-nowrap text-xs font-medium">{status.label}</span>
    </div>
  );
};

export const createColumns = (standardCols = [], ...customCols) => {
  // Check if ID is in standard columns
  const hasIdInStandard = standardCols.includes("id");

  // Check if there's a custom ID column definition
  const customIdColumn = customCols.find((col) => col.accessorKey === "id");

  // Filter out 'id' from standard columns (we'll handle it separately)
  const filteredStandardCols = standardCols.filter((key) => key !== "id");

  // Process standard columns (excluding id)
  const standardColDefs = filteredStandardCols.map((key) => {
    // Check if this column is overridden by a custom definition
    const customOverride = customCols.find((col) => col.accessorKey === key);
    if (customOverride) return customOverride;

    // Auto-detect column type based on key name
    if (key.endsWith("Id")) {
      return {
        accessorKey: key,
        header: formatHeader(key),
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue(key)}</span>
        ),
      };
    }

    // Default column definition
    return {
      accessorKey: key,
      header: formatHeader(key),
    };
  });

  console.log(standardColDefs);

  // Create ID column if needed
  let idColumn = null;
  if (hasIdInStandard || customIdColumn) {
    // Use custom ID column if provided, otherwise create default
    idColumn = customIdColumn || {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("id")}</span>
      ),
    };
  }

  // Add any custom columns that aren't already handled
  const additionalCols = customCols.filter(
    (col) =>
      col.accessorKey !== "id" &&
      !filteredStandardCols.includes(col.accessorKey),
  );

  // Combine columns, with ID first if included
  return [
    ...(idColumn ? [idColumn] : []),
    ...standardColDefs,
    ...additionalCols,
  ];
};

export const linkColumn = (key, href, options = {}) => ({
  accessorKey: key,
  header: options.header || formatHeader(key),
  cell: ({ row }) => {
    const value = row.getValue(key);

    // Generate the href - either from a template string or a function
    let linkHref;
    if (typeof href === "function") {
      linkHref = href(row.original);
    } else {
      linkHref = href.replace("{value}", value);
    }

    return (
      <a
        href={linkHref}
        className={cn(
          "font-medium text-blue-600 hover:text-blue-800 hover:underline",
          options.className,
        )}
        onClick={(e) => {
          if (options.onClick) {
            e.preventDefault();
            options.onClick(row.original, e);
          }
        }}
      >
        {options.label || value}
        {options.icon && <span className="ml-1">{options.icon}</span>}
      </a>
    );
  },
});
/**
 * Formats a camelCase accessor key into a display-friendly header
 */
const formatHeader = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/\b(Id)\b/gi, "ID")
    .trim();
};

/**
 * Helper to create a dual display column (primary/secondary value)
 */
export const dualColumn = (key, primaryField, secondaryField, headerText) => ({
  accessorKey: key,
  header: headerText || formatHeader(key),
  cell: ({ row }) => (
    <div>
      <div>{row.original[primaryField]}</div>
      <div className="text-sm text-gray-500">
        {row.original[secondaryField]}
      </div>
    </div>
  ),
});

/**
 * Helper to create a status column with badge
 */
export const statusColumn = (key, options = {}) => ({
  accessorKey: key,
  header: options.header || formatHeader(key),
  accessorFn: (row) => row[key].status,
  cell: ({ row }) => {
    const statusConfig = {
      "not-reviewed": {
        label: "Not Yet Reviewed",
        color: "bg-gray-100 text-gray-800",
        icon: <Clock className="mr-1 h-3 w-3" />,
      },
      approved: {
        label: "Approved",
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="mr-1 h-3 w-3" />,
      },
      denied: {
        label: "Denied",
        color: "bg-red-100 text-red-800",
        icon: <XCircle className="mr-1 h-3 w-3" />,
      },
      cancelled: {
        label: "Cancelled",
        color: "bg-amber-100 text-amber-800",
        icon: <AlertCircle className="mr-1 h-3 w-3" />,
      },
    };

    return (
      <div className="flex flex-col items-start">
        {row.original[key].date && (
          <div className="mb-1 text-xs text-gray-500">
            {row.original[key].date}
          </div>
        )}
        <StatusBadge
          status={
            statusConfig[row.original[key].status.toLowerCase()] ||
            statusConfig["not-reviewed"]
          }
        />
      </div>
    );
  },
  meta: options.meta,
});

/**
 * Helper to create a Board approval status column with badge
 */
export const boardApprovalColumn = (key, options = {}) => ({
  accessorKey: key,
  header: options.header || formatHeader(key),
  accessorFn: (row) => row[key],
  cell: ({ row }) => {
    const statusConfig = {
      "not-reviewed": {
        label: "Not Yet Reviewed",
        color: "bg-gray-100 text-gray-800",
        icon: <Clock className="mr-1 h-3 w-3" />,
      },
      accepted: {
        label: "Accepted",
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="mr-1 h-3 w-3" />,
      },
      ["not accepted"]: {
        label: "Not Accepted",
        color: "bg-red-100 text-red-800",
        icon: <XCircle className="mr-1 h-3 w-3" />,
      },
      ["pending board approval"]: {
        label: "Pending Board Approval",
        color: "bg-purple-100 text-purple-800",
        icon: <ClipboardCheck className="mr-1 h-3 w-3" />,
      },
      ["pending review"]: {
        label: "Pending Review",
        color: "bg-amber-100 text-amber-800",
        icon: <Clock className="mr-1 h-3 w-3" />,
      },
      ["pending fingerprint clearance"]: {
        label: "Pending Fingerprint Clearance",
        color: "bg-blue-100 text-blue-800",
        icon: <Fingerprint className="mr-1 h-3 w-3" />,
      },
    };
    return (
      <div className="flex flex-col items-start">
        <StatusBadge
          status={
            statusConfig[row.original[key].toLowerCase()] ||
            statusConfig["not-reviewed"]
          }
        />
      </div>
    );
  },
  meta: options.meta,
});

/**
 * Helper to create an icon column
 */
export const iconColumn = (key, Icon, options = {}) => ({
  accessorKey: key,
  header: options.header || formatHeader(key),
  cell: ({ row }) => {
    const value = row.getValue(key) || row.original[key];
    return value ? (
      <div className="flex items-center justify-center">
        <Icon className={options.size || "h-6 w-6"} />
      </div>
    ) : null;
  },
});

export const checkColumn = (key, options = {}) => ({
  accessorKey: key,
  header: options.header || formatHeader(key),
  cell: ({ row }) => {
    if (row.original[key] === true || row.original[key] === "Yes") {
      return <Check size={20} className="text-emerald-400" />;
    } else if (row.original[key] === false || row.original[key] === "No") {
      return <X size={20} className="text-red-400" />;
    } else
      return (
        <Badge
          variant="outline"
          className={"text-nowrap border-gray-400 bg-gray-200"}
        >
          N/A
        </Badge>
      );
  },
});

export const badgeColumn = (key, color, options = {}) => ({
  accessorKey: key,
  header: options.header || formatHeader(key),
  cell: (info) => (
    <div
      className="flex min-w-fit flex-col gap-1"
      style={{ wordBreak: "normal" }}
    >
      {info.getValue().map((element) => {
        return (
          <Badge
            key={element}
            variant="outline"
            className={cn(`min-w-fit border-${color}-700 bg-${color}-300`)}
          >
            {element}
          </Badge>
        );
      })}
    </div>
  ),
});

export const currencyColumn = (key, options = {}) => ({
  accessorKey: key,
  header: options.header || formatHeader(key),
  cell: ({ row }) => {
    const value = row.getValue(key) || row.original[key];
    return value ? <div className="">{formatCurrency(value)}</div> : null;
  },
});

export const formattedColumn = (key, displayHeader, options = {}) => {
  const {
    formatter = (value) => value, // Function to format the value
    emptyText = "-", // Text to display when value is empty
    className = "", // Additional CSS classes
    cellClassName = "", // CSS classes for the cell
    textPrefix = "", // Text to prepend to value
    textSuffix = "", // Text to append to value
  } = options;

  return {
    accessorKey: key,
    header: displayHeader,
    cell: ({ row }) => {
      const value = row.getValue(key);

      // Handle empty values
      if (value === null || value === undefined || value === "") {
        return <span className="text-gray-400">{emptyText}</span>;
      }

      // Format and display the value
      const formattedValue = formatter(value);
      return (
        <div className={cn("text-gray-800", cellClassName)}>
          {textPrefix && (
            <span className="mr-1 text-gray-500">{textPrefix}</span>
          )}
          <span className={className}>{formattedValue}</span>
          {textSuffix && (
            <span className="ml-1 text-gray-500">{textSuffix}</span>
          )}
        </div>
      );
    },
    meta: options.meta,
  };
};
