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

export const GRADES = ["PK", "K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
    content:
      "Generally regarded as an assembly program because it is designed for a large group of students with no or minimal student participation in the 'on-stage' activities, a Performance can be presented in any art form (music, dance, theater, pantomime, storytelling, etc.) or combination of art forms.",
  },
  {
    title: "Workshop",
    content:
      "A Workshop is an interactive session with the artist or artists, involving hands-on work with the students. A workshop is generally a single session in a classroom or other small-group setting. The goal of a workshop can be to make something together (hands-on) or can be an opportunity for the artist to describe his/her work in great detail (less hands-on). Workshops are an excellent alternative to assembly programs because they involve students with artists in a 'close-up' setting. Note: Multiple workshops within a school need not be with the same group of students, but workshops within a Residency must be with the same students.",
  },
  {
    title: "Workshop & Performance",
    content:
      "A Workshop & Performance must include at least one workshop and one performance, but should not be confused with a Residency which takes place over a minimum of five days with the same group of students.",
  },
  {
    title: "Residency",
    content:
      "A residency is a series of workshops over a period of five days or more which might include one or more performances. It is important that a residency include sequential visits to the same group(s) of students by the artist(s). Residencies generally take place in a classroom, a dance studio, or art gallery, etc. Residency artists work directly with the students to produce a final product (concert, performance, mural, theater piece, etc.).",
  },
];

export const PROGRAMS_EDITABLE_FIELDS = new Map([
  ["program", { field: 11, type: "string", options: [] }],
  ["description", { field: 12, type: "string", options: [] }],
  ["keywords", { field: 20, type: "list", options: [] }],
  [
    "category",
    {
      field: 22,
      type: "string",
      options: CATEGORIES,
    },
  ],
  ["length", { field: 26, type: "select", options: PROGRAM_LENGTHS }],
  ["grades", { field: 27, type: "list", options: GRADES }],
  [
    "serviceType",
    {
      field: 34,
      type: "select",
      options: SERVICE_TYPE_DEFINITIONS.map((type) => type.title),
    },
  ],
  ["cost", { field: 25, type: "integer", options: [">0"] }],
  ["costDetails", { field: 29, type: "string", options: [] }],
  [
    "performers",
    { field: 30, type: "integer", options: [">0", "<100", "<totalPerformers"] },
  ],
]);
