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

const MIN_INPUT_LENGTH = 8;
const MIN_TEXTAREA_LENGTH = 15;

const NewProgramPage = () => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  // This object handles the fields of the form that don't work well with React Hook Form's validation.
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    location: null,
    grades: [],
    categories: [],
    cost: 0,
    serviceType: null,
    lenght: null,
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
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // for (const key in formErrors) {
    //   setFormErrors((prev) => ({
    //     ...prev,
    //     [key]: { isTriggered: false, message: "" },
    //   }));
    // }

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
          message: `Cost must be a positive number`,
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

    if (formValues.lenght === null) {
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

    if (isError) return;

    console.log("data submitted :D");
  };

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
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  value="in-school"
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
                  value="out-of-school"
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
              {GRADES.map((grade) => (
                <div key={grade}>
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
                  <Label
                    htmlFor={grade}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {grade}
                  </Label>
                </div>
              ))}
              {formErrors.gradesError.isTriggered && (
                <p className="text-red-500">{formErrors.gradesError.message}</p>
              )}
            </div>

            <div>
              <h2>
                Category<span className="font-extrabold text-red-500">*</span>
              </h2>
              {CATEGORIES.map((category) => (
                <div key={category}>
                  <Checkbox
                    id={category}
                    className="my-1 mr-1"
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
              <h2>
                Keywords<span className="font-extrabold text-red-500">*</span>
              </h2>
              <MultiSelect
                options={KEYWORD_GROUPS}
                onValueChange={setSelectedKeywords}
                defaultValue={selectedKeywords}
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
              <Select
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
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="residency">Residency</SelectItem>
                    <SelectItem value="workshop-&-performance">
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
                onValueChange={(value) => {
                  setFormValues((prev) => ({ ...prev, lenght: value }));
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
                    <SelectItem value="30-44-min">30 - 44 min</SelectItem>
                    <SelectItem value="45-59-min">45 - 59 min</SelectItem>
                    <SelectItem value="60-89-min">60 - 89 min</SelectItem>
                    <SelectItem value="90-199-min">90 - 119 min</SelectItem>
                    <SelectItem value="120+min">120+ min</SelectItem>
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

                  const isValid = value > 0 && Number.isInteger(value);
                  setFormErrors((prev) => ({
                    ...prev,
                    performersError: {
                      isTriggered: isValid ? false : true,
                      message: isValid
                        ? ""
                        : `Performers must be a positive integer number`,
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
                onChange={(e) => {
                  setFormValues((prev) => ({
                    ...prev,
                    costDetails: e.target.value,
                  }));

                  const isValid =
                    e.target.value.length >= MIN_TEXTAREA_LENGTH ||
                    e.target.value.lenght === 0;
                  setFormErrors((prev) => ({
                    ...prev,
                    costDetailsError: {
                      isTriggered: isValid ? false : true,
                      message: isValid
                        ? ""
                        : `Cost details must be at least ${MIN_TEXTAREA_LENGTH} characters long`,
                    },
                  }));
                }}
              />
              {formErrors.costDetailsError.isTriggered && (
                <p className="text-red-500">
                  {formErrors.costDetailsError.message}
                </p>
              )}
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
