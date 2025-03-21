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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { Mail } from "lucide-react";
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentFiscalYearKey } from "@/utils/utils";
import { capitalizeString } from "@/utils/utils";
import Spinner from "../components/ui/Spinner";
import DataGrid from "@/components/ui/data-grid";
import { performersColumns } from "@/utils/TableColumns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
});

const AddSheet = ({ open, onOpenChange, sheetProps }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} className="z-20">
      <SheetContent className="sm:max-w-1/3 w-1/3 overflow-y-scroll">
        <SheetHeader>
          <SheetTitle className="text-3xl">{sheetProps.title}</SheetTitle>
          <Separator className="my-2" />
          <SheetDescription>
            <p>Enter the performer's first and last name and click submit</p>
            <p>
              <span className="font-bold uppercase text-red-500">
                Important:
              </span>{" "}
              Performers can be edited only within 30 minutes of being added
            </p>
            <br />
          </SheetDescription>
        </SheetHeader>
        <div>
          <Form {...sheetProps.addPerformerForm}>
            <form
              onSubmit={sheetProps.addPerformerForm.handleSubmit(
                sheetProps.addPerformer,
              )}
              className="space-y-4"
            >
              <FormField
                control={sheetProps.addPerformerForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
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
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
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
  const artistRecordId = localStorage.getItem("artistRecordId");
  const {
    data: performersData,
    isLoading: isPerformersLoading,
    isError: isPerformersError,
    error: performersError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_PERFORMERS_TABLE_ID,
    select: [3, 7, 8, 9, 10, 11, 14, 18, 20, 22],
    where: `{14.EX.${artistRecordId}}`,
  });
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
    editPerformerRecord,
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
        lastName: record[8].value,
        stageName: record[22].value,
        printed: record[9].value,
        cleared: record[10].value,
        active: record[11].value,
      };
    });
  };

  const addPerformer = async (data) => {
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
        },
      ],
    });
    setIsAddPerformerDialogOpen(false);
  };

  if (isPerformersLoading) {
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
            <a href={performersData.data[0][20].value}>
              <Button variant="outline">
                <Mail className="mr-1 h-4 w-4" size={20} strokeWidth={2.5} />
                Email support
              </Button>
            </a>,
          ]}
        />
      </div>
    )
  );
};

export default PerformersPage;

// TODO: figure out why the background of the edit dialog is black
// TODO: add space bar listener to the edit buttons so that they follow the same logic of when they are clicked.
// TODO: When the user doesn't have any performers (there's no data in the table) and I try to select a filter, I get a warning saying each item in a list should have a unique key. Probably fixable by stopping the filtering process if the data returned by the API has a length of 0 (early return).
