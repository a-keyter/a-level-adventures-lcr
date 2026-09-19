export type ProjectIdea = {
  title: string;
  strapline: string;
  sector: string;
  summary: string;
  whyItMatters: string;
  subjectLinks: { subject: string; contribution: string }[];
  researchQuestions: string[];
  whereThisCouldLead: {
    degrees: string[];
    apprenticeships: string[];
    careers: string[];
    localEmployers: string[];
  };
};

export type ProjectPlan = {
  title: string;
  overview: string;
  aim: string;
  researchQuestions: string[];
  localPartners: {
    name: string;
    kind: string;
    whyRelevant: string;
    howToApproach: string;
  }[];
  outreachMessage: string;
  weeklyCommitment: string;
  timeline: {
    week: string;
    focus: string;
    tasks: string[];
    meeting: string;
  }[];
  teamRoles: { role: string; responsibilities: string }[];
  ethicsAndSafety: string[];
  whatDoneLooksLike: string[];
  sharingYourFindings: string[];
  keepingItManageable: string[];
};
