import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const GRADES = ["PK", "K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const CATEGORIES = [
  "Dance (DA)",
  "Media Arts (MA)",
  "Music (MU)",
  "Theatre (TH)",
  "Visual Arts (VA)",
  "Literature (LI)",
  "Professional Development",
  "Exploratory Enrichment",
  "Virtual Programs",
];
const KEYWORD_GROUPS = [
  {
    heading: "Academics (other than the Arts)",
    options: [
      { value: "consumer-science", label: "Consumer Science" },
      { value: "study-skills", label: "Study Skills" },
      { value: "career-development", label: "Career Development" },
      { value: "health", label: "Health" },
      {
        value: "languages-other-than-english",
        label: "Languages Other Than English",
      },
      { value: "math", label: "Math" },
      { value: "science", label: "Science" },
      { value: "social-studies-history", label: "Social Studies / History" },
      { value: "technology", label: "Technology" },
      { value: "common-core", label: "Common Core" },
      { value: "stem-steam", label: "STEM / STEAM" },
    ],
  },
  {
    heading: "Art",
    options: [
      { value: "media-art", label: "Media Art" },
      { value: "visual-art", label: "Visual Art" },
      { value: "art-instruction", label: "Art Instruction" },
    ],
  },
  {
    heading: "Music",
    options: [
      {
        value: "accompanist-for-music-dance-students",
        label: "Accompanist for Music/Dance Students",
      },
      { value: "clinician", label: "Clinician" },
      { value: "conductor", label: "Conductor" },
      { value: "instrumental-music", label: "Instrumental Music" },
      { value: "vocal-music", label: "Vocal Music" },
      { value: "music-instruction", label: "Music Instruction" },
      { value: "music-performance", label: "Music Performance" },
      { value: "composer", label: "Composer" },
    ],
  },
  {
    heading: "School Play / Drama",
    options: [
      {
        value: "accompanist-for-school-play-drama",
        label: "Accompanist for School Play/Drama",
      },
      { value: "choreographer", label: "Choreographer" },
      { value: "costume-designer", label: "Costume Designer" },
      { value: "music-director", label: "Music Director" },
      {
        value: "set-lighting-sound-designer",
        label: "Set, Lighting, Sound Designer",
      },
    ],
  },
  {
    heading: "Youth Safety",
    options: [
      { value: "anti-bullying", label: "Anti-Bullying" },
      { value: "conflict-resolution", label: "Conflict Resolution" },
      { value: "cyber-bullying", label: "Cyber-Bullying" },
      {
        value: "suicide-prevention-depression",
        label: "Suicide Prevention / Depression",
      },
      {
        value: "alcohol-vaping-controlled-substance-abuse",
        label: "Alcohol / Vaping / Controlled Substance Abuse",
      },
      { value: "driver-safety", label: "Driver Safety" },
      {
        value: "internet-safety-social-media",
        label: "Internet Safety / Social Media",
      },
      { value: "peer-pressure", label: "Peer Pressure" },
      { value: "sex-education", label: "Sex Education" },
      { value: "stranger-danger", label: "Stranger Danger" },
      { value: "fire-safety", label: "Fire Safety" },
      {
        value: "alcohol-controlled-substance-abuse",
        label: "Alcohol/Controlled Substance Abuse",
      },
      { value: "mental-health", label: "Mental Health" },
    ],
  },
  {
    heading: "Character Education",
    options: [
      { value: "anger-management", label: "Anger Management" },
      { value: "empowerment", label: "Empowerment" },
      { value: "motivation", label: "Motivation" },
      {
        value: "self-esteem-self-control",
        label: "Self-Esteem / Self-Control",
      },
      { value: "citizenship", label: "Citizenship" },
      { value: "emotional-well-being", label: "Emotional Well Being" },
      { value: "dignity-act", label: "Dignity Act" },
      { value: "self-control", label: "Self Control" },
      { value: "team-building", label: "Team Building" },
      { value: "character-education", label: "Character Education" },
    ],
  },
  {
    heading: "Literature",
    options: [
      { value: "literacy", label: "Literacy" },
      { value: "poetry", label: "Poetry" },
      { value: "reading", label: "Reading" },
      { value: "writing", label: "Writing" },
      {
        value: "english-language-arts-ela",
        label: "English Language Arts (ELA)",
      },
    ],
  },
  {
    heading: "Author Visits",
    options: [
      { value: "storyteller", label: "Storyteller" },
      { value: "writer-also-poet", label: "Writer (also Poet)" },
      { value: "illustrator", label: "Illustrator" },
    ],
  },
  {
    heading: "Topical",
    options: [
      { value: "american-indian", label: "American Indian" },
      { value: "black-history", label: "Black History" },
      { value: "cultural-diversity", label: "Cultural Diversity" },
      { value: "hispanic-heritage", label: "Hispanic Heritage" },
      { value: "holiday", label: "Holiday" },
      { value: "holocaust", label: "Holocaust" },
      { value: "womens-history", label: "Women's History" },
      { value: "american-history", label: "American History" },
      { value: "biographical", label: "Biographical" },
      { value: "environment", label: "Environment" },
    ],
  },
  {
    heading: "Dance",
    options: [
      { value: "dance-instruction", label: "Dance Instruction" },
      { value: "dance-performance", label: "Dance Performance" },
    ],
  },
  {
    heading: "Theater",
    options: [
      { value: "theater-instruction", label: "Theater Instruction" },
      { value: "theater-performance", label: "Theater Performance" },
    ],
  },
];

