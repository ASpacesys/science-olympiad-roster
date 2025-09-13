import { NextResponse } from "next/server";

interface Student {
  name: string;
  grade: number;
  events: string[];
  placements?: Record<string, number>;
  years?: number;
}

interface EventProfile {
  bio: number;
  chem: number;
  build: number;
  misc: number;
}

const eventProfiles: Record<string, EventProfile> = {
  "Anatomy & Physiology": { bio: 1, chem: 0, build: 0, misc: 0 },
  "Designer Genes": { bio: 1, chem: 0, build: 0, misc: 0 },
  "Entomology": { bio: 0.75, chem: 0, build: 0, misc: 0.25 },
  "Disease Detectives": { bio: 0.8, chem: 0.2, build: 0, misc: 0 },
  "Chemistry Lab": { bio: 0, chem: 1, build: 0, misc: 0 },
  "Water Quality": { bio: 0.5, chem: 0.5, build: 0, misc: 0 },
  "Materials Science": { bio: 0, chem: 0.6, build: 0.2, misc: 0.2 },
  "Astronomy": { bio: 0, chem: 0.2, build: 0.2, misc: 0.6 },
  "Dynamic Planet": { bio: 0.2, chem: 0.2, build: 0, misc: 0.6 },
  "Circuit Lab": { bio: 0, chem: 0.2, build: 0.6, misc: 0.2 },
  "Hovercraft": { bio: 0, chem: 0, build: 1, misc: 0 },
  "Machines": { bio: 0, chem: 0, build: 0.65, misc: 0.35 },
  "Bungee Drop": { bio: 0, chem: 0, build: 1, misc: 0 },
  "Boomilever": { bio: 0, chem: 0, build: 1, misc: 0 },
  "Electric Vehicle": { bio: 0, chem: 0, build: 1, misc: 0 },
  "Robot Tour": { bio: 0, chem: 0, build: 1, misc: 0 },
  "Helicopter": { bio: 0, chem: 0, build: 1, misc: 0 },
  "Engineering CAD": { bio: 0, chem: 0, build: 0, misc: 1 },
  "Codebusters": { bio: 0, chem: 0, build: 0, misc: 1 },
  "Experimental Design": { bio: 0.25, chem: 0.25, build: 0.25, misc: 0.25 },
  "Forensics": { bio: 0.3, chem: 0.5, build: 0, misc: 0.2 },
  "Remote Sensing": { bio: 0, chem: 0.2, build: 0, misc: 0.5 },
  "Rocks and Minerals": { bio: 0, chem: 0.3, build: 0, misc: 0.7 },
};

function similarity(p1: EventProfile, p2: EventProfile): number {
  return p1.bio * p2.bio + p1.chem * p2.chem + p1.build * p2.build + p1.misc * p2.misc;
}

// Penalty/bonus function
function eventCountScore(count: number): number {
  if (count < 3) return -100;   // strongly penalize <3 events
  if (count === 3) return 1000; // preferred
  if (count === 4) return 0;    // okay if necessary
  return -100;                   // heavily penalize >4
}

