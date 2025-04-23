import { SelectItem } from "@/components/ui/select";

export const FISCAL_YEAR_FIRST_MONTH = 6; // June

export const MIN_INPUT_LENGTH = 8;
export const MIN_TEXTAREA_LENGTH = 15;
export const MAX_COST_LENGTH = 100;

export const TICKET_VENDOR = "Ticket Vendor";
export const TICKET_VENDOR_EXCEPTION_FILES = [
  "OSPRA 102",
  "OSPRA 104",
  "Insurance Specifications",
];

export const TICKET_VENDOR_EXCEPTION_SIDEBAR = [
  "Artist Registrations",
  "Artist Evaluations",
];

export const PERFORMERS_EDITABLE_FIELDS = new Map([
  ["firstName", { field: 11, type: "string", options: [] }],
  ["middleInitial", { field: 23, type: "string", options: [] }],
  ["lastName", { field: 8, type: "string", options: [] }],
  ["stageName", { field: 22, type: "string", options: [] }],
]);

export const EVALUATIONS_EDITABLE_FIELDS = new Map([
  [
    "servicePerformed",
    {
      field: 13,
      type: "boolean",
      options: [
        <SelectItem value={true} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={false} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  ["approverName", { field: 14, type: "string", options: [] }],
  [
    "guideUsed",
    {
      field: 15,
      type: "boolean",
      options: [
        <SelectItem value={true} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={false} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  [
    "studentsAttentive",
    {
      field: 16,
      type: "boolean",
      options: [
        <SelectItem value={true} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={false} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  [
    "equipmentUsed",
    {
      field: 20,
      type: "boolean",
      options: [
        <SelectItem value={true} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={false} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  [
    "onSchedule",
    {
      field: 21,
      type: "boolean",
      options: [
        <SelectItem value={true} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={false} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  [
    "studentConduct",
    {
      field: 17,
      type: "boolean",
      options: [
        <SelectItem value={true} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={false} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  [
    "teacherRemained",
    {
      field: 18,
      type: "boolean",
      options: [
        <SelectItem value={true} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={false} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  [
    "spaceSetUp",
    {
      field: 19,
      type: "boolean",
      options: [
        <SelectItem value={true} key={"active"}>
          Yes
        </SelectItem>,
        <SelectItem value={false} key={"inactive"}>
          No
        </SelectItem>,
      ],
    },
  ],
  [
    "additionalComments",
    {
      field: 22,
      type: "string",
      options: [],
    },
  ],
]);

export const STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export const VALID_WEBSITE_URL_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+)(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?$/;

export const GRADES = [
  "PK",
  "K",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

export const PROGRAM_LENGTHS = [
  "30 - 44 min",
  "45 - 59 min",
  "60 - 89 min",
  "90 - 119 min",
  "120+ min",
];

export const CATEGORIES = [
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

export const KEYWORD_GROUPS = [
  {
    heading: "Academics (other than the Arts)",
    options: [
      { value: "Consumer Science", label: "Consumer Science" },
      { value: "Study Skills", label: "Study Skills" },
      { value: "Career Development", label: "Career Development" },
      { value: "Health", label: "Health" },
      {
        value: "Languages Other Than English",
        label: "Languages Other Than English",
      },
      { value: "Math", label: "Math" },
      { value: "Science", label: "Science" },
      { value: "Social Studies / History", label: "Social Studies / History" },
      { value: "Technology", label: "Technology" },
      { value: "Common Core", label: "Common Core" },
      { value: "STEM / STEAM", label: "STEM / STEAM" },
    ],
  },
  {
    heading: "Art",
    options: [
      { value: "Media Art", label: "Media Art" },
      { value: "Visual Art", label: "Visual Art" },
      { value: "Art Instruction", label: "Art Instruction" },
    ],
  },
  {
    heading: "Music",
    options: [
      {
        value: "Accompanist for Music/Dance Students",
        label: "Accompanist for Music/Dance Students",
      },
      { value: "Clinician", label: "Clinician" },
      { value: "Conductor", label: "Conductor" },
      { value: "Instrumental Music", label: "Instrumental Music" },
      { value: "Vocal Music", label: "Vocal Music" },
      { value: "Music Instruction", label: "Music Instruction" },
      { value: "Music Performance", label: "Music Performance" },
      { value: "Composer", label: "Composer" },
    ],
  },
  {
    heading: "School Play / Drama",
    options: [
      {
        value: "Accompanist for School Play/Drama",
        label: "Accompanist for School Play/Drama",
      },
      { value: "Choreographer", label: "Choreographer" },
      { value: "Costume Designer", label: "Costume Designer" },
      { value: "Music Director", label: "Music Director" },
      {
        value: "Set, Lighting, Sound Designer",
        label: "Set, Lighting, Sound Designer",
      },
    ],
  },
  {
    heading: "Youth Safety",
    options: [
      { value: "Anti-Bullying", label: "Anti-Bullying" },
      { value: "Conflict Resolution", label: "Conflict Resolution" },
      { value: "Cyber-Bullying", label: "Cyber-Bullying" },
      {
        value: "Suicide Prevention / Depression",
        label: "Suicide Prevention / Depression",
      },
      {
        value: "Alcohol / Vaping / Controlled Substance Abuse",
        label: "Alcohol / Vaping / Controlled Substance Abuse",
      },
      { value: "Driver Safety", label: "Driver Safety" },
      {
        value: "Internet Safety / Social Media",
        label: "Internet Safety / Social Media",
      },
      { value: "Peer Pressure", label: "Peer Pressure" },
      { value: "Sex Education", label: "Sex Education" },
      { value: "Stranger Danger", label: "Stranger Danger" },
      { value: "Fire Safety", label: "Fire Safety" },
      {
        value: "Alcohol/Controlled Substance Abuse",
        label: "Alcohol/Controlled Substance Abuse",
      },
      { value: "Mental Health", label: "Mental Health" },
    ],
  },
  {
    heading: "Character Education",
    options: [
      { value: "Anger Management", label: "Anger Management" },
      { value: "Empowerment", label: "Empowerment" },
      { value: "Motivation", label: "Motivation" },
      {
        value: "Self-Esteem / Self-Control",
        label: "Self-Esteem / Self-Control",
      },
      { value: "Citizenship", label: "Citizenship" },
      { value: "Emotional Well Being", label: "Emotional Well Being" },
      { value: "Dignity Act", label: "Dignity Act" },
      { value: "Self Control", label: "Self Control" },
      { value: "Team Building", label: "Team Building" },
      { value: "Character Education", label: "Character Education" },
    ],
  },
  {
    heading: "Literature",
    options: [
      { value: "Literacy", label: "Literacy" },
      { value: "Poetry", label: "Poetry" },
      { value: "Reading", label: "Reading" },
      { value: "Writing", label: "Writing" },
      {
        value: "English Language Arts (ELA)",
        label: "English Language Arts (ELA)",
      },
    ],
  },
  {
    heading: "Author Visits",
    options: [
      { value: "Storyteller", label: "Storyteller" },
      { value: "Writer (also Poet)", label: "Writer (also Poet)" },
      { value: "Illustrator", label: "Illustrator" },
    ],
  },
  {
    heading: "Topical",
    options: [
      { value: "American Indian", label: "American Indian" },
      { value: "Black History", label: "Black History" },
      { value: "Cultural Diversity", label: "Cultural Diversity" },
      { value: "Hispanic Heritage", label: "Hispanic Heritage" },
      { value: "Holiday", label: "Holiday" },
      { value: "Holocaust", label: "Holocaust" },
      { value: "Women's History", label: "Women's History" },
      { value: "American History", label: "American History" },
      { value: "Biographical", label: "Biographical" },
      { value: "Environment", label: "Environment" },
    ],
  },
  {
    heading: "Dance",
    options: [
      { value: "Dance Instruction", label: "Dance Instruction" },
      { value: "Dance Performance", label: "Dance Performance" },
    ],
  },
  {
    heading: "Theater",
    options: [
      { value: "Theater Instruction", label: "Theater Instruction" },
      { value: "Theater Performance", label: "Theater Performance" },
    ],
  },
];

export const CATEGORY_DEFINITIONS = [
  {
    title: "DANCE",
    content: "Ballet, Ethnic, Folk, History, Modern, Tap, Country",
  },
  {
    title: "MEDIA ARTS",
    content:
      "Works that explore the technological, aesthetical, and communicative potential of electronic means such as video, internet, streaming, computer, software, gaming, mobile devices and applications, code, GPS, sound production devices, robotics, and other evolving and emerging tools under development.",
  },
  {
    title: "MUSIC",
    content:
      "Ethnic, Folk, History, Instrumental, Jazz, Modern, Electronic, Opera, Musical Theatre, Vocal, Magic",
  },
  {
    title: "THEATRE",
    content:
      "Circus Art, History, Improvisation, Musical Theatre, Puppets & Mime, Comedy",
  },
  {
    title: "VISUAL ARTS",
    content:
      "Bookmaking, Crafts, Environmental Arts, Fashion Design, History, Murals & Portraiture, Photography, Sculpture, Game Show, Holography, Book Illustration",
  },
  {
    title: "LITERATURE",
    content:
      "Authors, Creative Writing, Fiction, Illustrator, Journalism, Magic, Poetry, Storytelling",
  },
  {
    title: "PROFESSIONAL DEVELOPMENT",
    content:
      "Any lecture, program, presentation, demonstration, workshop, etc. which is designed for teachers and/or administrators and which DOES directly support the Arts in Education Standards / Curriculum.",
  },
  {
    title: "EXPLORATORY ENRICHMENT",
    content:
      "Character Education (includes Anti-Bullying), Math, Science, Technology, Social Studies, English Language Arts, Health and Careers",
  },
];

export const SERVICE_TYPE_DEFINITIONS = [
  {
    title: "Performance",
    id: 3,
    content:
      "Generally regarded as an assembly program because it is designed for a large group of students with no or minimal student participation in the 'on-stage' activities, a Performance can be presented in any art form (music, dance, theater, pantomime, storytelling, etc.) or combination of art forms.",
  },
  {
    title: "Workshop",
    id: 1,
    content:
      "A Workshop is an interactive session with the artist or artists, involving hands-on work with the students. A workshop is generally a single session in a classroom or other small-group setting. The goal of a workshop can be to make something together (hands-on) or can be an opportunity for the artist to describe his/her work in great detail (less hands-on). Workshops are an excellent alternative to assembly programs because they involve students with artists in a 'close-up' setting. Note: Multiple workshops within a school need not be with the same group of students, but workshops within a Residency must be with the same students.",
  },
  {
    title: "Workshop & Performance",
    id: 5,
    content:
      "A Workshop & Performance must include at least one workshop and one performance, but should not be confused with a Residency which takes place over a minimum of five days with the same group of students.",
  },
  {
    title: "Residency",
    id: 4,
    content:
      "A residency is a series of workshops over a period of five days or more which might include one or more performances. It is important that a residency include sequential visits to the same group(s) of students by the artist(s). Residencies generally take place in a classroom, a dance studio, or art gallery, etc. Residency artists work directly with the students to produce a final product (concert, performance, mural, theater piece, etc.).",
  },
  {
    title: "Any In School Program",
    id: 2,
    content:
      "Any In School Program is a program that takes place at a school location",
  },
  {
    title: "Ticket Vendor",
    id: 6,
    content:
      "A Ticket Vendor is a program that is a ticket vendor for a performance or event.",
  },
  {
    title: "Field Trip",
    id: 7,
    content:
      "A Field Trip is a program that takes place at a location other than a school",
  },
];

export const PROGRAMS_EDITABLE_FIELDS = new Map([
  ["program", { field: 11, type: "string", options: [] }],
  ["description", { field: 12, type: "string", options: [] }],
  [
    "keywords",
    {
      field: 20,
      type: "list",
      options: KEYWORD_GROUPS.flatMap((group) =>
        group.options.map((option) => option.label),
      ),
    },
  ],
  [
    "category",
    {
      field: 22,
      type: "list",
      options: CATEGORIES,
    },
  ],
  ["length", { field: 26, type: "select", options: PROGRAM_LENGTHS }],
  [
    "grades",
    {
      field: 27,
      type: "list",
      options: GRADES,
    },
  ],
  [
    "serviceType",
    {
      field: 23,
      type: "select",
      options: SERVICE_TYPE_DEFINITIONS.map((type) => type.title),
    },
  ],
  ["cost", { field: 25, type: "integer", options: [{ min: 1, max: 2000 }] }],
  ["costDetails", { field: 29, type: "string", options: [] }],
  [
    "performers",
    { field: 30, type: "integer", options: [{ min: 1, max: 100 }] },
  ],
]);
