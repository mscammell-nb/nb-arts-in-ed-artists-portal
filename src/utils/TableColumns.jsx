import ContactCard from "@/components/ContactCard";
import { DropZone } from "@/components/DropZone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import {
  useAddOrUpdateRecordMutation,
  useLazyQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Check,
  DownloadIcon,
  FilePenLine,
  Loader2,
  Trash,
  X,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  capitalizeString,
  downloadFile,
  formatCurrency,
  uploadFile,
} from "./utils";

const renderStatusIcon = (value) => {
  switch (value) {
    case true:
      return <Check size={18} strokeWidth={1.75} />;
    case false:
      return <X size={18} strokeWidth={1.75} />;
    default:
      return "N/A";
  }
};

export const evalTableColumns = [
  {
    accessorKey: "programName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Program
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "evaluationDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Evaluation Date
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "servicePerformed",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Service Performed
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "approverName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Approver Name
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "guideUsed",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Guide Used
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "studentsAttentive",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Attentive?
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "studentConduct",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Conduct?
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "teacherRemained",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Teacher Remained?
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "spaceSetUp",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Space Set Up?
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "equipmentUsed",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Equipment
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "onSchedule",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        On Schedule
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "additionalComments",
    header: ({ column }) => <p className="text-nowrap">Additional Comments</p>,
    cell: (info) => <p className="text-left">{info.getValue()}</p>,
  },
];

export const registrationColumns = [
  {
    accessorKey: "artist",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Artist/Organization
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "fiscalYear",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Fiscal Year
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "numPerformers",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Number of Performers
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Phone Number
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "altPhone",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Alternate Phone Number
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase  text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Email
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "approved",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Approved
      </Button>
    ),
    cell: (info) => {
      return (
        <p className="flex justify-center">
          {renderStatusIcon(info.getValue())}
        </p>
      );
    },
  },
];

export const documentColumns = (
  allowDownload = true,
  allowDelete = false,
  removeDocument = null,
  isRemoveDocumentLoading = null,
) => {
  const cols = [
    {
      accessorKey: "fiscalYear",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="text-xs font-semibold uppercase text-gray-700"
          onClick={() => column.toggleSorting()}
        >
          Fiscal Year
        </Button>
      ),
      cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
    },
    {
      accessorKey: "documentName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="text-xs font-semibold uppercase text-gray-700"
          onClick={() => column.toggleSorting()}
        >
          Document Name
        </Button>
      ),
      cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
    },
    {
      accessorKey: "documentType",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="text-xs font-semibold uppercase text-gray-700"
          onClick={() => column.toggleSorting()}
        >
          Document Type
        </Button>
      ),
      cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
    },
  ];
  if (allowDownload)
    cols.push({
      header: ({ column }) => (
        <p className="text-center font-semibold">Download</p>
      ),
      id: "download",
      cell: ({ row }) => (
        <div className="grid w-full place-items-center">
          <Button
            className={"bg-white text-sm text-black "}
            onClick={() =>
              downloadFile(
                import.meta.env.VITE_QUICKBASE_ARTISTS_FILES_TABLE_ID,
                7,
                row.original.id,
                row.original.versionNumber,
              )
            }
            variant="outline"
          >
            <DownloadIcon size={14} />
          </Button>
        </div>
      ),
    });

  if (allowDelete)
    cols.push({
      header: ({ column }) => (
        <p className="text-center font-semibold">Delete</p>
      ),
      id: "delete",
      cell: ({ row }) => (
        <div className="grid w-full place-items-center">
          <Button
            type="button"
            className={
              "border-red-700 bg-red-500 text-sm text-white hover:border-red-400 hover:bg-red-300 hover:text-white"
            }
            onClick={() =>
              removeDocument({
                from: import.meta.env.VITE_QUICKBASE_ARTISTS_FILES_TABLE_ID,
                where: `{3.EX.${row.original.id}}`,
              })
            }
            variant="outline"
            isLoading={isRemoveDocumentLoading}
          >
            <Trash size={14} />
          </Button>
        </div>
      ),
    });

  return cols;
};

