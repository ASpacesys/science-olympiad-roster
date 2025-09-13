import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { students, prefilled } = await req.json();

    const TEAM_SIZE = 15;
    const MAX_SENIORS = 7;
    const MIN_EVENTS = 3;
    const MAX_EVENTS = 4;

    const allEvents = [
      "Anatomy & Physiology","Forensics","Bungee Drop","Engineering CAD",
      "Disease Detectives","Remote Sensing","Electric Vehicle","Codebusters",
      "Entomology","Astronomy","Helicopter","Experimental Design","Hovercraft",
      "Machines","Chemistry Lab","Water Quality","Dynamic Planet","Circuit Lab",
      "Robot Tour","Designer Genes","Rocks and Minerals","Materials Science","Boomilever"
    ];

    const eventSlots: Record<string, number> = {};
    allEvents.forEach(event => {
      eventSlots[event] = event === "Codebusters" || event === "Experimental Design" ? 3 : 2;
    });

    // Map events to blocks
    const eventBlocks: Record<string, number> = {
      "Anatomy & Physiology":1, "Forensics":1, "Bungee Drop":1, "Engineering CAD":1,
      "Disease Detectives":2, "Remote Sensing":2, "Electric Vehicle":2, "Codebusters":2,
      "Entomology":3, "Astronomy":3, "Helicopter":3, "Experimental Design":3,
      "Hovercraft":4, "Machines":4, "Chemistry Lab":4,
      "Water Quality":5, "Dynamic Planet":5, "Circuit Lab":5, "Robot Tour":5,
      "Designer Genes":6, "Rocks and Minerals":6, "Materials Science":6, "Boomilever":6
    };

    // Initialize roster
    const roster: Record<string, string[]> = {};
    allEvents.forEach(event => {
      roster[event] = prefilled?.[event]?.slice(0, eventSlots[event]) || Array(eventSlots[event]).fill("");
    });

    interface Student {
      name: string;
      grade: number;
      events: string[];
      placements?: Record<string, number>;
      years?: number;
    interface ScoreEntry {
      student: Student;
      event: string;
      score: number;
}
    // Compute scores
    const scores: ScoreEntry[] = [];
    students.forEach(s => {
      allEvents.forEach(e => {
        let score = 0;
        if (s.events.includes(e)) score += 10;
        if (s.placements?.[e] !== undefined) score += 10 - s.placements[e];
        score += s.years || 0;
        scores.push({ student: s, event: e, score });
      });
    });

    scores.sort((a,b) => b.score - a.score);

    // Select top 15 students while respecting senior limit
    const selectedStudents: any[] = [];
    let seniorCount = 0;
    for (const entry of scores) {
      const s = entry.student;
      if (selectedStudents.find(st => st.name === s.name)) continue;
      if (s.grade === 12 && seniorCount >= MAX_SENIORS) continue;
      selectedStudents.push(s);
      if (s.grade === 12) seniorCount++;
      if (selectedStudents.length >= TEAM_SIZE) break;
    }

    // Initialize student event counts and block occupancy
    const studentEventCounts: Record<string, number> = {};
    const studentBlocks: Record<string, Set<number>> = {};
    selectedStudents.forEach(s => { 
      studentEventCounts[s.name] = 0;
      studentBlocks[s.name] = new Set<number>();
    });

    // Count prefilled events and blocks
    allEvents.forEach(event => {
      roster[event].forEach(name => {
        if (name && studentEventCounts[name] !== undefined) {
          studentEventCounts[name]++;
          studentBlocks[name].add(eventBlocks[event]);
        }
      });
    });

    // Assign events respecting MAX_EVENTS and block constraints
    for (const entry of scores) {
      const { student, event } = entry;
      const block = eventBlocks[event];
      if (!selectedStudents.includes(student)) continue;
      if (roster[event].includes(student.name)) continue; // Already prefilled
      if (studentEventCounts[student.name] >= MAX_EVENTS) continue;
      if (studentBlocks[student.name].has(block)) continue; // Already has an event in this block
      if (roster[event].filter(Boolean).length >= eventSlots[event]) continue;

      roster[event][roster[event].indexOf("")] = student.name;
      studentEventCounts[student.name]++;
      studentBlocks[student.name].add(block);
    }

    // Fill under-assigned students randomly to meet MIN_EVENTS, respecting blocks
    const underAssigned = selectedStudents.filter(s => studentEventCounts[s.name] < MIN_EVENTS);
    for (const s of underAssigned) {
      while (studentEventCounts[s.name] < MIN_EVENTS) {
        const availableEvents = allEvents.filter(e =>
          !roster[e].includes(s.name) &&
          roster[e].filter(Boolean).length < eventSlots[e] &&
          !studentBlocks[s.name].has(eventBlocks[e])
        );
        if (!availableEvents.length) break;
        const e = availableEvents[Math.floor(Math.random() * availableEvents.length)];
        roster[e][roster[e].indexOf("")] = s.name;
        studentEventCounts[s.name]++;
        studentBlocks[s.name].add(eventBlocks[e]);
      }
    }

    return NextResponse.json({ roster, selectedStudents, studentEventCounts });

  } catch (err) {
    console.error("Algorithm error:", err);
    return NextResponse.json({ roster: {} });
  }
}
