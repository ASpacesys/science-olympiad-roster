export type Student = {
  name: string;
  grade: number; // 9–12
  events: string[]; // events they can do
  placements: Record<string, number>; // event -> best past placement (lower is better)
  years: number; // years in SciOly
};

export type Roster = Record<string, string[]>; // event -> assigned names
