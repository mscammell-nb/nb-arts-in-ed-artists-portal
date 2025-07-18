import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle,
  ClipboardCheck,
  Clock,
  Fingerprint,
  GraduationCap,
  Users,
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
      <div className="text-tertiary text-sm">
        {row.original[secondaryField]}
      </div>
    </div>
  ),
});

/**
 * Helper to create a status column with badge
 */
export const statusColumn = (key, options = {}) => {
  return {
    accessorKey: key,
    header: options.header || formatHeader(key),
    accessorFn: (row) => row[key].status,
    cell: ({ row }) => {
      const statusConfig = {
        "not-reviewed": {
          label: "Not Yet Reviewed",
          color: "bg-gray-100 dark:bg-gray-800 text-primary",
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
            <div className="text-tertiary mb-1 text-xs">
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
  };
};

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
        color: "bg-gray-100 text-primary",
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
      return (
        <span className="inline-flex items-center space-x-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          <Check className="h-3 w-3" />
          <span>Yes</span>
        </span>
      );
    } else if (row.original[key] === false || row.original[key] === "No") {
      return (
        <span className="inline-flex items-center space-x-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          <X className="h-3 w-3" />
          <span>No</span>
        </span>
      );
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

export const emailColumn = (key, options = {}) => ({
  accessorKey: key,
  header: options.header || formatHeader(key),
  cell: ({ row }) => {
    const value = row.getValue(key) || row.original[key];
    return value ? (
      <a
        href={`mailto:${value}`}
        className="text-nowrap text-sm text-blue-600 hover:underline"
      >
        {value}
      </a>
    ) : null;
  },
});

export const badgeColumn = (key, color, options = {}) => ({
  accessorKey: key,
  header: options.header || formatHeader(key),
  cell: (info) => {
    const colorMap = {
      teal: "bg-teal-200 text-teal-800",
      blue: "bg-blue-200 text-blue-800",
      green: "bg-green-200 text-green-800",
      red: " bg-red-200 text-red-800",
      yellow: "bg-yellow-200 text-yellow-800",
      purple: "bg-purple-200 text-purple-800",
      fuchsia: "bg-fuchsia-200 text-fuchsia-800",
    };
    return (
      <div
        className="flex min-w-fit flex-col gap-1"
        style={{ wordBreak: "normal" }}
      >
        {Array.isArray(info.getValue()) ? (
          info.getValue().map((element) => {
            const colorClass = colorMap[color] || "border-gray-700 bg-gray-300";
            return (
              <Badge
                key={element}
                variant="outline"
                className={cn(
                  "min-w-fit rounded-[0.7rem] border-none",
                  colorClass,
                )}
              >
                {element}
              </Badge>
            );
          })
        ) : (
          <Badge
            variant="outline"
            className={cn(
              "max-w-fit rounded-full border-none font-normal",
              colorMap[color] || "border-gray-700 bg-gray-300",
            )}
          >
            {info.getValue()}
          </Badge>
        )}
      </div>
    );
  },
});

export const currencyColumn = (key, options = {}) => ({
  accessorKey: key,
  header: options.header || formatHeader(key),
  cell: ({ row }) => {
    const value = row.getValue(key) || row.original[key];
    return value ? <div className="">{formatCurrency(value)}</div> : null;
  },
});

export const requestedDateInner = (value) => {
  if (!value) return null;

  // Helper function to format date to MM/DD/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return dateStr;

    const [year, month, day] = dateStr.split("-");

    return `${month}/${day}/${year}`;
  };

  // Helper function to format performance count
  const formatPerformances = (count) => {
    if (!count || count === "0") return null;
    const num = parseInt(count);
    return `${num} Performance${num !== 1 ? "s" : ""}`;
  };

  // Helper function to format workshops
  const formatWorkshops = (workshops) => {
    if (!workshops || workshops.toLowerCase() === "none" || workshops === "0")
      return null;
    return workshops.includes("Workshop")
      ? workshops
      : `${workshops} Workshops`;
  };

  // Group data by date
  const dateGroups = {};

  const entries = Array.isArray(value) ? value : [value];

  entries.forEach((entry) => {
    const date = formatDate(entry[6]?.value);
    const school = entry[22]?.value;
    const performances = entry[15]?.value;
    const workshops = entry[18]?.value;

    if (!dateGroups[date]) {
      dateGroups[date] = {
        schools: [],
        performances: performances,
        workshops: workshops,
      };
    }

    if (school && !dateGroups[date].schools.includes(school)) {
      dateGroups[date].schools.push(school);
    }
  });

  return (
    <div className="min-w-[280px] space-y-2">
      {Object.entries(dateGroups).map(([date, data], index) => {
        const performanceText = formatPerformances(data.performances);
        const workshopText = formatWorkshops(data.workshops);

        return (
          <Card key={index} className="shadow-sm">
            <CardContent className="space-y-2 p-3">
              {/* Date header with icon */}
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">{date}</span>
              </div>

              {/* Schools - more compact */}
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Schools
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {data.schools.map((school, schoolIndex) => {
                    // Split schools by newlines if they're combined in a single string
                    const schoolNames = school.includes("\n")
                      ? school.split("\n")
                      : [school];

                    return schoolNames.map((schoolName, nameIndex) => (
                      <Badge
                        key={`${schoolIndex}-${nameIndex}`}
                        variant="secondary"
                        className="h-5 px-2 py-0.5 text-xs"
                      >
                        {schoolName.trim()}
                      </Badge>
                    ));
                  })}
                </div>
              </div>

              {/* Activities - more compact */}
              {(performanceText || workshopText) && (
                <div className="space-y-1 border-t pt-1">
                  <div className="flex flex-col flex-wrap gap-1">
                    {performanceText && (
                      <Badge variant="outline" className="h-5 gap-1 text-xs">
                        <Users className="mr-1 h-2.5 w-2.5" />
                        {performanceText}
                      </Badge>
                    )}
                    {workshopText && (
                      <Badge variant="outline" className="h-5 gap-1 text-xs">
                        <BookOpen className="mr-1 h-2.5 w-2.5" />
                        {workshopText}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export const requestedDateColumn = (key, options = {}) => ({
  accessorKey: key,
  header: options.header || formatHeader(key),
  cell: ({ row }) => {
    const value = row.getValue(key) || row.original[key];
    return requestedDateInner(value);
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
        return <span className="text-tertiary">{emptyText}</span>;
      }

      // Format and display the value
      const formattedValue = formatter(value);
      return (
        <div className={cn("text-primary", cellClassName)}>
          {textPrefix && (
            <span className="text-tertiary mr-1">{textPrefix}</span>
          )}
          <span className={className}>{formattedValue}</span>
          {textSuffix && (
            <span className="text-tertiary ml-1">{textSuffix}</span>
          )}
        </div>
      );
    },
    meta: options.meta,
  };
};
