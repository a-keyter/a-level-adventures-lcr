export type Subject = {
  name: string;
  group: string;
};

/**
 * A curated list of A levels commonly offered across Liverpool City Region
 * colleges and sixth forms.
 */
export const SUBJECTS: Subject[] = [
  { name: "Mathematics", group: "Maths & Computing" },
  { name: "Further Mathematics", group: "Maths & Computing" },
  { name: "Statistics", group: "Maths & Computing" },
  { name: "Computer Science", group: "Maths & Computing" },

  { name: "Biology", group: "Sciences" },
  { name: "Chemistry", group: "Sciences" },
  { name: "Physics", group: "Sciences" },
  { name: "Applied Science", group: "Sciences" },
  { name: "Environmental Science", group: "Sciences" },
  { name: "Psychology", group: "Sciences" },

  { name: "Engineering", group: "Technical & Applied" },
  { name: "Design & Technology (Product Design)", group: "Technical & Applied" },
  { name: "Health & Social Care", group: "Technical & Applied" },
  { name: "Construction & the Built Environment", group: "Technical & Applied" },

  { name: "Business Studies", group: "Business & Economics" },
  { name: "Economics", group: "Business & Economics" },
  { name: "Accounting", group: "Business & Economics" },
  { name: "Law", group: "Business & Economics" },

  { name: "Geography", group: "Humanities & Social Sciences" },
  { name: "History", group: "Humanities & Social Sciences" },
  { name: "Politics", group: "Humanities & Social Sciences" },
  { name: "Sociology", group: "Humanities & Social Sciences" },
  { name: "Philosophy", group: "Humanities & Social Sciences" },
  { name: "Religious Studies", group: "Humanities & Social Sciences" },
  { name: "Criminology", group: "Humanities & Social Sciences" },

  { name: "English Language", group: "English & Languages" },
  { name: "English Literature", group: "English & Languages" },
  { name: "English Language & Literature", group: "English & Languages" },
  { name: "French", group: "English & Languages" },
  { name: "Spanish", group: "English & Languages" },
  { name: "German", group: "English & Languages" },
  { name: "Chinese (Mandarin)", group: "English & Languages" },

  { name: "Art & Design (Fine Art)", group: "Creative & Performing" },
  { name: "Graphic Communication", group: "Creative & Performing" },
  { name: "Photography", group: "Creative & Performing" },
  { name: "Textile Design", group: "Creative & Performing" },
  { name: "Film Studies", group: "Creative & Performing" },
  { name: "Media Studies", group: "Creative & Performing" },
  { name: "Music", group: "Creative & Performing" },
  { name: "Music Technology", group: "Creative & Performing" },
  { name: "Drama & Theatre", group: "Creative & Performing" },
  { name: "Dance", group: "Creative & Performing" },

  { name: "Physical Education", group: "Sport & Wellbeing" },
  { name: "Sport & Exercise Science", group: "Sport & Wellbeing" },
  { name: "Food Science & Nutrition", group: "Sport & Wellbeing" },
];

export const SUBJECT_NAMES = SUBJECTS.map((subject) => subject.name);

export const SUBJECT_GROUPS = Array.from(new Set(SUBJECTS.map((s) => s.group)));

export function comboKey(subjects: string[]): string {
  return [...subjects]
    .map((s) => s.trim().toLowerCase())
    .sort()
    .join("|");
}
