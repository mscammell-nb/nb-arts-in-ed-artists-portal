import DefinitionsDialog from "@/components/DefinitionsDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  CATEGORIES,
  CATEGORY_DEFINITIONS,
  GRADES,
  KEYWORD_GROUPS,
  MAX_COST_LENGTH,
  MIN_INPUT_LENGTH,
  MIN_TEXTAREA_LENGTH,
  SERVICE_TYPE_DEFINITIONS,
} from "@/constants/constants";
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import { getCurrentFiscalYearKey } from "@/utils/utils";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const NewProgramPage = () => {
  const { toast } = useToast();
  const artistRecordId = useSelector((state) => state.artist?.artistRecordId);

  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [tempCategories, setTempCategories] = useState([]);
  const myRef = useRef();

  const {
    data: performersData,
    isLoading: isPerformersLoading,
    isError: isPerformersError,
    error: performersError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_PERFORMERS_TABLE_ID,
    select: [3, 9, 10, 11, 14],
    where: `{14.EX.${artistRecordId}} AND {9.EX."Yes"} AND {10.EX."Yes"} AND {11.EX."true"}`,
  });

  const maxPerformers =
    performersData && !isPerformersLoading ? performersData.data.length : 0;

  // This object handles the fields of the form that don't work well with React Hook Form's validation.
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    location: null,
    grades: [],
    categories: [],
    cost: 0,
    serviceType: null,
    length: null,
    performers: 0,
    costDetails: "",
  });

  const [formErrors, setFormErrors] = useState({
    titleError: {
      isTriggered: false,
      message: "",
    },
    descriptionError: {
      isTriggered: false,
      message: "",
    },
    locationError: {
      isTriggered: false,
      message: "",
    },
    gradesError: {
      isTriggered: false,
      message: "",
    },
    categoryError: {
      isTriggered: false,
      message: "",
    },
    keywordsError: {
      isTriggered: false,
      message: "",
    },
    costError: {
      isTriggered: false,
      message: "",
    },
    serviceTypeError: {
      isTriggered: false,
      message: "",
    },
    lengthError: {
      isTriggered: false,
      message: "",
    },
    performersError: {
      isTriggered: false,
      message: "",
    },
    costDetailsError: {
      isTriggered: false,
      message: "",
    },
    costLengthError: {
      isTriggered: false,
      message: "",
    },
  });

  const clearAllKeywords = () => {
    myRef.current?.handleClear();
  };

  useEffect(() => {
    const exploratoryChecked = formValues.categories.includes(
      "Exploratory Enrichment",
    );
    const VirtualChecked = formValues.categories.includes("Virtual Programs");

    if (exploratoryChecked) {
      setTempCategories(
        formValues.categories.filter(
          (category) =>
            category !== "Exploratory Enrichment" &&
            category !== "Virtual Programs",
        ),
      );
      setFormValues((prev) => ({
        ...prev,
        categories: VirtualChecked
          ? ["Exploratory Enrichment", "Virtual Programs"]
          : ["Exploratory Enrichment"],
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        categories: [...prev.categories, ...tempCategories],
      }));
      setTempCategories([]);
    }
  }, [formValues.categories.includes("Exploratory Enrichment")]);

  const [
    addProgram,
    {
      isLoading: isAddProgramLoading,
      isSuccess: isAddProgramSuccess,
      isError: isAddProgramError,
      data: addProgramData,
    },
  ] = useAddOrUpdateRecordMutation();

  const handleSubmit = (e) => {
    e.preventDefault();

    let isError = false;

    if (formValues.title.length < MIN_INPUT_LENGTH) {
      isError = true;
      setFormErrors((prev) => ({
        ...prev,
        titleError: {
          isTriggered: true,
          message: `Title must be at least ${MIN_INPUT_LENGTH} characters long`,
        },
      }));
    }

    if (formValues.description.length < MIN_TEXTAREA_LENGTH) {
      isError = true;
      setFormErrors((prev) => ({
        ...prev,
        descriptionError: {
          isTriggered: true,
          message: `Description must be at least ${MIN_TEXTAREA_LENGTH} characters long`,
        },
      }));
    }

    if (formValues.location === null) {
      isError = true;
      setFormErrors((prev) => ({
        ...prev,
        locationError: {
          isTriggered: true,
          message: `Location is a required field`,
        },
      }));
    }

    if (formValues.grades.length === 0) {
      isError = true;
      setFormErrors((prev) => ({
        ...prev,
        gradesError: {
          isTriggered: true,
          message: `At least one grade is required`,
        },
      }));
    }

    if (formValues.categories.length === 0) {
      isError = true;
      setFormErrors((prev) => ({
        ...prev,
        categoryError: {
          isTriggered: true,
          message: `At least one category is required`,
        },
      }));
    }

    if (selectedKeywords.length === 0) {
      isError = true;
      setFormErrors((prev) => ({
        ...prev,
        keywordsError: {
          isTriggered: true,
          message: `At least one keyword is required`,
        },
      }));
    }

    if (formValues.cost <= 0) {
      isError = true;
      setFormErrors((prev) => ({
        ...prev,
        costError: {
          isTriggered: true,
          message: `Cost must be a positive number greater than 0`,
        },
      }));
    }

    if (formValues.serviceType === null) {
      isError = true;
      setFormErrors((prev) => ({
        ...prev,
        serviceTypeError: {
          isTriggered: true,
          message: `Service type is a required field`,
        },
      }));
    }

    if (formValues.length === null) {
      isError = true;
      setFormErrors((prev) => ({
        ...prev,
        lengthError: {
          isTriggered: true,
          message: `Length is a required field`,
        },
      }));
    }

    if (formValues.performers <= 0) {
      isError = true;
      setFormErrors((prev) => ({
        ...prev,
        performersError: {
          isTriggered: true,
          message: `The performers field must be a positive integer number`,
        },
      }));
    }

    if (
      formValues.costDetails.length < MIN_TEXTAREA_LENGTH &&
      formValues.costDetails.length > 0
    ) {
      isError = true;
      setFormErrors((prev) => ({
        ...prev,
        costDetailsError: {
          isTriggered: true,
          message: `Cost details must be at least ${MIN_TEXTAREA_LENGTH} characters long`,
        },
      }));
    }

    if (formValues.costDetails.length >= MAX_COST_LENGTH - 50) {
      setFormErrors((prev) => ({
        ...prev,
        costLengthError: {
          isTriggered: true,
          message: `${MAX_COST_LENGTH - formValues.costDetails.length} characters left`,
        },
      }));
    }

    if (isError) return;

    setTempCategories([]);
    setSelectedKeywords([]);

    addProgram({
      to: import.meta.env.VITE_QUICKBASE_PROGRAMS_TABLE_ID,
      data: [
        {
          8: {
            value: artistRecordId,
          },
          15: {
            value: getCurrentFiscalYearKey(),
          },
          11: {
            value: formValues.title,
          },
          12: {
            value: formValues.description,
          },
          13: {
            value: formValues.location,
          },
          27: {
            value: formValues.grades.map((grade) =>
              isNaN(grade) ? grade : String(grade),
            ),
          },
          22: {
            value: formValues.categories,
          },
          20: {
            value: selectedKeywords,
          },
          25: {
            value: formValues.cost,
          },
          34: {
            value: formValues.serviceType,
          },
          26: {
            value: formValues.length,
          },
          30: {
            value: formValues.performers,
          },
          29: {
            value: formValues.costDetails,
          },
          32: {
            value: "Pending Review",
          },
        },
      ],
    });
  };

  useEffect(() => {
    if (isAddProgramSuccess) {
      toast({
        title: "Operation successful!",
        description: "The new program was added successfully.",
        variant: "success",
      });
      setFormValues({
        title: "",
        description: "",
        location: null,
        grades: [],
        categories: [],
        cost: 0,
        serviceType: null,
        length: null,
        performers: 0,
        costDetails: "",
      });
      const form = document.getElementById("mainform");
      form.reset();

      setSelectedKeywords([]);
      clearAllKeywords();
    }

    if (isAddProgramError) {
      toast({
        title: "There's been an error",
        description: "There was an error adding the program.",
        variant: "destructive",
      });
    }
  }, [toast, isAddProgramSuccess, isAddProgramError, isAddProgramError]);

  return (
    <div className="space-y-4 py-1">
      <Link to="/programs">
        <Button
          variant="secondary"
          className="flex items-center space-x-2 rounded-md bg-slate-500 px-4 py-2 text-white hover:bg-slate-600"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back</span>
        </Button>
      </Link>

      <Card className="mx-auto max-w-[800px]">
        <CardHeader>
          <CardTitle>Add New Program</CardTitle>
          <CardDescription>
            Fill out this form to add a new program.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="mainform" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor="title">
                Title
                <span className="font-extrabold text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Type here..."
                value={formValues.title}
                required
                onChange={(e) => {
                  setFormValues((prev) => ({ ...prev, title: e.target.value }));

                  const isValid = e.target.value.length >= MIN_INPUT_LENGTH;
                  setFormErrors((prev) => ({
                    ...prev,
                    titleError: {
                      isTriggered: isValid ? false : true,
                      message: isValid
                        ? ""
                        : `Program title must be at least ${MIN_INPUT_LENGTH} characters long`,
                    },
                  }));
                }}
              />
              {formErrors.titleError.isTriggered && (
                <p className="text-red-500">{formErrors.titleError.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">
                Description
                <span className="font-extrabold text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                type="text"
                placeholder="Type here..."
                className="min-h-40"
                value={formValues.description}
                minLength={MIN_TEXTAREA_LENGTH}
                required
                onChange={(e) => {
                  setFormValues((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));

                  const isValid = e.target.value.length >= MIN_TEXTAREA_LENGTH;
                  setFormErrors((prev) => ({
                    ...prev,
                    descriptionError: {
                      isTriggered: isValid ? false : true,
                      message: isValid
                        ? ""
                        : `Program description must be at least ${MIN_TEXTAREA_LENGTH} characters long`,
                    },
                  }));
                }}
              />
              {formErrors.descriptionError.isTriggered && (
                <p className="text-red-500">
                  {formErrors.descriptionError.message}
                </p>
              )}
            </div>

            <RadioGroup
              value={formValues.location}
              onValueChange={(value) => {
                setFormValues((prev) => ({ ...prev, location: value }));
                setFormErrors((prev) => ({
                  ...prev,
                  locationError: { isTriggered: false, message: "" },
                }));
              }}
            >
              <h2>
                Location<span className="font-extrabold text-red-500">*</span>
              </h2>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="In School"
                  id="in-school"
                  onChange={() =>
                    setFormValues((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
                <Label htmlFor="in-school">In school</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Out of School"
                  id="out-of-school"
                  onChange={() =>
                    setFormValues((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
                <Label htmlFor="out-of-school">Out of school</Label>
              </div>
              {formErrors.locationError.isTriggered && (
                <p className="text-red-500">
                  {formErrors.locationError.message}
                </p>
              )}
            </RadioGroup>

            <div>
              <h2>
                Grades<span className="font-extrabold text-red-500">*</span>
              </h2>

              <div className="flex items-center">
                {GRADES.map((grade) => (
                  <div key={grade} className="pr-1">
                    <Checkbox
                      id={grade}
                      className="my-1 mr-1"
                      value={grade}
                      onCheckedChange={(checked) => {
                        const newGrades = checked
                          ? [...formValues.grades, grade]
                          : formValues.grades.filter((g) => g !== grade);

                        setFormValues((prev) => ({
                          ...prev,
                          grades: newGrades,
                        }));

                        const isValid = newGrades.length > 0;
                        setFormErrors((prev) => ({
                          ...prev,
                          gradesError: {
                            isTriggered: isValid ? false : true,
                            message: isValid
                              ? ""
                              : `At least one grade is required`,
                          },
                        }));
                      }}
                    />
                    <br />
                    <Label
                      htmlFor={grade}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {grade}
                    </Label>
                  </div>
                ))}
              </div>
              {formErrors.gradesError.isTriggered && (
                <p className="text-red-500">{formErrors.gradesError.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center">
                <h2>
                  Category<span className="font-extrabold text-red-500">*</span>
                </h2>
                <DefinitionsDialog definitions={CATEGORY_DEFINITIONS} />
              </div>
              {CATEGORIES.map((category) => (
                <div key={category}>
                  <Checkbox
                    id={category}
                    className="my-1 mr-1"
                    disabled={
                      formValues.categories.includes(
                        "Exploratory Enrichment",
                      ) &&
                      category !== "Exploratory Enrichment" &&
                      category !== "Virtual Programs"
                    }
                    onCheckedChange={(checked) => {
                      const newCategories = checked
                        ? [...formValues.categories, category]
                        : formValues.categories.filter((c) => c !== category);

                      setFormValues((prev) => ({
                        ...prev,
                        categories: newCategories,
                      }));

                      const isValid = newCategories.length > 0;
                      setFormErrors((prev) => ({
                        ...prev,
                        categoryError: {
                          isTriggered: isValid ? false : true,
                          message: isValid
                            ? ""
                            : "At least one category is required",
                        },
                      }));
                    }}
                  />
                  <Label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </Label>
                </div>
              ))}
              {formErrors.categoryError.isTriggered && (
                <p className="text-red-500">
                  {formErrors.categoryError.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center">
                <h2>
                  Keywords<span className="font-extrabold text-red-500">*</span>
                </h2>
                <Link to="/keyword-list" target="_blank">
                  <Button variant="link" type="button">
                    Printable Keyword List
                  </Button>
                </Link>
              </div>
              <MultiSelect
                ref={myRef}
                options={KEYWORD_GROUPS}
                onValueChange={setSelectedKeywords}
                defaultValue={[]}
                placeholder="Select keywords"
                variant="inverted"
                animation={2}
                maxCount={72}
              />
              {formErrors.keywordsError.isTriggered &&
                selectedKeywords.length === 0 && (
                  <p className="text-red-500">
                    {formErrors.keywordsError.message}
                  </p>
                )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="cost">
                Cost<span className="font-extrabold text-red-500">*</span>
              </Label>
              <Input
                id="cost"
                type="number"
                placeholder="Type here..."
                min="0"
                value={formValues.cost}
                required
                onChange={(e) => {
                  setFormValues((prev) => ({ ...prev, cost: e.target.value }));

                  const isValid = e.target.value > 0;
                  setFormErrors((prev) => ({
                    ...prev,
                    costError: {
                      isTriggered: isValid ? false : true,
                      message: isValid ? "" : `Cost must be a positive number`,
                    },
                  }));
                }}
              />
              {formErrors.costError.isTriggered && (
                <p className="text-red-500">{formErrors.costError.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="service-type">
                Service Type
                <span className="font-extrabold text-red-500">*</span>
              </Label>
              <DefinitionsDialog definitions={SERVICE_TYPE_DEFINITIONS} />
              <Select
                value={formValues.serviceType}
                id="service-type"
                onValueChange={(value) => {
                  setFormValues((prev) => ({ ...prev, serviceType: value }));
                  setFormErrors((prev) => ({
                    ...prev,
                    serviceTypeError: {
                      isTriggered: false,
                      message: "",
                    },
                  }));
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Service Type</SelectLabel>

                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Performance">Performance</SelectItem>
                    <SelectItem value="Residency">Residency</SelectItem>
                    <SelectItem value="Workshop & Performance">
                      Workshop & Performance
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formErrors.serviceTypeError.isTriggered && (
                <p className="text-red-500">
                  {formErrors.serviceTypeError.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="length">
                Length<span className="font-extrabold text-red-500">*</span>
              </Label>
              <Select
                id="length"
                value={formValues.length}
                onValueChange={(value) => {
                  setFormValues((prev) => ({ ...prev, length: value }));
                  setFormErrors((prev) => ({
                    ...prev,
                    lengthError: { isTriggered: false, message: "" },
                  }));
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Length</SelectLabel>
                    <SelectItem value="30 - 44 min">30 - 44 min</SelectItem>
                    <SelectItem value="45 - 59 min">45 - 59 min</SelectItem>
                    <SelectItem value="60 - 89 min">60 - 89 min</SelectItem>
                    <SelectItem value="90 - 119 min">90 - 119 min</SelectItem>
                    <SelectItem value="120+ min">120+ min</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formErrors.lengthError.isTriggered && (
                <p className="text-red-500">{formErrors.lengthError.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="performers">
                Performers<span className="font-extrabold text-red-500">*</span>
              </Label>
              <Input
                id="performers"
                type="number"
                placeholder="Type here..."
                min="0"
                step="1"
                value={formValues.performers}
                required
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || undefined;

                  setFormValues((prev) => ({
                    ...prev,
                    performers: value,
                  }));

                  const isValid =
                    value > 0 && value <= maxPerformers && value <= 999;
                  Number.isInteger(value);
                  setFormErrors((prev) => ({
                    ...prev,
                    performersError: {
                      isTriggered: isValid ? false : true,
                      message: isValid
                        ? ""
                        : `You only have ${maxPerformers} active performers.`,
                    },
                  }));
                }}
              />
              {formErrors.performersError.isTriggered && (
                <p className="text-red-500">
                  {formErrors.performersError.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cost-details">Cost Details</Label>
              <Textarea
                id="cost-details"
                placeholder="Type here..."
                className="min-h-40"
                value={formValues.costDetails}
                minLength={MIN_TEXTAREA_LENGTH}
                maxLength={MAX_COST_LENGTH}
                onChange={(e) => {
                  setFormValues((prev) => ({
                    ...prev,
                    costDetails: e.target.value,
                  }));

                  const isValid =
                    e.target.value.length >= MIN_TEXTAREA_LENGTH ||
                    e.target.value.length === 0;

                  const closeToMax =
                    e.target.value.length >= MAX_COST_LENGTH - 50;

                  setFormErrors((prev) => ({
                    ...prev,
                    costDetailsError: {
                      isTriggered: isValid ? false : true,
                      message: isValid
                        ? ""
                        : `Cost details must be at least ${MIN_TEXTAREA_LENGTH} characters long`,
                    },
                    costLengthError: {
                      isTriggered: closeToMax ? true : false,
                      message: closeToMax
                        ? `${MAX_COST_LENGTH - e.target.value.length} characters left`
                        : "",
                    },
                  }));

                  setFormErrors((prev) => ({
                    ...prev,
                  }));
                }}
              />
              {formErrors.costDetailsError.isTriggered && (
                <p className="text-red-500">
                  {formErrors.costDetailsError.message}
                </p>
              )}
              {formErrors.costLengthError.isTriggered && (
                <p className="text-red-500">
                  {formErrors.costLengthError.message}
                </p>
              )}
            </div>

            <Button
              className="w-full"
              size="lg"
              type="submit"
              isLoading={isAddProgramLoading}
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProgramPage;
