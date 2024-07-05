import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { Check, X, Plus, ListFilter } from "lucide-react";
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import { useToast } from "@/components/ui/use-toast";
import {
  getCurrentFiscalYearKey,
  capitalizeString,
} from "@/utils/functionUtils";
import { LoadingButton } from "../ui/loading-button";

const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
});

const PerformersPage = () => {
  const artistRecordId = localStorage.getItem("artistRecordId");
  const {
    data: performersData,
    isError: isPerformersError,
    error: performersError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_PERFORMERS_TABLE_ID,
    select: [3, 7, 8, 9, 10, 11, 14],
    where: `{14.EX.${artistRecordId}}`,
  });
  const [
    addOrupdateRecord,
    {
      data: newPerformerData,
      isLoading: isNewPerformerLoading,
      isSuccess: isNewPerformerSuccess,
      isError: isNewPerformerError,
      error: newPerformerError,
    },
  ] = useAddOrUpdateRecordMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [showCleared, setShowCleared] = useState(false);
  const [showPrinted, setShowPrinted] = useState(false);
  const [showActive, setShowActive] = useState(false);
  const [showUnprinted, setShowUnprinted] = useState(false);
  const [showUncleared, setShowUncleared] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const { toast } = useToast();

  const form = useForm({
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

  const onSubmit = async (data) => {
    await addOrupdateRecord({
      to: import.meta.env.VITE_QUICKBASE_PERFORMERS_TABLE_ID,
      data: [
        {
          7: {
            value: capitalizeString(data.firstName),
          },
          8: {
            value: capitalizeString(data.lastName),
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
    setIsDialogOpen(false);
  };

  const showPerformer = (performer) =>
    (showPrinted && performer[9].value) ||
    (showCleared && performer[10].value) ||
    (showActive && performer[11].value) ||
    (showUnprinted && !performer[9].value) ||
    (showUncleared && !performer[10].value) ||
    (showInactive && !performer[11].value);

  if (isPerformersError) {
    console.log(
      "Error trying to query the performers table: ",
      performersError,
    );

    return (
      <div>There was an error while trying to get the performers data</div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="min-w-[700px] max-w-3xl">
        <section>
          <div className="mb-2 flex justify-end space-x-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="bocesPrimary" size="sm">
                  <ListFilter
                    className="mr-1 h-4 w-4"
                    size={20}
                    color="white"
                    strokeWidth={2.5}
                  />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={showAll}
                  onCheckedChange={() => {
                    setShowAll(!showAll);
                    setShowPrinted(false);
                    setShowCleared(false);
                    setShowActive(false);
                    setShowUnprinted(false);
                    setShowUncleared(false);
                    setShowInactive(false);
                  }}
                >
                  All
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showPrinted}
                  onCheckedChange={() => {
                    setShowPrinted(!showPrinted);
                    setShowUnprinted(false);
                    setShowAll(false);
                  }}
                >
                  Printed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showCleared}
                  onCheckedChange={() => {
                    setShowCleared(!showCleared);
                    setShowUncleared(false);
                    setShowAll(false);
                  }}
                >
                  Cleared
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showActive}
                  onCheckedChange={() => {
                    setShowActive(!showActive);
                    setShowInactive(false);
                    setShowAll(false);
                  }}
                >
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showUnprinted}
                  onCheckedChange={() => {
                    setShowUnprinted(!showUnprinted);
                    setShowPrinted(false);
                    setShowAll(false);
                  }}
                >
                  Unprinted
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showUncleared}
                  onCheckedChange={() => {
                    setShowUncleared(!showUncleared);
                    setShowCleared(false);
                    setShowAll(false);
                  }}
                >
                  Uncleared
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showInactive}
                  onCheckedChange={() => {
                    setShowInactive(!showInactive);
                    setShowActive(false);
                    setShowAll(false);
                  }}
                >
                  Inactive
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="bocesPrimary"
                  onClick={() => {
                    form.reset();
                  }}
                >
                  <Plus
                    className="mr-1 h-4 w-4"
                    size={20}
                    color="white"
                    strokeWidth={2.5}
                  />
                  Add performer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add performer</DialogTitle>
                  <DialogDescription>
                    Enter the performer's first and last name and click submit.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
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
                        control={form.control}
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
                      <DialogFooter>
                        {/* <Button variant="bocesPrimary" type="submit">
                          Submit
                        </Button> */}
                        <LoadingButton
                          variant="bocesPrimary"
                          type="submit"
                          isLoading={isNewPerformerLoading}
                          buttonText="Submit"
                          loadingText="Please wait"
                        />
                      </DialogFooter>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Performer List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">First Name</TableHead>
                    <TableHead className="text-center">Last Name</TableHead>
                    <TableHead className="text-center">Printed</TableHead>
                    <TableHead className="text-center">Cleared</TableHead>
                    <TableHead className="text-center">Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performersData &&
                    performersData.data
                      .filter((performer) =>
                        showAll ? showAll : showPerformer(performer),
                      )
                      .map((performer) => (
                        <TableRow key={performer[3].value}>
                          <TableCell className="text-center">
                            {performer[7].value}
                          </TableCell>
                          <TableCell className="text-center">
                            {performer[8].value}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              {performer[9].value ? (
                                <Check size={18} strokeWidth={1.75} />
                              ) : (
                                <X size={18} strokeWidth={1.75} />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="flex justify-center">
                            <div className="flex justify-center">
                              {performer[10].value ? (
                                <Check size={18} strokeWidth={1.75} />
                              ) : (
                                <X size={18} strokeWidth={1.75} />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {performer[11].value ? (
                              <Badge
                                variant="secondary"
                                className="rounded-full"
                              >
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="rounded-full">
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default PerformersPage;
