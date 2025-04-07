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
import { Check, DownloadIcon, FilePenLine, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import getSortIcon from "./getSortIcon";
import { capitalizeString, downloadFile } from "./utils";

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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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

export const documentColumns = [
  {
    accessorKey: "fiscalYear",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Fiscal Year
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "artist",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs font-semibold uppercase text-gray-700"
        onClick={() => column.toggleSorting()}
      >
        Artist / Org
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
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
  },
];

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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
      </Button>
    ),
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
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
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "dateCreated",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Date Created
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "program",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Program
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="font-semibold">{info.getValue()}</p>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Status
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "paid",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Paid
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
];
