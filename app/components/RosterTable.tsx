"use client";
import EventRow from "./EventRow";
import { Student } from "./api/parse-file/route";

interface Event {
  name: string;
  slots: number;
}

interface RosterTableProps {
  students: Student[];
  roster: Record<string, string[]>;
  setRoster: (r: Record<string, string[]>) => void;
}

// Example block colors for shading
const blockColors = [
  "bg-red-100",
  "bg-orange-100",
  "bg-yellow-100",
  "bg-green-100",
  "bg-blue-100",
  "bg-purple-100",
];

const eventBlocks: Event[][] = [
  [
    { name: "Anatomy & Physiology", slots: 2 },
    { name: "Forensics", slots: 2 },
    { name: "Bungee Drop", slots: 2 },
    { name: "Engineering CAD", slots: 2 },
  ],
  [
    { name: "Disease Detectives", slots: 2 },
    { name: "Remote Sensing", slots: 2 },
    { name: "Electric Vehicle", slots: 2 },
    { name: "Codebusters", slots: 3 },
  ],
  [
    { name: "Entomology", slots: 2 },
    { name: "Astronomy", slots: 2 },
    { name: "Helicopter", slots: 2 },
    { name: "Experimental Design", slots: 3 },
  ],
  [
    { name: "Hovercraft", slots: 2 },
    { name: "Machines", slots: 2 },
    { name: "Chemistry Lab", slots: 2 },
  ],
  [
    { name: "Water Quality", slots: 2 },
    { name: "Dynamic Planet", slots: 2 },
    { name: "Circuit Lab", slots: 2 },
    { name: "Robot Tour", slots: 2 },
  ],
  [
    { name: "Designer Genes", slots: 2 },
    { name: "Rocks and Minerals", slots: 2 },
    { name: "Materials Science", slots: 2 },
    { name: "Boomilever", slots: 2 },
  ],
];

export default function RosterTable({ roster, setRoster }: RosterTableProps) {
  // Initialize roster if empty
  if (!Object.keys(roster).length) {
    const initRoster: Record<string, string[]> = {};
    eventBlocks.flat().forEach((e) => {
      initRoster[e.name] = Array(e.slots).fill("");
    });
    setRoster(initRoster);
  }

  const handleSlotChange = (eventName: string, slotIndex: number, value: string) => {
    setRoster({
      ...roster,
      [eventName]: roster[eventName].map((n, idx) => (idx === slotIndex ? value : n)),
    });
  };

  const handleClearAll = () => {
    const cleared: Record<string, string[]> = {};
    eventBlocks.flat().forEach((e) => {
      cleared[e.name] = Array(e.slots).fill("");
    });
    setRoster(cleared);
  };

  return (
    <div>
      <table className="w-full border-collapse border mt-4">
        <thead>
          <tr>
            <th className="border p-2 text-left">Event</th>
            <th className="border p-2" colSpan={3}>Competitors</th>
          </tr>
        </thead>
        <tbody>
          {eventBlocks.map((block, blockIdx) =>
            block.map((event) => (
              <EventRow
                key={event.name}
                event={event}
                slots={roster[event.name]}
                onSlotChange={(idx, val) => handleSlotChange(event.name, idx, val)}
                eventColor={blockColors[blockIdx % blockColors.length]}
              />
            ))
          )}
        </tbody>
      </table>

      <button
        onClick={handleClearAll}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Clear All
      </button>
    </div>
  );
}
