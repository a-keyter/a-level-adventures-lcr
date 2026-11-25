import { createContext, useContext } from "react";
import { SUBJECTS, type Subject } from "@/data/subjects";

export type SchoolColours = {
  primary?: string;
  accent?: string;
  highlight?: string;
  background?: string;
};

export type School = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  colours: SchoolColours;
  logo_url: string | null;
  subjects: string[];
};

export const COLOUR_KEYS = ["primary", "accent", "highlight", "background"] as const;

const STORAGE_KEY = "ala-school";

export function readStoredSchool(): School | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as School) : null;
  } catch {
    return null;
  }
}

export function storeSchool(school: School | null) {
  try {
    if (school) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(school));
    else window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
}

/** Only accept plain hex colours so stored values can't inject CSS. */
export function safeColour(value: unknown): string | undefined {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : undefined;
}

export function applySchoolColours(colours: SchoolColours | null) {
  const root = document.documentElement;
  for (const key of COLOUR_KEYS) {
    const value = colours ? safeColour(colours[key]) : undefined;
    if (value) root.style.setProperty(`--${key}`, value);
    else root.style.removeProperty(`--${key}`);
  }
}

/** Subjects the school offers; an empty list means every subject. */
export function subjectsForSchool(school: School | null): Subject[] {
  if (!school || school.subjects.length === 0) return SUBJECTS;
  const allowed = new Set(school.subjects);
  return SUBJECTS.filter((subject) => allowed.has(subject.name));
}

export const SchoolContext = createContext<{
  school: School | null;
  setSchool: (school: School | null) => void;
}>({ school: null, setSchool: () => {} });

export function useSchool() {
  return useContext(SchoolContext);
}
