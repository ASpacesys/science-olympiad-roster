import { Student, Roster } from "./types";

// weights
const PLACEMENT_WEIGHT = 0.7;
const YEARS_WEIGHT = 0.3;

export function assignRoster(
  students: Student[],
  prefilled: Roster,
  eventSlots: Record<string, number>
): Roster {
  const roster: Roster = { ...prefilled };
  const assignedStudents = new Set<string>();

  const countSeniors = () =>
    Array.from(assignedStudents).filter(
      (name) => students.find((s) => s.name === name)?.grade === 12
    ).length;

  for (const [event, slots] of Object.entries(eventSlots)) {
    if (!roster[event]) roster[event] = [];

    while (roster[event].length < slots) {
      // filter available students
      const available = students.filter((s) => {
        if (assignedStudents.has(s.name)) return false;
        if (assignedStudents.size >= 15) return false;
        if (s.grade === 12 && countSeniors() >= 7) return false;
        return true;
      });

      if (available.length === 0) break;

      // rank by weighted score
      available.sort((a, b) => {
        const aPlacement = a.placements[event] ?? 100; // 100 if never competed
        const bPlacement = b.placements[event] ?? 100;

        const aScore = PLACEMENT_WEIGHT * aPlacement + YEARS_WEIGHT * (10 - a.years);
        const bScore = PLACEMENT_WEIGHT * bPlacement + YEARS_WEIGHT * (10 - b.years);

        return aScore - bScore;
      });

      const best = available[0];
      roster[event].push(best.name);
      assignedStudents.add(best.name);
    }
  }

  return roster;
}
