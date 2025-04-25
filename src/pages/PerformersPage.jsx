import DataGrid from "@/components/data-grid/data-grid";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { PERFORMERS_EDITABLE_FIELDS } from "@/constants/constants";
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import { performersColumns } from "@/utils/TableColumns";
import {
  capitalizeString,
  getCurrentFiscalYearKey,
  groupByIdAndField,
} from "@/utils/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Mail } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";
import Spinner from "../components/ui/Spinner";

const schema = yup.object({
  firstName: yup.string().required(),
  middleInitial: yup.string(),
  lastName: yup.string().required(),
  stageName: yup.string(),
});

const AddSheet = ({ open, onOpenChange, sheetProps }) => {
  const closeSheet = () => onOpenChange(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange} className="z-20">
      <SheetContent className="w-full overflow-y-auto sm:w-1/3">
        <SheetHeader>
          <SheetTitle className="text-3xl">{sheetProps.title}</SheetTitle>
          <Separator className="my-2" />
          <SheetDescription>
            Enter the performer's first name, middle initial (if they have one),
            last name, and stage name (if they have one) and click submit
            <br />
            <br />
            <span className="font-bold uppercase text-red-500">
              Important:
            </span>{" "}
            Performers can be edited only within 30 minutes of being added
            <br />
            <br />
          </SheetDescription>
        </SheetHeader>
        <div>
          <Form {...sheetProps.addPerformerForm}>
            <form
              onSubmit={sheetProps.addPerformerForm.handleSubmit((data) =>
                sheetProps.addPerformer(data, closeSheet),
              )}
              className="space-y-4"
            >
              <FormField
                control={sheetProps.addPerformerForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sheetProps.addPerformerForm.control}
                name="middleInitial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Initial</FormLabel>
                    <FormControl>
                      <Input maxLength={1} placeholder="H" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sheetProps.addPerformerForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sheetProps.addPerformerForm.control}
                name="stageName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Stage Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter>
                <Button
                  type="submit"
                  isLoading={sheetProps.isNewPerformerLoading}
                >
                  Submit
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const PerformersPage = () => {
  const artistRecordId = useSelector((state) => state.auth.artistRecordId);
  const {
    data: performersData,
    isLoading: isPerformersLoading,
    isError: isPerformersError,
    error: performersError,
  } = useQueryForDataQuery(
    artistRecordId
      ? {
          from: import.meta.env.VITE_QUICKBASE_PERFORMERS_TABLE_ID,
          select: [3, 7, 8, 9, 10, 11, 14, 18, 20, 22, 23],
          where: `{14.EX.${artistRecordId}}`,
        }
      : { skip: true, refetchOnMountOrArgChange: true },
  );
  const [
    addPerformerRecord,
    {
      data: newPerformerData,
      isLoading: isNewPerformerLoading,
      isSuccess: isNewPerformerSuccess,
      isError: isNewPerformerError,
      error: newPerformerError,
    },
  ] = useAddOrUpdateRecordMutation();
  const [
    updateRecord,
    {
      data: editPerformerData,
      isLoading: isEditPerformerLoading,
      isSuccess: isEditPerformerSuccess,
      isError: isEditPerformerError,
      error: editPerformerError,
    },
  ] = useAddOrUpdateRecordMutation();

  const { toast } = useToast();

  const addPerformerForm = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (newPerformerData && isNewPerformerSuccess) {
      toast({
        variant: "success",
        title: "Operation successful!",
        description: "New performer added.",
      });
    }

    if (isNewPerformerError) {
      toast({
        variant: "destructive",
        title: newPerformerError.data.message,
        description: newPerformerError.data.description,
      });
    }
  }, [
    newPerformerData,
    isNewPerformerSuccess,
    isNewPerformerError,
    newPerformerError,
    toast,
  ]);

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

  const formatData = (unformattedData) => {
    const { data } = unformattedData;
    return data.map((record) => {
      return {
        id: record[3].value,
        firstName: record[7].value,
        middleInitial: record[23].value,
        lastName: record[8].value,
        stageName: record[22].value,
        printed: record[9].value,
        cleared: record[10].value,
        active: record[11].value,
        editableFields: record[18].value
          ? ["firstName", "middleInitial", "lastName"]
          : [""],
      };
    });
  };

  const addPerformer = async (data, closeSheet) => {
    await addPerformerRecord({
      to: import.meta.env.VITE_QUICKBASE_PERFORMERS_TABLE_ID,
      data: [
        {
          7: {
            value: capitalizeString(data.firstName.trim()),
          },
          8: {
            value: capitalizeString(data.lastName.trim()),
          },
          12: {
            value: getCurrentFiscalYearKey(),
          },
          14: {
            value: artistRecordId,
          },
          22: {
            value: data.stageName?.trim() || "",
          },
          23: {
            value: capitalizeString(data.middleInitial?.trim()) || "",
          },
        },
      ],
    }).then(() => closeSheet());
  };

  const updateFunction = (records) => {
    const editableFields = PERFORMERS_EDITABLE_FIELDS;
    const acceptedChanges = [];
    Object.keys(records).forEach((recordKey) => {
      const id = recordKey;
      Object.keys(records[recordKey]).forEach((key) => {
        if (editableFields.has(key)) {
          acceptedChanges.push({
            id,
            field: editableFields.get(key).field,
            value: records[id][key],
          });
        }
      });
    });
    const updatedFields = groupByIdAndField(acceptedChanges);
    updateRecord({
      to: import.meta.env.VITE_QUICKBASE_PERFORMERS_TABLE_ID,
      data: updatedFields,
    });
  };

  if (isPerformersLoading || isEditPerformerLoading) {
    return (
      <div className="flex h-full w-full justify-center pt-24">
        <Spinner />
      </div>
    );
  }

  if (isPerformersError) {
    console.log(
      "Error trying to query the performers table: ",
      performersError,
    );

    return (
      <div>There was an error while trying to get the performers data</div>
    );
  }

  if (performersData == undefined) {
    return <p>No performers</p>;
  }

  return (
    !isPerformersLoading && (
      <div className="flex w-full flex-col items-center">
        <DataGrid
          data={formatData(performersData)}
          columns={performersColumns}
          usePagination
          tableTitle={"Performers List"}
          CustomAddComponent={AddSheet}
          addButtonText="Add Performer"
          sheetProps={{
            title: "Add Performer",
            addPerformerForm,
            isNewPerformerLoading,
            addPerformer,
          }}
          customButtons={[
            <a
              href={performersData.data[0][20].value}
              key={performersData.data[0][20].value}
            >
              <Button variant="outline">
                <Mail className="mr-1 h-4 w-4" size={20} strokeWidth={2.5} />
                Email support
              </Button>
            </a>,
          ]}
          updateFunction={updateFunction}
          editableFields={PERFORMERS_EDITABLE_FIELDS}
          rowSpecificEditing
        />
      </div>
    )
  );
};

export default PerformersPage;
