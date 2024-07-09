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
import { Check, X, Plus, ListFilter, FilePenLine } from "lucide-react";
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
  useLazyQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getCurrentFiscalYearKey,
  capitalizeString,
} from "@/utils/functionUtils";
import Spinner from "../ui/Spinner";

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
    select: [3, 7, 8, 9, 10, 11, 14, 18],
    where: `{14.EX.${artistRecordId}}`,
  });
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

  const [isAddPerformerDialogOpen, setIsAddPerformerDialogOpen] =
    useState(false);
  const [isEditPerformerDialogOpen, setIsEditPerformerDialogOpen] =
    useState(false);
  const [showAllFilters, setShowAllFilters] = useState(true);

  const [filters, setFilters] = useState([
    {
      label: "Printed",
      isSelected: false,
    },
    {
      label: "Cleared",
      isSelected: false,
    },
    {
      label: "Active",
      isSelected: false,
    },
    {
      label: "Unprinted",
      isSelected: false,
    },
    {
      label: "Uncleared",
      isSelected: false,
    },
    {
      label: "Inactive",
      isSelected: false,
    },
  ]);

  const { toast } = useToast();

  const addPerformerForm = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const editPerformerForm = useForm({
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
          },
        ],
      });
      setIsEditPerformerDialogOpen(false);
    };
  };

  const shouldShowPerformer = (performer) => {
    const isSelected = (label) =>
      filters.find((filter) => filter.label === label).isSelected;

    return (
      (isSelected("Printed") && performer[9].value) ||
      (isSelected("Cleared") && performer[10].value) ||
      (isSelected("Active") && performer[11].value) ||
      (isSelected("Unprinted") && !performer[9].value) ||
      (isSelected("Uncleared") && !performer[10].value) ||
      (isSelected("Inactive") && !performer[11].value)
    );
  };

  const handleFilterSelect = (index) => {
    const oppositeFilters = {
      Printed: "Unprinted",
      Cleared: "Uncleared",
      Active: "Inactive",
      Unprinted: "Printed",
      Uncleared: "Cleared",
      Inactive: "Active",
    };

    const updatedFilters = filters.map((filter, i) => {
      if (i === index) {
        return {
          ...filter,
          isSelected: !filter.isSelected,
        };
      }

      const oppositeFilter = oppositeFilters[filter.label];
      if (oppositeFilter && filters[index].label === oppositeFilter) {
        return {
          ...filter,
          isSelected: false,
        };
      }

      return filter;
    });

    setFilters(updatedFilters);
    // const isAnyFilterActive =
    //   updatedFilters.find((filter) => filter.isSelected === true).length > 0;
    // console.log("is amy filter active: ", isAnyFilterActive);
    // if (!isAnyFilterActive) setShowAllFilters(true);
  };

  const closeFilter = (label) => {
    let isAnyFilterActive = false;
    const updatedFilters = filters.map((filter) => {
      if (label === filter.label) {
        return {
          ...filter,
          isSelected: false,
        };
      }

      if (filter.isSelected) isAnyFilterActive = true;

      return filter;
    });

    setFilters(updatedFilters);
    if (!isAnyFilterActive) setShowAllFilters(true);
  };

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
      <div className="min-w-[850px] max-w-3xl">
        <section>
          <div className="mb-2 flex items-center justify-between">
            <div className="space-x-1.5">
              {filters
                .filter((filter) => filter.isSelected)
                .map((filter, i) => (
                  <Badge
                    onClick={() => closeFilter(filter.label)}
                    variant="bocesPrimary"
                    asCloseButton
                    className="cursor-pointer rounded-full"
                  >
                    {filter.label}
                  </Badge>
                ))}
            </div>

            <div className="space-x-1.5">
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
                    checked={showAllFilters}
                    onCheckedChange={() => {
                      setShowAllFilters(!showAllFilters);
                      setFilters(
                        filters.map((filter) => ({
                          ...filter,
                          isSelected: false,
                        })),
                      );
                    }}
                  >
                    All
                  </DropdownMenuCheckboxItem>
                  {filters.map((filter, i) => (
                    <DropdownMenuCheckboxItem
                      key={i}
                      checked={filter.isSelected}
                      onCheckedChange={() => {
                        setShowAllFilters(false);
                        handleFilterSelect(i);
                      }}
                    >
                      {filter.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog
                open={isAddPerformerDialogOpen}
                onOpenChange={setIsAddPerformerDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="bocesPrimary"
                    onClick={() => {
                      addPerformerForm.reset();
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
                      Enter the performer's first and last name and click
                      submit.
                      <br />
                      <br />
                      <span className="font-bold uppercase text-red-500">
                        Important:{" "}
                      </span>
                      Performers can be edited only within 30 minutes of being
                      added.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Form {...addPerformerForm}>
                      <form
                        onSubmit={addPerformerForm.handleSubmit(addPerformer)}
                        className="space-y-4"
                      >
                        <FormField
                          control={addPerformerForm.control}
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
                          control={addPerformerForm.control}
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
                          <Button
                            variant="bocesPrimary"
                            type="submit"
                            isLoading={isNewPerformerLoading}
                          >
                            Submit
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performersData &&
                    performersData.data
                      .filter((performer) =>
                        showAllFilters
                          ? showAllFilters
                          : shouldShowPerformer(performer),
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
                          <TableCell>
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
                          <TableCell>
                            <Dialog
                              open={isEditPerformerDialogOpen}
                              onOpenChange={setIsEditPerformerDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <div className="flex justify-center">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <button
                                          onClick={() => {
                                            editPerformerForm.reset({
                                              firstName: performer[7].value,
                                              lastName: performer[8].value,
                                            });
                                            trigger({
                                              from: import.meta.env
                                                .VITE_QUICKBASE_PERFORMERS_TABLE_ID,
                                              select: [18],
                                              where: `{3.EX.${performer[3].value}}`,
                                            });
                                          }}
                                        >
                                          <FilePenLine
                                            className="mr-1 h-4 w-4"
                                            size={20}
                                            strokeWidth={2.25}
                                          />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Edit performer</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit performer</DialogTitle>
                                  {canEditPerformerData &&
                                    canEditPerformerData.data[0][18].value && (
                                      <DialogDescription>
                                        Entern your changes and click save when
                                        you're ready.
                                      </DialogDescription>
                                    )}
                                </DialogHeader>
                                {isCanEditPerformerFetching && <Spinner />}
                                {isCanEditPerformerFetching ? null : canEditPerformerData &&
                                  canEditPerformerData.data[0][18].value ? (
                                  <Form {...editPerformerForm}>
                                    <form
                                      onSubmit={editPerformerForm.handleSubmit(
                                        editPerformer(performer[3].value),
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
                                      <DialogFooter>
                                        <Button
                                          onClick={() =>
                                            setIsEditPerformerDialogOpen(false)
                                          }
                                          variant="outline"
                                          type="button"
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          // Note we're using the same loading boolean for adding and editing a performer
                                          isLoading={isNewPerformerLoading}
                                          variant="bocesPrimary"
                                        >
                                          Save
                                        </Button>
                                      </DialogFooter>
                                    </form>
                                  </Form>
                                ) : (
                                  <>
                                    <p>
                                      The editing time for this performer has
                                      expired. To edit this performer's data,
                                      please contact the Arts and Ed department
                                      at artsanded@nasboces.org.
                                    </p>
                                    <DialogFooter>
                                      <Button
                                        onClick={() =>
                                          setIsEditPerformerDialogOpen(false)
                                        }
                                        variant="outline"
                                      >
                                        Close
                                      </Button>
                                    </DialogFooter>
                                  </>
                                )}
                              </DialogContent>
                            </Dialog>
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

// TODO: figure out why the background of the edit dialog is black
