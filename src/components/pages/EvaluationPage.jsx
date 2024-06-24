import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
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

// TODO: Add more complex rules to the yup schema
// TODO: see if I can get the radio button checkmarks to go away when the form is reset.

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

const EvaluationPage = () => {

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
    };

    questions.forEach((question, index) => {
      formattedData[`question${index + 1}`] = {
        prompt: question,
        response: data[`question${index + 1}`],
        number: index + 1,
      };
    });

    console.log(formattedData);
    form.reset(defaultValues);
  };

  return (
    <>
      <h1 className="mb-5 text-4xl font-semibold">Evaluation Form</h1>

      <Separator className="my-4" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
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

          <Button type="submit" variant="bocesPrimary" size="lg">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EvaluationPage;
