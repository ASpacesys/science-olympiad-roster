"use client";
import EventRow from "./EventRow";
import React, { useEffect } from "react";

interface Event {
  name: string;
  slots: number;
}

interface RosterTableProps {
  roster: Record<string, string[]>;
  setRoster: (r: Record<string, string[]>) => void;
}

// Define your events
const events: Event[] = [
  { name: "Anatomy & Physiology", slots: 2 },
  { name: "Forensics", slots: 2 },
  { name: "Engineering CAD", slots: 2 },
  { name: "Disease Detectives", slots: 2 },
  { name: "Remote Sensing", slots: 2 },
  { name: "Codebusters", slots: 3 },
  { name: "Entomology", slots: 2 },
  { name: "Astronomy", slots: 2 },
  { name: "Experimental Design", slots: 3 },
  { name: "Machines", slots: 2 },
  { name: "Chemistry Lab", slots: 2 },
  { name: "Water Quality", slots: 2 },
  { name: "Dynamic Planet", slots: 2 },
  { name: "Circuit Lab", slots: 2 },
  { name: "Designer Genes", slots: 2 },
  { name: "Rocks and Minerals", slots: 2 },
  { name: "Materials Science", slots: 2 },
];

// Map events to blocks
const eventBlock: Record<string, number> = {
  "Anatomy & Physiology": 1,
  Forensics: 1,
  "Bungee Drop": 1,
  "Engineering CAD": 1,
  "Disease Detectives": 2,
  "Remote Sensing": 2,
  "Electric Vehicle": 2,
  Codebusters: 2,
  Entomology: 3,
  Astronomy: 3,
  Helicopter: 3,
  "Experimental Design": 3,
  Hovercraft: 4,
  Machines: 4,
  "Chemistry Lab": 4,
  "Water Quality": 5,
  "Dynamic Planet": 5,
  "Circuit Lab": 5,
  "Robot Tour": 5,
  "Designer Genes": 6,
  "Rocks and Minerals": 6,
  "Materials Science": 6,
  Boomilever: 6,
};

// Light colors for each block
const blockColors: Record<number, string> = {
  1: "bg-red-100",
  2: "bg-orange-100",
  3: "bg-yellow-100",
  4: "bg-green-100",
  5: "bg-blue-100",
  6: "bg-purple-100",
};

export default function RosterTable({ roster, setRoster }: RosterTableProps) {
  // Initialize roster if empty
  useEffect(() => {
    if (Object.keys(roster).length === 0) {
      const initRoster: Record<string, string[]> = {};
      events.forEach((e) => {
        initRoster[e.name] = Array(e.slots).fill("");
      });
      setRoster(initRoster);
    }
  }, [roster, setRoster]);

  const handleSlotChange = (eventName: string, slotIndex: number, value: string) => {
    setRoster({
      ...roster,
      [eventName]: roster[eventName].map((n, idx) => (idx === slotIndex ? value : n)),
    });
  };

  const handleClearAll = () => {
    const cleared: Record<string, string[]> = {};
    events.forEach((e) => {
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
            <th className="border p-2">Competitors</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <EventRow
              key={event.name}
              event={event}
              slots={roster[event.name]}
              onSlotChange={(idx, val) => handleSlotChange(event.name, idx, val)}
              eventColor={blockColors[eventBlock[event.name]] || "bg-white"}
            />
          ))}
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