export async function POST(req: Request) {
  try {
    const { students, prefilled } = await req.json();
    const TEAM_SIZE = 15;
    const MAX_SENIORS = 7;
    const MAX_EVENTS = 4;

    const allEvents = Object.keys(eventProfiles);
    const eventSlots: Record<string, number> = {};
    allEvents.forEach(e => (eventSlots[e] = e === "Codebusters" || e === "Experimental Design" ? 3 : 2));

    const roster: Record<string, string[]> = {};
    allEvents.forEach(e => (roster[e] = prefilled?.[e]?.slice(0, eventSlots[e]) || Array(eventSlots[e]).fill("")));

    const studentEventCounts: Record<string, number> = {};

    const studentProfiles: Record<string, EventProfile> = {};
    // Track which blocks each student is assigned to

    // Map events to their block numbers
    const eventBlocks: Record<string, number> = {
      "Anatomy & Physiology": 1,
      "Forensics": 1,
      "Bungee Drop": 1,
      "Engineering CAD": 1,
      "Disease Detectives": 2,
      "Remote Sensing": 2,
      "Electric Vehicle": 2,
      "Codebusters": 2,
      "Entomology": 3,
      "Astronomy": 3,
      "Helicopter": 3,
      "Experimental Design": 3,
      "Hovercraft": 4,
      "Machines": 4,
      "Chemistry Lab": 4,
      "Water Quality": 5,
      "Dynamic Planet": 5,
      "Circuit Lab": 5,
      "Robot Tour": 5,
      "Designer Genes": 6,
      "Rocks and Minerals": 6,
      "Materials Science": 6,
      "Boomilever": 6
    };

    const studentBlocks: Record<string, Set<number>> = {};
    students.forEach((s: Student) => studentBlocks[s.name] = new Set());

    // Initialize studentBlocks for prefilled entries
    for (const [event, names] of Object.entries(roster)) {
      const blockNumber = eventBlocks[event];
      names.forEach(name => {
        if (!name) return;
        if (!studentBlocks[name]) studentBlocks[name] = new Set();
        studentBlocks[name].add(blockNumber);
        // Also increment their event count
        if (!studentEventCounts[name]) studentEventCounts[name] = 0;
        studentEventCounts[name]++;
      });
    }


    const assignedStudents = new Set<string>();
    // Add all students already in the prefilled roster to assignedStudents
    Object.values(roster).forEach(eventArr => {
        eventArr.forEach(name => {
            if (name) assignedStudents.add(name);
        });
    });



    let assignedSeniors = 0;

    students.forEach((s: Student) => {
      studentEventCounts[s.name] = 0;
      studentProfiles[s.name] = { bio: 0, chem: 0, build: 0, misc: 0 };
    });

    // PHASE 1: Assign events using placement first, ensuring everyone gets at least 3 events
    const phase1Limit = 3;
    let phase1Complete = false;
    while (!phase1Complete) {
      const options: { student: Student; event: string; score: number }[] = [];

      students.forEach((s: Student) => {
        if (studentEventCounts[s.name] >= phase1Limit) return;
        if (!assignedStudents.has(s.name) && assignedStudents.size >= TEAM_SIZE) return;
        if (s.grade === 12 && !assignedStudents.has(s.name) && assignedSeniors >= MAX_SENIORS) return;

        allEvents.forEach(e => {
         const blockNumber = eventBlocks[e];
	 if (!roster[e].includes("")) return;          // no open slot
	 if (roster[e].includes(s.name)) return;      // already assigned to this event
	 if (studentBlocks[s.name].has(blockNumber)) return; // already has an event in this block

	  const placementScore = s.placements?.[e] !== undefined ? 10 - s.placements[e] : 0;
	  const skillScore = similarity(studentProfiles[s.name], eventProfiles[e]);
	  const countScore = eventCountScore(studentEventCounts[s.name]);

	  // FIX: allow skillScore to assign students to events even if no placement exists
	  const score = placementScore > 0 ? placementScore * 5 + countScore : skillScore * 10 + countScore;

	  options.push({ student: s, event: e, score });

        });
      });

      if (options.length === 0) {
        phase1Complete = true;
        break;
      }

      options.sort((a, b) => b.score - a.score);
      const best = options[0];

	roster[best.event][roster[best.event].indexOf("")] = best.student.name;
	studentEventCounts[best.student.name]++;
	const blockNumber = eventBlocks[best.event];
	studentBlocks[best.student.name].add(blockNumber);  // mark block as used

      const ep = eventProfiles[best.event];
      const count = studentEventCounts[best.student.name];
      studentProfiles[best.student.name] = {
        bio: (studentProfiles[best.student.name].bio * (count - 1) + ep.bio) / count,
        chem: (studentProfiles[best.student.name].chem * (count - 1) + ep.chem) / count,
        build: (studentProfiles[best.student.name].build * (count - 1) + ep.build) / count,
        misc: (studentProfiles[best.student.name].misc * (count - 1) + ep.misc) / count,
      };

      assignedStudents.add(best.student.name);
      if (best.student.grade === 12) assignedSeniors++;
    }

    // PHASE 2: Fill remaining slots, allow 4 events if necessary
    while (true) {
      const options: { student: Student; event: string; score: number }[] = [];

      students.forEach((s: Student) => {
        if (studentEventCounts[s.name] >= MAX_EVENTS) return;
        if (!assignedStudents.has(s.name) && assignedStudents.size >= TEAM_SIZE) return;
        if (s.grade === 12 && !assignedStudents.has(s.name) && assignedSeniors >= MAX_SENIORS) return;

        allEvents.forEach(e => {
	 const blockNumber = eventBlocks[e];
	 if (!roster[e].includes("")) return;          // no open slot
	 if (roster[e].includes(s.name)) return;      // already assigned to this event
	 if (studentBlocks[s.name].has(blockNumber)) return; // already has an event in this block


	  const placementScore = s.placements?.[e] !== undefined ? 10 - s.placements[e] : 0;
	  const skillScore = similarity(studentProfiles[s.name], eventProfiles[e]);
	  const countScore = eventCountScore(studentEventCounts[s.name]);

	  // FIX: allow skillScore to assign students to events even if no placement exists
	  const score = placementScore > 0 ? placementScore * 5 + countScore : skillScore * 10 + countScore;

	  options.push({ student: s, event: e, score });

        });
      });

      if (options.length === 0) break;

      options.sort((a, b) => b.score - a.score);
      const best = options[0];

	roster[best.event][roster[best.event].indexOf("")] = best.student.name;
	studentEventCounts[best.student.name]++;
	const blockNumber = eventBlocks[best.event];
	studentBlocks[best.student.name].add(blockNumber);  // mark block as used

      const ep = eventProfiles[best.event];
      const count = studentEventCounts[best.student.name];
      studentProfiles[best.student.name] = {
        bio: (studentProfiles[best.student.name].bio * (count - 1) + ep.bio) / count,
        chem: (studentProfiles[best.student.name].chem * (count - 1) + ep.chem) / count,
        build: (studentProfiles[best.student.name].build * (count - 1) + ep.build) / count,
        misc: (studentProfiles[best.student.name].misc * (count - 1) + ep.misc) / count,
      };

      assignedStudents.add(best.student.name);
      if (best.student.grade === 12) assignedSeniors++;
    }

    return NextResponse.json({ roster, studentEventCounts });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ roster: {} });
  }
}
