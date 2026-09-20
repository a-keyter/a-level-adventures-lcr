/**
 * Hard-coded mapping between LSIP sector priorities, the roles employers say
 * they need, and the A level subjects that most directly feed each role.
 */
export type SectorRole = {
  title: string;
  level: string;
  what: string;
  subjects: string[];
};

export type LsipSector = {
  id: string;
  name: string;
  short: string;
  blurb: string;
  roles: SectorRole[];
};

export const LSIP_SECTORS: LsipSector[] = [
  {
    id: "digital",
    name: "AI & Digital Transformation",
    short: "AI & Digital",
    blurb:
      "The LSIP's cross-cutting priority: every sector in the city region needs people who can use data and AI tools confidently, safely and ethically.",
    roles: [
      {
        title: "Data analyst",
        level: "Degree or Level 4 apprenticeship",
        what: "Turning messy organisational data into charts, forecasts and decisions people can act on.",
        subjects: [
          "Mathematics",
          "Further Mathematics",
          "Statistics",
          "Computer Science",
          "Economics",
          "Geography",
          "Psychology",
        ],
      },
      {
        title: "Software developer",
        level: "Degree or Level 6 apprenticeship",
        what: "Building and maintaining the web, mobile and internal systems that local employers run on.",
        subjects: ["Computer Science", "Mathematics", "Further Mathematics", "Physics", "Engineering"],
      },
      {
        title: "AI adoption adviser for SMEs",
        level: "Degree plus workplace experience",
        what: "Helping small businesses work out which AI tools genuinely help, and how to use them responsibly.",
        subjects: [
          "Computer Science",
          "Business Studies",
          "Philosophy",
          "Sociology",
          "Economics",
          "English Language",
        ],
      },
      {
        title: "Cyber security technician",
        level: "Level 4 apprenticeship",
        what: "Spotting and closing security weaknesses before someone else finds them.",
        subjects: ["Computer Science", "Mathematics", "Criminology", "Law", "Physics"],
      },
      {
        title: "Digital product designer",
        level: "Degree or portfolio route",
        what: "Designing interfaces and services that people can actually use under pressure.",
        subjects: [
          "Graphic Communication",
          "Art & Design (Fine Art)",
          "Media Studies",
          "Psychology",
          "Computer Science",
          "Design & Technology (Product Design)",
        ],
      },
    ],
  },
  {
    id: "pbs",
    name: "Professional, Business & Financial Services",
    short: "Business & Finance",
    blurb:
      "A central enabling sector for the region, with gaps at Levels 3-5 in leadership, compliance, communication and data confidence.",
    roles: [
      {
        title: "Trainee accountant",
        level: "Level 7 apprenticeship or degree",
        what: "Preparing accounts, advising on tax and keeping organisations financially honest.",
        subjects: ["Accounting", "Mathematics", "Economics", "Business Studies", "Statistics"],
      },
      {
        title: "Solicitor or paralegal",
        level: "Level 7 solicitor apprenticeship or law degree",
        what: "Advising clients, drafting agreements and navigating regulation for local firms.",
        subjects: [
          "Law",
          "English Literature",
          "History",
          "Politics",
          "Philosophy",
          "Criminology",
          "English Language",
        ],
      },
      {
        title: "Insurance and risk analyst",
        level: "Degree or Level 6 apprenticeship",
        what: "Pricing risk for marine, property and commercial clients — a Liverpool trade for two centuries.",
        subjects: ["Mathematics", "Statistics", "Economics", "Geography", "Further Mathematics"],
      },
      {
        title: "Marketing and communications officer",
        level: "Degree or Level 4 apprenticeship",
        what: "Telling an organisation's story clearly across campaigns, press and social channels.",
        subjects: [
          "Media Studies",
          "English Language",
          "Business Studies",
          "Graphic Communication",
          "Sociology",
          "Photography",
        ],
      },
      {
        title: "People and HR adviser",
        level: "Level 5 apprenticeship",
        what: "Recruitment, employment regulation, wellbeing and helping teams progress.",
        subjects: ["Business Studies", "Psychology", "Sociology", "Law", "English Language"],
      },
    ],
  },
  {
    id: "manufacturing",
    name: "Advanced Manufacturing & Clean Energy",
    short: "Manufacturing & Energy",
    blurb:
      "Automation, robotics and low-carbon production are reshaping work at Halewood, Speke and along the Mersey — technician roles are the bottleneck.",
    roles: [
      {
        title: "Maintenance engineering technician",
        level: "Level 3-4 apprenticeship",
        what: "Keeping automated production lines running — mechanical, electrical and digital in one job.",
        subjects: [
          "Engineering",
          "Physics",
          "Mathematics",
          "Design & Technology (Product Design)",
          "Computer Science",
        ],
      },
      {
        title: "Robotics and automation engineer",
        level: "Degree or Level 6 apprenticeship",
        what: "Programming, installing and improving robotic cells on the factory floor.",
        subjects: [
          "Engineering",
          "Computer Science",
          "Physics",
          "Mathematics",
          "Further Mathematics",
        ],
      },
      {
        title: "Process chemist",
        level: "Degree",
        what: "Scaling up chemical processes safely and cleanly for manufacturers across the region.",
        subjects: ["Chemistry", "Applied Science", "Physics", "Mathematics", "Biology"],
      },
      {
        title: "Renewable energy technician",
        level: "Level 3-4 apprenticeship",
        what: "Installing and maintaining offshore wind, tidal and hydrogen infrastructure in the Mersey estuary.",
        subjects: [
          "Physics",
          "Engineering",
          "Environmental Science",
          "Geography",
          "Design & Technology (Product Design)",
        ],
      },
      {
        title: "Quality and compliance officer",
        level: "Level 4 apprenticeship",
        what: "Checking that products and processes meet safety, quality and carbon standards.",
        subjects: [
          "Applied Science",
          "Chemistry",
          "Statistics",
          "Business Studies",
          "Environmental Science",
        ],
      },
    ],
  },
  {
    id: "construction",
    name: "Construction & the Built Environment",
    short: "Construction",
    blurb:
      "Large-scale regeneration, housing and retrofit need site supervision, low-carbon building and digital construction skills.",
    roles: [
      {
        title: "Site supervisor / construction manager",
        level: "Level 4-6 apprenticeship or degree",
        what: "Running a site: sequencing trades, budgets, safety and handover.",
        subjects: [
          "Construction & the Built Environment",
          "Business Studies",
          "Mathematics",
          "Design & Technology (Product Design)",
          "Geography",
        ],
      },
      {
        title: "Architectural technologist",
        level: "Degree or Level 6 apprenticeship",
        what: "Turning designs into buildable, regulation-compliant drawings and models.",
        subjects: [
          "Art & Design (Fine Art)",
          "Design & Technology (Product Design)",
          "Construction & the Built Environment",
          "Mathematics",
          "Physics",
          "Graphic Communication",
        ],
      },
      {
        title: "Retrofit assessor",
        level: "Level 3-4 qualification",
        what: "Surveying older housing stock and specifying insulation, heat pumps and ventilation.",
        subjects: [
          "Environmental Science",
          "Geography",
          "Physics",
          "Construction & the Built Environment",
          "Applied Science",
        ],
      },
      {
        title: "Quantity surveyor",
        level: "Degree or Level 6 apprenticeship",
        what: "Costing and controlling the money side of a construction project.",
        subjects: ["Mathematics", "Economics", "Accounting", "Business Studies", "Statistics"],
      },
      {
        title: "Urban planner",
        level: "Degree",
        what: "Shaping how neighbourhoods, transport and green space fit together across the city region.",
        subjects: ["Geography", "Politics", "Sociology", "History", "Environmental Science"],
      },
    ],
  },
  {
    id: "health",
    name: "Health, Life Science & Care",
    short: "Health & Life Science",
    blurb:
      "Europe's largest biomanufacturing cluster sits beside a huge NHS and care system — laboratory, regulatory and digital health skills are all in demand.",
    roles: [
      {
        title: "Biomedical scientist",
        level: "Degree or Level 6 apprenticeship",
        what: "Running the laboratory tests that diagnose disease and support clinical decisions.",
        subjects: ["Biology", "Chemistry", "Applied Science", "Mathematics", "Physics"],
      },
      {
        title: "Nurse or allied health professional",
        level: "Degree or nursing apprenticeship",
        what: "Frontline clinical care across hospitals, community and mental health services.",
        subjects: [
          "Biology",
          "Health & Social Care",
          "Psychology",
          "Chemistry",
          "Sport & Exercise Science",
          "Physical Education",
        ],
      },
      {
        title: "Clinical trials coordinator",
        level: "Degree",
        what: "Keeping trials compliant, recruited and documented for the region's life science firms.",
        subjects: ["Biology", "Chemistry", "Statistics", "Psychology", "Law"],
      },
      {
        title: "Public health analyst",
        level: "Degree",
        what: "Using data to understand health inequality across the six boroughs and target support.",
        subjects: ["Statistics", "Geography", "Sociology", "Biology", "Mathematics", "Psychology"],
      },
      {
        title: "Nutrition and wellbeing practitioner",
        level: "Degree or Level 4 route",
        what: "Supporting healthier food, activity and recovery in communities and workplaces.",
        subjects: [
          "Food Science & Nutrition",
          "Sport & Exercise Science",
          "Biology",
          "Physical Education",
          "Health & Social Care",
        ],
      },
    ],
  },
  {
    id: "visitor",
    name: "Visitor Economy",
    short: "Visitor Economy",
    blurb:
      "Over 50,000 jobs across hospitality, events, culture and the waterfront — the gap is leadership, experience design and progression.",
    roles: [
      {
        title: "Events producer",
        level: "Degree or Level 4 apprenticeship",
        what: "Planning and delivering festivals, conferences and waterfront events end to end.",
        subjects: [
          "Business Studies",
          "Drama & Theatre",
          "Media Studies",
          "Music",
          "Dance",
          "English Language",
        ],
      },
      {
        title: "Heritage and museum interpreter",
        level: "Degree",
        what: "Researching and presenting the region's maritime and social history to the public.",
        subjects: [
          "History",
          "English Literature",
          "Religious Studies",
          "Sociology",
          "Art & Design (Fine Art)",
          "Philosophy",
        ],
      },
      {
        title: "Hospitality operations manager",
        level: "Level 4-5 apprenticeship",
        what: "Running hotels, venues and restaurants — people, margins and standards.",
        subjects: [
          "Business Studies",
          "Food Science & Nutrition",
          "Economics",
          "Psychology",
          "French",
          "Spanish",
        ],
      },
      {
        title: "Destination marketing officer",
        level: "Degree",
        what: "Selling the city region to visitors, including international markets.",
        subjects: [
          "Media Studies",
          "Photography",
          "French",
          "Spanish",
          "German",
          "Chinese (Mandarin)",
          "Geography",
          "Business Studies",
        ],
      },
      {
        title: "Sustainable tourism officer",
        level: "Degree",
        what: "Balancing visitor growth with carbon, transport and community impact.",
        subjects: ["Geography", "Environmental Science", "Politics", "Sociology", "Economics"],
      },
    ],
  },
  {
    id: "creative",
    name: "Creative Industries",
    short: "Creative",
    blurb:
      "48% local growth against 29% nationally, clustered in the Baltic Triangle: gaming, film, immersive content and music.",
    roles: [
      {
        title: "Games designer or developer",
        level: "Degree or portfolio route",
        what: "Designing and building games and immersive experiences in the region's studios.",
        subjects: [
          "Computer Science",
          "Art & Design (Fine Art)",
          "Graphic Communication",
          "Media Studies",
          "Mathematics",
          "Music Technology",
        ],
      },
      {
        title: "Film and TV production assistant",
        level: "Entry route or degree",
        what: "Supporting shoots across a region that hosts more filming than anywhere outside London.",
        subjects: [
          "Film Studies",
          "Media Studies",
          "Photography",
          "Drama & Theatre",
          "English Literature",
        ],
      },
      {
        title: "Music producer / live sound engineer",
        level: "Level 3-6 or freelance route",
        what: "Recording, mixing and running sound for the region's venues, studios and festivals.",
        subjects: ["Music Technology", "Music", "Physics", "Media Studies", "Computer Science"],
      },
      {
        title: "Content designer and illustrator",
        level: "Degree or portfolio route",
        what: "Making visual work for brands, campaigns and cultural organisations.",
        subjects: [
          "Graphic Communication",
          "Art & Design (Fine Art)",
          "Photography",
          "Textile Design",
          "Media Studies",
        ],
      },
      {
        title: "Performer, choreographer or theatre maker",
        level: "Conservatoire, degree or company route",
        what: "Creating and performing work for the region's stages, companies and community projects.",
        subjects: ["Drama & Theatre", "Dance", "Music", "English Literature", "Physical Education"],
      },
    ],
  },
];

export type SectorOverlap = {
  sector: LsipSector;
  /** Roles that match at least one chosen subject, with the matches attached. */
  matches: { role: SectorRole; subjects: string[] }[];
  /** Total number of subject-to-role overlap points in this sector. */
  points: number;
};

export function computeSectorOverlaps(chosen: string[]): SectorOverlap[] {
  return LSIP_SECTORS.map((sector) => {
    const matches = sector.roles
      .map((role) => ({
        role,
        subjects: chosen.filter((subject) => role.subjects.includes(subject)),
      }))
      .filter((match) => match.subjects.length > 0);
    return {
      sector,
      matches,
      points: matches.reduce((total, match) => total + match.subjects.length, 0),
    };
  });
}
