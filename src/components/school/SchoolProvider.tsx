import { useCallback, useEffect, useState, type ReactNode } from "react";
import { applySchoolColours, readStoredSchool, SchoolContext, storeSchool, type School } from "@/lib/school";

/** Remembers the school a student arrived from for the rest of their visit. */
export function SchoolProvider({ children }: { children: ReactNode }) {
  const [school, setSchoolState] = useState<School | null>(null);

  useEffect(() => {
    const stored = readStoredSchool();
    if (stored) setSchoolState(stored);
  }, []);

  useEffect(() => {
    applySchoolColours(school?.colours ?? null);
  }, [school]);

  const setSchool = useCallback((next: School | null) => {
    storeSchool(next);
    setSchoolState(next);
  }, []);

  return <SchoolContext.Provider value={{ school, setSchool }}>{children}</SchoolContext.Provider>;
}