export const performersColumns = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        First Name
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "middleInitial",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Middle Initial
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Last Name
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "stageName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Stage Name
      </Button>
    ),
    cell: ({ row }) => {
      if (row.original.stageName === "") {
        return <p>N/A</p>;
      } else return <p>{row.original.stageName}</p>;
    },
  },
  {
    accessorKey: "printed",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Fingerprinted
      </Button>
    ),
    cell: ({ row }) => {
      if (row.original.printed === "Yes") {
        return <Check size={20} className="text-emerald-400" />;
      } else if (row.original.printed === "No") {
        return <X size={20} className="text-red-400" />;
      } else
        return (
          <Badge variant="outline" className={"border-gray-400 bg-gray-200"}>
            N/A
          </Badge>
        );
    },
  },
  {
    accessorKey: "cleared",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Cleared
      </Button>
    ),
    cell: ({ row }) => {
      if (row.original.cleared === "Yes") {
        return <Check size={20} className="text-emerald-400" />;
      } else if (row.original.cleared === "No") {
        return <X size={20} className="text-red-400" />;
      } else
        return (
          <Badge variant="outline" className={"border-gray-400 bg-gray-200"}>
            N/A
          </Badge>
        );
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Active
      </Button>
    ),
    cell: ({ row }) => {
      if (row.original.active === true) {
        return (
          <Badge
            variant="outline"
            className={"border-emerald-400 bg-emerald-200"}
          >
            Active
          </Badge>
        );
      } else
        return (
          <Badge variant="outline" className={"border-gray-400 bg-gray-200"}>
            Inactive
          </Badge>
        );
    },
  },
  {
    header: ({ column }) => <p className="font-semibold"> </p>,
    id: "edit",
    cell: ({ row }) => {
      const [isEditPerformerDialogOpen, setIsEditPerformerDialogOpen] =
        useState(false);
      const [
        trigger,
        {
          data: canEditPerformerData,
          isSuccess: isCanEditPerformerSuccess,
          error: canEditPerformerError,
          isFetching: isCanEditPerformerFetching,
        },
      ] = useLazyQueryForDataQuery();
      const [
        editPerformerRecord,
        {
          data: editPerformerData,
          isLoading: isEditPerformerLoading,
          isSuccess: isEditPerformerSuccess,
          isError: isEditPerformerError,
          error: editPerformerError,
        },
      ] = useAddOrUpdateRecordMutation();
      const performerSchema = yup.object({
        firstName: yup.string().required(),
        middleInitial: yup.string(),
        lastName: yup.string().required(),
        stageName: yup.string(),
      });

      const editPerformerForm = useForm({
        resolver: yupResolver(performerSchema),
        defaultValues: {
          firstName: "",
          middleInitial: "",
          lastName: "",
          stageName: "",
        },
      });

      useEffect(() => {
        if (editPerformerData && isEditPerformerSuccess) {
          toast({
            variant: "success",
            title: "Operation successful!",
            description: "Performer edited.",
          });
        }

        if (isEditPerformerError) {
          toast({
            variant: "destructive",
            title: editPerformerError.data.message,
            description: editPerformerError.data.description,
          });
        }
      }, [
        editPerformerData,
        isEditPerformerSuccess,
        isEditPerformerError,
        editPerformerError,
        toast,
      ]);
      const editPerformer = (performerId) => {
        return async (data) => {
          await editPerformerRecord({
            to: import.meta.env.VITE_QUICKBASE_PERFORMERS_TABLE_ID,
            data: [
              {
                3: {
                  value: performerId,
                },
                7: {
                  value: capitalizeString(data.firstName.trim()),
                },
                8: {
                  value: capitalizeString(data.lastName.trim()),
                },
                22: {
                  value: data.stageName?.trim() || "",
                },
                23: {
                  value: capitalizeString(data.middleInitial?.trim()) || "",
                },
              },
            ],
          });
          setIsEditPerformerDialogOpen(false);
        };
      };

      return (
        <Dialog
          open={isEditPerformerDialogOpen}
          onOpenChange={setIsEditPerformerDialogOpen}
        >
          <DialogTrigger asChild>
            <div className="flex justify-center">
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={() => {
                      editPerformerForm.reset({
                        firstName: row.original.firstName,
                        middleInitial: row.original.middleInitial,
                        lastName: row.original.lastName,
                        stageName: row.original.stageName,
                      });
                      trigger({
                        from: import.meta.env
                          .VITE_QUICKBASE_PERFORMERS_TABLE_ID,
                        select: [18],
                        where: `{3.EX.${row.original.id}}`,
                      });
                    }}
                  >
                    <FilePenLine
                      className="mr-1 h-4 w-4"
                      size={20}
                      strokeWidth={2.25}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit performer</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit performer</DialogTitle>
              {canEditPerformerData &&
                canEditPerformerData.data[0][18].value && (
                  <DialogDescription>
                    Enter your changes and click save when you're ready.
                  </DialogDescription>
                )}
            </DialogHeader>
            {isCanEditPerformerFetching ? (
              <div className="flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : canEditPerformerData &&
              canEditPerformerData.data[0][18].value ? (
              <Form {...editPerformerForm}>
                <form
                  onSubmit={editPerformerForm.handleSubmit(
                    editPerformer(row.original.id),
                  )}
                  className="space-y-4"
                >
                  <FormField
                    control={editPerformerForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editPerformerForm.control}
                    name="middleInitial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Initial</FormLabel>
                        <FormControl>
                          <Input maxLength={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editPerformerForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editPerformerForm.control}
                    name="stageName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stage Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      onClick={() => setIsEditPerformerDialogOpen(false)}
                      variant="outline"
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button
                      // Note we're using the same loading boolean for adding and editing a performer
                      isLoading={isEditPerformerLoading}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            ) : (
              <>
                <p>
                  The editing time for this performer has expired. To edit this
                  performer's data, please contact the Arts and Ed department at
                  artsanded@nasboces.org.
                </p>
                <DialogFooter>
                  <Button
                    onClick={() => setIsEditPerformerDialogOpen(false)}
                    variant="outline"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export const programTableColumns = [
  {
    accessorKey: "fiscalYear",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Fiscal Year
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "dateCreated",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Date Created
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "program",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Program
      </Button>
    ),
    cell: (info) => (
      <p className="max-w-48 text-wrap font-semibold">{info.getValue()}</p>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Description
      </Button>
    ),
    cell: (info) => (
      <p className="max-w-48 text-wrap font-semibold">{info.getValue()}</p>
    ),
  },
  {
    accessorKey: "keywords",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Keywords
      </Button>
    ),
    cell: (info) => (
      <div
        className="flex flex-wrap gap-1"
        style={{ wordBreak: "auto-phrase" }}
      >
        {info.getValue().map((element, idx) => {
          return (
            <Badge
              key={idx}
              variant="outline"
              className="w-full border-teal-700 bg-teal-300"
            >
              {element
                .replaceAll("-", " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Badge>
          );
        })}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Categories
      </Button>
    ),
    cell: (info) => (
      <div
        className="flex min-w-fit flex-col gap-1"
        style={{ wordBreak: "auto-phrase" }}
      >
        {info.getValue().map((element, idx) => {
          return (
            <Badge
              key={idx}
              variant="outline"
              className="min-w-fit border-blue-700 bg-blue-300"
            >
              {element}
            </Badge>
          );
        })}
      </div>
    ),
  },
  {
    accessorKey: "length",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Length
      </Button>
    ),
    cell: (info) => <p className="font-semibold">{info.getValue()}</p>,
  },
  {
    accessorKey: "grades",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Grades
      </Button>
    ),
    cell: (info) => (
      <div className="flex flex-wrap gap-1">
        {info.getValue().map((element, idx) => {
          return (
            <Badge
              key={idx}
              variant="outline"
              className="border-fuchsia-700 bg-fuchsia-300"
            >
              {element
                .replaceAll("-", " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Badge>
          );
        })}
      </div>
    ),
  },
  {
    accessorKey: "serviceType",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Service Type
      </Button>
    ),
    cell: (info) => <p className="font-semibold">{info.getValue()}</p>,
  },
  {
    accessorKey: "cost",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Cost
      </Button>
    ),
    cell: (info) => (
      <p className="font-semibold"> {formatCurrency(info.getValue())}</p>
    ),
  },
  {
    accessorKey: "costDetails",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Cost Details
      </Button>
    ),
    cell: (info) => (
      <div className="max-w-48 text-wrap font-semibold">{info.getValue()}</div>
    ),
  },
  {
    accessorKey: "performers",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Performers
      </Button>
    ),
    cell: (info) => <p className="font-semibold">{info.getValue()}</p>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Status
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
];
export const referencesColumns = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        First Name
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Last Name
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Email
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Phone
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "district",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        District
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
];
export const baseContractColumns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "programTitle",
    header: "Program Title",
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {row.getValue("programTitle")}
      </div>
    ),
  },
  {
    accessorKey: "fiscalYear",
    header: "Fiscal Year",
    cell: ({ row }) => (
      <div className="text-left font-medium">{row.getValue("fiscalYear")}</div>
    ),
  },
  {
    accessorKey: "cost",
    header: "Amount",
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {formatCurrency(row.getValue("cost"))}
      </div>
    ),
  },
  {
    accessorKey: "district",
    header: "District",
    cell: ({ row }) => (
      <div className="text-left font-medium">{row.getValue("district")}</div>
    ),
  },
  {
    accessorKey: "requestor",
    header: "Requestor",
    cell: ({ row }) => (
      <Dialog>
        <DialogTrigger className="text-sm text-gray-500 hover:text-blue-400 hover:underline">
          {row.original.requestor}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <ContactCard
            name={row.original.requestor}
            email={row.original.requestorEmail}
            phone={row.original.requestorPhone}
            inDialog
          />
        </DialogContent>
      </Dialog>
    ),
  },
  {
    accessorKey: "dateOfService",
    header: "Date of Service",
    cell: ({ row }) => (
      <div>
        <div className="text-sm text-gray-500">
          {row.original.dateOfService}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "invoiceMade",
    header: "Invoice Made",
    cell: ({ row }) =>
      row.original.invoiceDate != "" ? (
        <Check className="text-emerald-400" />
      ) : (
        <XIcon className="text-red-400" />
      ),
  },
];
export const contractColumns = [
  ...baseContractColumns,
  {
    accessorKey: "invoiceDate",
    header: "Invoice Date",
    cell: ({ row }) => (
      <div className="text-left font-medium">{row.getValue("invoiceDate")}</div>
    ),
  },
];
export const contractsThatRequireAnInvoiceColumns = [
  ...baseContractColumns,
  {
    header: "Add Invoice",
    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [uploadedFile, setUploadedFile] = useState(null);
      const [buttonLoading, setButtonLoading] = useState(false);
      const [
        addDocument,
        {
          isLoading: isAddDocumentLoading,
          isSuccess: isAddDocumentSuccess,
          isError: isAddDocumentError,
          error: addDocumentError,
        },
      ] = useAddOrUpdateRecordMutation();

      const handleUpload = async () => {
        setButtonLoading(true);
        if (uploadedFile && uploadedFile.type === "application/pdf") {
          const append = await uploadFile(uploadedFile, 31);

          await addDocument({
            to: import.meta.env.VITE_QUICKBASE_CONTRACTS_TABLE_ID,
            data: [
              {
                3: { value: row.original.id },
                32: { value: "today" },
                ...append,
              },
            ],
          }).then((res) => {
            // Close dialog and reset state
            if (isAddDocumentSuccess) {
              toast({
                variant: "success",
                title: "Operation successful!",
                description: "Your invoice has been submitted.",
              });
              setIsDialogOpen(false);
              setUploadedFile(null);
            } else if (isAddDocumentError) {
              toast({
                variant: "destructive",
                title: "Error submitting invoice",
                description: "There was an error submitting your invoice.",
              });
            }
          });
        }
      };

      const handleCancel = () => {
        setIsDialogOpen(false);
        setUploadedFile(null);
      };

      return (
        <div className="flex justify-center">
          <Tooltip>
            <TooltipTrigger>
              <div onClick={() => setIsDialogOpen(true)}>
                <FilePenLine
                  className="mr-1 h-4 w-4 cursor-pointer hover:text-primary"
                  size={20}
                  strokeWidth={2.25}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add invoice</p>
            </TooltipContent>
          </Tooltip>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!open) handleCancel();
            }}
          >
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Upload Invoice</DialogTitle>
                <DialogDescription>
                  Upload a PDF invoice for this record
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                {/* Use the DropZone component */}
                <DropZone setUploadedFile={setUploadedFile} />

                {/* Only show upload button if there's a file */}
                {uploadedFile && uploadedFile.type === "application/pdf" && (
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpload} isLoading={buttonLoading}>
                      Upload Invoice
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