const schema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  location: yup.string().oneOf(["in-school", "out-of-school"]).required(),
  grades: yup
    .array()
    .of(yup.string())
    .min(1, "At least one option must be selected"),
  category: yup.array().min(1, "At least one option must be selected"),
  keywords: yup.array().min(1, "At least one option must be selected"),
  cost: yup.number().required().positive("Value must be positive"),
  serviceType: yup
    .string()
    .oneOf(["workshop", "performance", "residency", "workshop-&-performance"]),
  length: yup
    .string()
    .oneOf(["30-44-min", "45-59-min", "60-89-min", "90-199-min", "120+min"]),
  performers: yup.number().required().positive("Value must be positive"),
  costDetails: yup.string().required(),
});

const NewProgramPage = () => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      grades: [],
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  console.log("ERRORS: ", errors);
  console.log("Grades:", watch("grades"));
  return (
    <div className="py-5">
      <Card className="mx-auto max-w-[600px]">
        <CardHeader>
          <CardTitle>Add New Program</CardTitle>
          <CardDescription>
            Fill out this form to add a new program.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Type here..."
                {...register("title")}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                type="text"
                placeholder="Type here..."
                className="min-h-40"
                {...register("description")}
              />
            </div>

            <RadioGroup>
              <h2>Location</h2>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="in-school"
                  id="in-school"
                  {...register("location", {
                    required: "Please select a location",
                  })}
                />
                <Label htmlFor="in-school">In school</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="out-of-school"
                  id="out-of-school"
                  {...register("location", {
                    required: "Please select a location",
                  })}
                />
                <Label htmlFor="out-of-school">Out of school</Label>
              </div>
            </RadioGroup>

            <div>
              <h2>Grades</h2>
              {GRADES.map((grade) => (
                <div key={grade}>
                  <Checkbox
                    id={grade}
                    className="my-1 mr-1"
                    value={grade}
                    {...register("grades")}
                  />
                  <Label
                    htmlFor={grade}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {grade}
                  </Label>
                </div>
              ))}
            </div>

            <div>
              <h2>Category</h2>
              {CATEGORIES.map((category) => (
                <div key={category}>
                  <Checkbox
                    id={category}
                    className="my-1 mr-1"
                    {...register("category")}
                  />
                  <Label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>

            <div>
              <h2>Keywords</h2>
              <MultiSelect
                options={KEYWORD_GROUPS}
                onValueChange={setSelectedKeywords}
                defaultValue={selectedKeywords}
                placeholder="Select keywords"
                variant="inverted"
                animation={2}
                maxCount={72}
                {...register("keywords")}
              />
            </div>

            <div>
              <Label htmlFor="cost">Cost</Label>
              <Input
                id="cost"
                type="number"
                placeholder="Type here..."
                min="0"
                {...register("cost")}
              />
            </div>

            <div>
              <Label htmlFor="service-type">Service Type</Label>
              <Select id="service-type" {...register("serviceType")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Service Type</SelectLabel>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="residency">Residency</SelectItem>
                    <SelectItem value="workshop-&-performance">
                      Workshop & Performance
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="length">Length</Label>
              <Select id="length" {...register("length")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Length</SelectLabel>
                    <SelectItem value="30-44-min">30 - 44 min</SelectItem>
                    <SelectItem value="45-59-min">45 - 59 min</SelectItem>
                    <SelectItem value="60-89-min">60 - 89 min</SelectItem>
                    <SelectItem value="90-199-min">90 - 119 min</SelectItem>
                    <SelectItem value="120+min">120+ min</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="performers">Performers</Label>
              <Input
                id="performers"
                type="number"
                placeholder="Type here..."
                min="0"
                {...register("performers")}
              />
            </div>

            <div>
              <Label htmlFor="cost-details">Cost Details</Label>
              <Textarea
                id="cost-details"
                placeholder="Type here..."
                className="min-h-40"
                {...register("costDetails")}
              />
            </div>

            <Button className="w-full" size="lg" type="submit">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProgramPage;
