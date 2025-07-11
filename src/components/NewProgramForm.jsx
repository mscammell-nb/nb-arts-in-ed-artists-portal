import {
  CATEGORIES,
  CATEGORY_DEFINITIONS,
  GRADES,
  KEYWORD_GROUPS,
  MAX_COST_LENGTH,
  MIN_INPUT_LENGTH,
  MIN_TEXTAREA_LENGTH,
  PROGRAM_LENGTHS,
  SERVICE_TYPE_DEFINITIONS,
  SERVICE_TYPES,
} from "@/constants/constants";
import { useAddOrUpdateRecordMutation } from "@/redux/api/quickbaseApi";
import { getCutoffFiscalYearKey } from "@/utils/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as yup from "yup";
import "yup-phone-lite";
import DefinitionsDialog from "./DefinitionsDialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MultiSelect } from "./ui/multi-select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";

const programSchema = yup.object({
  title: yup
    .string()
    .min(
      MIN_INPUT_LENGTH,
      `Title must be at least ${MIN_INPUT_LENGTH} characters long`,
    )
    .required("Program name is required"),
  description: yup
    .string()
    .min(
      MIN_TEXTAREA_LENGTH,
      `Program description must be at least ${MIN_TEXTAREA_LENGTH} characters long`,
    )
    .required("Program description is required"),
  location: yup
    .string()
    .oneOf(["In school", "Out of school"])
    .required("Location is a required field"),
  grades: yup.array().min(1, "At least one grade is required"),
  categories: yup.array().min(1, "At least one category is required"),
  keywords: yup.array().min(1, "At least one keyword is required"),
  cost: yup
    .number()
    .typeError("Cost must be a number")
    .min(1, "Cost must be a positive number greater than 0")
    .required("Cost is required"),
  serviceType: yup
    .string()
    .oneOf(SERVICE_TYPES)
    .required("Service type is a required field"),
  length: yup
    .string()
    .oneOf(PROGRAM_LENGTHS)
    .required("Length is a required field"),
  performers: yup
    .number()
    .typeError("Performers must be a number")
    .min(1, "The performers field must be a positive integer number")
    .max(999, "Maximum 999 performers allowed"),
  costDetails: yup
    .string()
    .max(MAX_COST_LENGTH, `Maximum ${MAX_COST_LENGTH} characters allowed`)
    .test(
      "minOrEmpty",
      `Cost details must be at least ${MIN_TEXTAREA_LENGTH} characters long`,
      (val) => !val || val.length === 0 || val.length >= MIN_TEXTAREA_LENGTH,
    ),
});

