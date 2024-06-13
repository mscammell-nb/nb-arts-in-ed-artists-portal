import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

const EvaluationForm = () => {
  return (
    <>
      <h1>Evaluation Form</h1>
      <form>
        <h2>DID THE ARTIST PERFORM THEIR SERVICES?</h2>

        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="r1" />
            <Label htmlFor="r1">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="r2" />
            <Label htmlFor="r2">No</Label>
          </div>
        </RadioGroup>

        <div>
          <Label htmlFor="name">Your name:</Label>
          <Input id="name" type="text" />
        </div>

        <Button type="submit" variant="bocesPrimary">
          Submit
        </Button>

        <Separator className="my-4" />

        <h2>ARTIST'S EVALUATION OF THIS EXPERIENCE</h2>

        <ol>
          <li>
            <span>
              Was it apparent that students had used your study guide/support
              materials?
            </span>
            <RadioGroup>
              <RadioGroupItem value="yes" id="" />
              <Label htmlFor="">Yes</Label>
              <RadioGroupItem value="no" id="" />
              <Label htmlFor="">No</Label>
            </RadioGroup>
          </li>
          <li>
            <span>
              Were students attentive and engaged during your presentation?
            </span>
            <RadioGroup>
              <RadioGroupItem value="yes" id="" />
              <Label htmlFor="">Yes</Label>
              <RadioGroupItem value="no" id="" />
              <Label htmlFor="">No</Label>
            </RadioGroup>
          </li>
          <li>
            <span>
              Did teachers assist you in maintaining students' appropriate
              conduct/behavior during your presentation?
            </span>
            <RadioGroup>
              <RadioGroupItem value="yes" id="" />
              <Label htmlFor="">Yes</Label>
              <RadioGroupItem value="no" id="" />
              <Label htmlFor="">No</Label>
            </RadioGroup>
          </li>
          <li>
            <span>
              Did teachers remain with their class during your presentation?
            </span>
            <RadioGroup>
              <RadioGroupItem value="yes" id="" />
              <Label htmlFor="">Yes</Label>
              <RadioGroupItem value="no" id="" />
              <Label htmlFor="">No</Label>
            </RadioGroup>
          </li>
          <li>
            <span>
              Was the space clean and clear and set up as you had requested?
            </span>
            <RadioGroup>
              <RadioGroupItem value="yes" id="" />
              <Label htmlFor="">Yes</Label>
              <RadioGroupItem value="no" id="" />
              <Label htmlFor="">No</Label>
            </RadioGroup>
          </li>
          <li>
            <span>
              Did the school provide you with appropriate space and equipment?
            </span>
            <RadioGroup>
              <RadioGroupItem value="yes" id="" />
              <Label htmlFor="">Yes</Label>
              <RadioGroupItem value="no" id="" />
              <Label htmlFor="">No</Label>
            </RadioGroup>
          </li>
          <li>
            <span>
              Were you able to begin your presentation at the agreed-upon time?
            </span>
            <RadioGroup>
              <RadioGroupItem value="yes" id="" />
              <Label htmlFor="">Yes</Label>
              <RadioGroupItem value="no" id="" />
              <Label htmlFor="">No</Label>
            </RadioGroup>
          </li>
          <li>
            <Label htmlFor="additional-comments">
              Please include any additional comments you care to make
            </Label>
            <Textarea id="additional-comments" />
          </li>
        </ol>
      </form>
    </>
  );
};

export default EvaluationForm;
