import ContactCard from "@/components/ContactCard";
import { DropZone } from "@/components/DropZone";
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
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  badgeColumn,
  boardApprovalColumn,
  checkColumn,
  createColumns,
  currencyColumn,
  emailColumn,
  formattedColumn,
} from "./createColumns";
import { capitalizeString, downloadFile, uploadFile } from "./utils";

export const evalTableColumns = createColumns(
  ["programName", "evaluationDate", "approverName", "additionalComments"],
  checkColumn("active"),
  checkColumn("guideUsed"),
  checkColumn("studentsAttentive"),
  checkColumn("studentConduct"),
  checkColumn("teacherRemained"),
  checkColumn("spaceSetUp"),
  checkColumn("equipmentUsed"),
  checkColumn("onSchedule"),
);

export const registrationColumns = createColumns(
  ["artist", "fiscalYear", "numPerformers", "phone", "email", "approved"],
  checkColumn("approved"),
  badgeColumn("fiscalYear", "blue"),
  emailColumn("email"),
  formattedColumn("numPerformers", "Number of Performers"),
);

export const documentColumns = (
  allowDownload = true,
  allowDelete = false,
  removeDocument = null,
  isRemoveDocumentLoading = null,
) => {
  const cols = [
    ...createColumns(
      ["fiscalYear", "documentName", "documentType"],
      badgeColumn("fiscalYear", "blue"),
    ),
  ];
  if (allowDownload)
    cols.push({
      header: ({ column }) => <p className="text-center">Download</p>,
      id: "download",
      cell: ({ row }) => (
        <div className="grid w-full place-items-center">
          <Button
            className={"bg-foreground text-sm text-primary "}
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
  ...createColumns(
    [
      "firstName",
      "middleInitial",
      "lastName",
      "stageName",
      "printed",
      "cleared",
      "active",
    ],
    checkColumn("printed"),
    checkColumn("cleared"),
    checkColumn("active"),
  ),
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
  ...createColumns(
    [
      "fiscalYear",
      "dateCreated",
      "program",
      "description",
      "keywords",
      "category",
      "grades",
      "length",
      "serviceType",
      "cost",
      "costDetails",
      "performers",
      "status",
    ],
    badgeColumn("keywords", "teal"),
    badgeColumn("category", "blue"),
    badgeColumn("grades", "fuchsia"),
    currencyColumn("cost"),
    boardApprovalColumn("status"),
  ),
];

export const referencesColumns = createColumns([
  "firstName",
  "lastName",
  "email",
  "phone",
  "district",
  "jobTitle",
]);

export const baseContractColumns = [
  ...createColumns(
    [
      "id",
      "programTitle",
      "fiscalYear",
      "cost",
      "district",
      "requestor",
      "invoiceMade",
      "dateOfService",
    ],
    currencyColumn("cost"),
    {
      accessorKey: "requestor",
      header: "Requestor",
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger className="text-tertiary text-sm hover:text-blue-400 hover:underline">
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
      id: "invoiceMade",
      accessorKey: "invoiceMade",
      header: "Invoice Made",
      cell: ({ row }) =>
        row.original.invoiceDate != "" ? (
          <Check className="text-emerald-400" />
        ) : (
          <XIcon className="text-red-400" />
        ),
    },
  ),
];
export const contractColumns = [
  ...baseContractColumns,
  {
    id: "invoiceDate", // Add explicit ID
    accessorKey: "invoiceDate",
    header: "Invoice Date",
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
