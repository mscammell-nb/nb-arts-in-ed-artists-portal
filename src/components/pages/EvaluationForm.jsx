import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";

const EvaluationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  const questions = [
    "Was it apparent that students had used your study guide/support materials?",
    "Were students attentive and engaged during your presentation?",
    "Did teachers assist you in maintaining students' appropriate conduct/behavior during your presentation?",
    "Did teachers remain with their class during your presentation?",
    "Was the space clean and clear and set up as you had requested?",
    "Did the school provide you with appropriate space and equipment?",
    "Were you able to begin your presentation at the agreed-upon time?",
  ];

  return (
    <>
      <h1 className="mb-5 text-4xl font-semibold">Evaluation Form</h1>

      <Separator className="my-4" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            DID THE ARTIST PERFORM THEIR SERVICES?
          </h2>
          <div className="flex gap-10">
            <RadioGroup className="flex items-center">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="yes"
                  id="r1"
                  {...register("wereServicesPerformed", { required: true })}
                />
                <Label htmlFor="r1">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="no"
                  id="r2"
                  {...register("wereServicesPerformed", { required: true })}
                />
                <Label htmlFor="r2">No</Label>
              </div>
            </RadioGroup>
            {errors.wereServicesPerformed && (
              <span>This field is required</span>
            )}
            <div className="space-x-3">
              <Label htmlFor="name" className="inline-block">
                Your name:
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Type here..."
                className="inline-block w-64 max-w-lg"
                {...register("approverName", { required: true })}
              />
              {errors.approverName && <span>This field is required</span>}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            ARTIST'S EVALUATION OF THIS EXPERIENCE
          </h2>
          <ol className="space-y-10">
            {questions.map((question, index) => (
              <li className="grid grid-cols-2" key={index}>
                <p>{question}</p>
                <RadioGroup className="ml-10 flex items-center">
                  <RadioGroupItem
                    value="yes"
                    id={`q${index + 1}yes`}
                    {...register(`question${index + 1}`, { required: true })}
                  />
                  <Label htmlFor={`q${index + 1}yes`}>Yes</Label>
                  <RadioGroupItem
                    value="no"
                    id={`q${index + 1}no`}
                    {...register(`question${index + 1}`, { required: true })}
                  />
                  <Label htmlFor={`q${index + 1}no`}>No</Label>
                </RadioGroup>
                {errors[`question${index + 1}`] && (
                  <span>This field is required</span>
                )}
              </li>
            ))}
            <li className="space-y-2">
              <Label htmlFor="additional-comments">
                Please include any additional comments
              </Label>
              <Textarea
                id="additional-comments"
                className="h-44 w-1/3"
                placeholder="Type here..."
                {...register("additionalComments")}
              />
            </li>
          </ol>
        </div>

        <Button type="submit" variant="bocesPrimary" size="lg" className="my-5">
          Submit
        </Button>
      </form>
    </>
  );
};

export default EvaluationForm;
