import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Textarea } from "../components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { getCurrentFiscalYear } from "@/utils/utils";
import { Check } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

// TODO: Add more complex rules to the yup schema
// TODO: see if I can get the radio button checkmark to go away when the form is reset.

const questions = [
  "Was it apparent that students had used your study guide/support materials?",
  "Were students attentive and engaged during your presentation?",
  "Did teachers assist you in maintaining students' appropriate conduct/behavior during your presentation?",
  "Did teachers remain with their class during your presentation?",
  "Was the space clean and clear and set up as you had requested?",
  "Did the school provide you with appropriate space and equipment?",
  "Were you able to begin your presentation at the agreed-upon time?",
];

let schema = yup.object().shape({});

questions.forEach((_, index) => {
  const fieldName = `question${index + 1}`;
  schema = schema.shape({
    [fieldName]: yup.string().required(`This field is required.`),
  });
});

schema = schema
  .shape({
    wereServicesPerformed: yup.string().required("This field is required."),
    approverName: yup.string().required("This field can't be empty."),
    additionalComments: yup.string(),
  })
  .required();

const EvaluationPage = ({ contractData, programData }) => {
  const [contract, setContract] = useState(null);
  const [
    addEvaluation,
    {
      isLoading: isAddEvaluationLoading,
      isSuccess: isAddEvaluationSuccess,
      isError: isAddEvaluationError,
      error: addEvaluationError,
    },
  ] = useAddOrUpdateRecordMutation();

  const defaultValues = questions.reduce(
    (values, _, index) => {
      values[`question${index + 1}`] = "";
      return values;
    },
    {
      wereServicesPerformed: "",
      approverName: "",
      additionalComments: "",
    },
  );

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = (data) => {
    const formattedData = {
      additionalComments: data.additionalComments,
      approverName: data.approverName,
      wereServicesPerformed: data.wereServicesPerformed === "yes",
      relatedContract: contract,
    };

    questions.forEach((question, index) => {
      formattedData[`question${index + 1}`] = {
        prompt: question,
        response: data[`question${index + 1}`],
        number: index + 1,
      };
    });

    form.reset(defaultValues);
    addEvaluation({
      to: import.meta.env.VITE_QUICKBASE_EVALUATIONS_TABLE_ID,
      data: [
        {
          6: { value: formattedData.relatedContract[3].value }, // Related Contract
          13: { value: formattedData.wereServicesPerformed }, //Services Performed
          14: { value: formattedData.approverName }, //Approver Name
          15: { value: convertResponse(formattedData.question1.response) }, //Guide Used
          16: { value: convertResponse(formattedData.question2.response) }, //Students Attentive
          17: { value: convertResponse(formattedData.question3.response) }, //Student Conduct
          18: { value: convertResponse(formattedData.question4.response) }, //Teacher Remained
          19: { value: convertResponse(formattedData.question5.response) }, //Space set up
          20: { value: convertResponse(formattedData.question6.response) }, //Materials Given
          21: { value: convertResponse(formattedData.question7.response) }, //On Schedule
          22: { value: formattedData.additionalComments }, //Additional Comments
        },
      ],
    });
  };

  const convertResponse = (res) => {
    return res === "yes" ? true : false;
  };

  const handleValueChange = (value) => {
    setContract(value);
  };

  const formatContractData = (data) => {
    let copy = data.map((cd) => {
      const programName = programData.filter(
        (d) => d[3].value === cd[8].value,
      )[0][11].value;
      return {
        ...cd,
        name: programName,
      };
    });
    return copy;
  };

  return (
    <div className="flex flex-col">
      <Separator className="my-4" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <h2 className="text-lg font-semibold">Evaluation Information</h2>
          <FormField
            control={form.control}
            name="relatedContract"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <CustomSelect
                    data={formatContractData(contractData)}
                    label={"Related Contract"}
                    placeholder={"Select a contract"}
                    value={contract}
                    setValue={setContract}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Separator />
          <h2 className="text-lg font-semibold">
            SERVICES PERFORMANCE CONFIRMATION
          </h2>
          <FormField
            control={form.control}
            name="wereServicesPerformed"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Did the artist perform their services</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="approverName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Approver name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type here..."
                    {...field}
                    className="max-w-80"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-4" />

          <h2 className="text-lg font-semibold">
            ARTIST'S EVALUATION OF THIS EXPERIENCE
          </h2>

          {questions.map((question, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`question${index + 1}`}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{question}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="additionalComments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional comments</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type here..."
                    className="h-44 w-[500px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" size="lg">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EvaluationPage;
