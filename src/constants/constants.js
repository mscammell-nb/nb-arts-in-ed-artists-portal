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
