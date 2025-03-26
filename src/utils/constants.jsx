import { Badge } from "@/components/ui/badge";
import { SelectItem } from "@/components/ui/select";
import { Check, X } from "lucide-react";

// ArtistRegistrationsPage
export const REGISTRATION_CUTOFF_MONTH = 4; // Starts at 0 with January, so 4 is April
export const REGISTRATION_CUTOFF_DAY = 1; // 1st of the month
export const FISCAL_YEAR_FIRST_MONTH = 6; // June

// NewProgramPage
export const MIN_INPUT_LENGTH = 8;
export const MIN_TEXTAREA_LENGTH = 15;
export const MAX_COST_LENGTH = 100;

// ArtistDocumentsPage
export const TICKET_VENDOR = "Ticket Vendor";
export const TICKET_VENDOR_EXCEPTION_FILES = [
  "Fingerprinting Document",
  "Insurance Specifications",
];

export const PERFORMERS_EDITABLE_FIELDS = new Map([
  ["firstName", { field: 11, type: "string", options: [] }],
  ["middleInitial", { field: 23, type: "string", options: [] }],
  ["lastName", { field: 8, type: "string", options: [] }],
  ["stageName", { field: 22, type: "string", options: [] }],
  [
    "printed",
    {
      field: 9,
      type: "yes/no",
      options: [
        <SelectItem value="Yes" key={"yes"}>
          <div className="flex items-center gap-4">
            <span>Yes</span>
            <Check className="text-emerald-400" />
          </div>
        </SelectItem>,
        <SelectItem value="No" key={"No"}>
          <div className="flex items-center gap-4">
            <span>No</span>
            <X className="text-red-400" />
          </div>
        </SelectItem>,
      ],
    },
  ],
  [
    "cleared",
    {
      field: 10,
      type: "yes/no",
      options: [
        <SelectItem value="Yes" key={"yes"}>
          <div className="flex items-center gap-4">
            <span>Yes</span>
            <Check className="text-emerald-400" />
          </div>
        </SelectItem>,
        <SelectItem value="No" key={"No"}>
          <div className="flex items-center gap-4">
            <span>No</span>
            <X className="text-red-400" />
          </div>
        </SelectItem>,
      ],
    },
  ],
  [
    "active",
    {
      field: 11,
      type: "yes/no",
      options: [
        <SelectItem value={true} key={"active"}>
          <Badge
            variant="outline"
            className={"border-emerald-400 bg-emerald-200"}
          >
            Active
          </Badge>
        </SelectItem>,
        <SelectItem value={false} key={"inactive"}>
          <Badge variant="outline" className={"border-gray-400 bg-gray-200"}>
            Inactive
          </Badge>
        </SelectItem>,
      ],
    },
  ],
]);

export const PROGRAMS_EDITABLE_FIELDS = new Map([
  ["program", { field: 11, type: "string", options: [] }],
  [
    "paid",
    {
      field: 31,
      type: "boolean",
      options: [
        <SelectItem value={true} key={"yes"}>
          Yes
        </SelectItem>,
        <SelectItem value={false} key={"No"}>
          No
        </SelectItem>,
      ],
    },
  ],
]);

export const EVALUATIONS_EDITABLE_FIELDS = new Map([
  [
    "servicePerformed",
    {
      field: 13,
      type: "yes/no",
      options: [
        <SelectItem value={"Yes"} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={"No"} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  ["approverName", { field: 14, type: "string", options: [] }],
  [
    "guideUsed",
    {
      field: 15,
      type: "yes/no",
      options: [
        <SelectItem value={"Yes"} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={"No"} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  [
    "studentsAttentive",
    {
      field: 16,
      type: "yes/no",
      options: [
        <SelectItem value={"Yes"} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={"No"} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  [
    "equipmentUsed",
    {
      field: 20,
      type: "yes/no",
      options: [
        <SelectItem value={"Yes"} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={"No"} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  [
    "onSchedule",
    {
      field: 21,
      type: "yes/no",
      options: [
        <SelectItem value={"Yes"} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={"No"} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  [
    "studentConduct",
    {
      field: 17,
      type: "yes/no",
      options: [
        <SelectItem value={"Yes"} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={"No"} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  [
    "teacherRemained",
    {
      field: 18,
      type: "yes/no",
      options: [
        <SelectItem value={"Yes"} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={"No"} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  [
    "spaceSetUp",
    {
      field: 19,
      type: "yes/no",
      options: [
        <SelectItem value={"Yes"} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={"No"} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  [
    "additionalComments",
    {
      field: 22,
      type: "string",
      options: [],
    },
  ],
]);