function NewProgramForm({ onSubmitSuccess = () => {} }) {
  const { toast } = useToast();
  const artistRecordId = useSelector((state) => state.artist?.artistRecordId);
  const programCutoffStartDate = useSelector(
    (state) => state.cutoff.programCutoffStartDate,
  );
  const programCutoffEndDate = useSelector(
    (state) => state.cutoff.programCutoffEndDate,
  );
  const maxPerformers = useSelector(
    (state) => state.artist?.numberOfPerformers,
  );

  const myRef = useRef();
  const [tempCategories, setTempCategories] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(programSchema),
    defaultValues: {
      title: "",
      description: "",
      location: null,
      grades: [],
      categories: [],
      keywords: [],
      cost: 0,
      serviceType: null,
      length: null,
      performers: 0,
      costDetails: "",
    },
  });

  const clearAllKeywords = () => {
    myRef.current?.handleClear();
    setValue("keywords", []);
  };

  // Watch categories for Exploratory Enrichment logic
  useEffect(() => {
    const categories = watch("categories");
    const exploratoryChecked = categories.includes("Exploratory Enrichment");
    const VirtualChecked = categories.includes("Virtual Programs");
    if (exploratoryChecked) {
      setTempCategories(
        categories.filter(
          (category) =>
            category !== "Exploratory Enrichment" &&
            category !== "Virtual Programs",
        ),
      );
      setValue(
        "categories",
        VirtualChecked
          ? ["Exploratory Enrichment", "Virtual Programs"]
          : ["Exploratory Enrichment"],
      );
    } else {
      setValue("categories", [...categories, ...tempCategories]);
      setTempCategories([]);
    }
    // eslint-disable-next-line
  }, [watch("categories").includes("Exploratory Enrichment")]);

  const [
    addProgram,
    {
      isLoading: isAddProgramLoading,
      isSuccess: isAddProgramSuccess,
      isError: isAddProgramError,
      data: addProgramData,
    },
  ] = useAddOrUpdateRecordMutation();

  useEffect(() => {
    // TODO DELETEME
    console.log("form values:", control._formValues);
  }, [watch()]);

  const onSubmit = (data) => {
    setTempCategories([]);
    clearAllKeywords();
    const tempCutoffStartDate = new Date(programCutoffStartDate);
    const startMonth = tempCutoffStartDate.getMonth();
    const startDay = tempCutoffStartDate.getDate();
    const tempCutoffEndDate = new Date(programCutoffEndDate);
    const endMonth = tempCutoffEndDate.getMonth();
    const endDay = tempCutoffEndDate.getDate();
    addProgram({
      to: import.meta.env.VITE_QUICKBASE_PROGRAMS_TABLE_ID,
      data: [
        {
          8: { value: artistRecordId },
          15: {
            value: getCutoffFiscalYearKey(
              startMonth,
              startDay,
              endMonth,
              endDay,
            ),
          },
          11: { value: data.title },
          12: { value: data.description },
          13: { value: data.location },
          27: {
            value: data.grades.map((grade) =>
              isNaN(grade) ? grade : String(grade),
            ),
          },
          22: { value: data.categories },
          20: { value: data.keywords },
          23: {
            value: SERVICE_TYPE_DEFINITIONS.find(
              (service) => service.title === data.serviceType,
            ).id,
          },
          25: { value: data.cost },
          26: { value: data.length },
          30: { value: data.performers },
          29: { value: data.costDetails },
          32: { value: "Pending Review" },
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
      reset();
      onSubmitSuccess();
      clearAllKeywords();
    }
    if (isAddProgramError) {
      toast({
        title: "There's been an error",
        description: "There was an error adding the program.",
        variant: "destructive",
      });
    }
  }, [toast, isAddProgramSuccess, isAddProgramError, reset]);

  return (
    <form
      id="mainform"
      onSubmit={handleSubmit(onSubmit)}
      className="mr-3 space-y-5 pl-1"
    >
      <div className="space-y-1">
        <Label htmlFor="title">
          Title
          <span className="font-extrabold text-red-500">*</span>
        </Label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="title"
              type="text"
              placeholder="Type here..."
              required
            />
          )}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">
          Description
          <span className="font-extrabold text-red-500">*</span>
        </Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="description"
              type="text"
              placeholder="Type here..."
              className="min-h-40"
              required
            />
          )}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>

      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={field.onChange}>
            <h2>
              Location
              <span className="font-extrabold text-red-500">*</span>
            </h2>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="In School" id="in-school" />
              <Label htmlFor="in-school">In school</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Out of School" id="out-of-school" />
              <Label htmlFor="out-of-school">Out of school</Label>
            </div>
            {errors.location && (
              <p className="text-red-500">{errors.location.message}</p>
            )}
          </RadioGroup>
        )}
      />

      <div>
        <h2>
          Grades<span className="font-extrabold text-red-500">*</span>
        </h2>
        <Controller
          name="grades"
          control={control}
          render={({ field }) => (
            <div className="flex items-center">
              {GRADES.map((grade) => (
                <div key={grade} className="pr-1">
                  <Checkbox
                    id={grade}
                    className="my-1 mr-1"
                    value={grade}
                    checked={field.value.includes(grade)}
                    onCheckedChange={(checked) => {
                      const newGrades = checked
                        ? [...field.value, grade]
                        : field.value.filter((g) => g !== grade);
                      field.onChange(newGrades);
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
          )}
        />
        {errors.grades && (
          <p className="text-red-500">{errors.grades.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center">
          <h2>
            Category
            <span className="font-extrabold text-red-500">*</span>
          </h2>
          <DefinitionsDialog definitions={CATEGORY_DEFINITIONS} />
        </div>
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <>
              {CATEGORIES.map((category) => (
                <div key={category}>
                  <Checkbox
                    id={category}
                    className="my-1 mr-1"
                    disabled={
                      field.value.includes("Exploratory Enrichment") &&
                      category !== "Exploratory Enrichment" &&
                      category !== "Virtual Programs"
                    }
                    checked={field.value.includes(category)}
                    onCheckedChange={(checked) => {
                      const newCategories = checked
                        ? [...field.value, category]
                        : field.value.filter((c) => c !== category);
                      field.onChange(newCategories);
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
            </>
          )}
        />
        {errors.categories && (
          <p className="text-red-500">{errors.categories.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center">
          <h2>
            Keywords
            <span className="font-extrabold text-red-500">*</span>
          </h2>
          <Link to="/keyword-list" target="_blank">
            <Button variant="link" type="button">
              Printable Keyword List
            </Button>
          </Link>
        </div>
        <Controller
          name="keywords"
          control={control}
          render={({ field }) => (
            <MultiSelect
              ref={myRef}
              options={KEYWORD_GROUPS}
              onValueChange={field.onChange}
              defaultValue={[]}
              value={field.value}
              placeholder="Select keywords"
              variant="inverted"
              animation={2}
              maxCount={72}
              modalPopover={true}
            />
          )}
        />
        {errors.keywords && (
          <p className="text-red-500">{errors.keywords.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="cost">
          Cost<span className="font-extrabold text-red-500">*</span>
        </Label>
        <Controller
          name="cost"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="cost"
              type="number"
              placeholder="Type here..."
              min="0"
              required
            />
          )}
        />
        {errors.cost && <p className="text-red-500">{errors.cost.message}</p>}
      </div>

      <div>
        <Label htmlFor="service-type">
          Service Type
          <span className="font-extrabold text-red-500">*</span>
        </Label>
        <DefinitionsDialog definitions={SERVICE_TYPE_DEFINITIONS} />
        <Controller
          name="serviceType"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              id="service-type"
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Service Type</SelectLabel>
                  {SERVICE_TYPE_DEFINITIONS.map((definition) => (
                    <SelectItem value={definition.title} key={definition.id}>
                      {definition.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.serviceType && (
          <p className="text-red-500">{errors.serviceType.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="length">
          Length<span className="font-extrabold text-red-500">*</span>
        </Label>
        <Controller
          name="length"
          control={control}
          render={({ field }) => (
            <Select
              id="length"
              value={field.value}
              onValueChange={field.onChange}
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
          )}
        />
        {errors.length && (
          <p className="text-red-500">{errors.length.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="performers">
          Performers
          <span className="font-extrabold text-red-500">*</span>
        </Label>
        <Controller
          name="performers"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="performers"
              type="number"
              placeholder="Type here..."
              min="0"
              step="1"
              required
              onChange={(e) => {
                let value = parseFloat(e.target.value) || 0;
                if (value > maxPerformers) value = maxPerformers;
                field.onChange(value);
              }}
            />
          )}
        />
        {errors.performers && (
          <p className="text-red-500">{errors.performers.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="cost-details">Cost Details</Label>
        <Controller
          name="costDetails"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="cost-details"
              placeholder="Type here..."
              className="min-h-40"
              minLength={MIN_TEXTAREA_LENGTH}
              maxLength={MAX_COST_LENGTH}
            />
          )}
        />
        {errors.costDetails && (
          <p className="text-red-500">{errors.costDetails.message}</p>
        )}
        {/* Show remaining characters if close to max */}
        {watch("costDetails") &&
          watch("costDetails").length >= MAX_COST_LENGTH - 50 && (
            <p className="text-red-500">{`${MAX_COST_LENGTH - watch("costDetails").length} characters left`}</p>
          )}
      </div>

      <Button
        className="w-full"
        size="lg"
        type="submit"
        isLoading={isAddProgramLoading || isSubmitting}
      >
        Submit
      </Button>
    </form>
  );
}

export default NewProgramForm;
