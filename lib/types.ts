// lib/types.ts
export interface Student {
  name: string;
  grade: number;
  events: string[];
  placements?: Record<string, number>;
  years?: number;
}


export type Roster = Record<string, string[]>; // event -> assigned names
