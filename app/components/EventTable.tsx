"use client";
import EventRow from "./EventRow";
//import { useState } from "react";

interface Event {
  name: string;
  slots: number;
}

interface RosterTableProps {
  roster: Record<string, string[]>;
  setRoster: (r: Record<string, string[]>) => void;
}

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

export default function RosterTable({ roster, setRoster }: RosterTableProps) {
  // Initialize state if empty
  if (!Object.keys(roster).length) {
    const initRoster: Record<string, string[]> = {};
    events.forEach((e) => {
      initRoster[e.name] = Array(e.slots).fill("");
    });
    setRoster(initRoster);
  }

  const handleSlotChange = (eventName: string, slotIndex: number, value: string) => {
    const updated = { ...roster };
    updated[eventName][slotIndex] = value;
    setRoster(updated);
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
            />
          ))}
        </tbody>
      </table>

      {/* Clear All button */}
      <button
        onClick={handleClearAll}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Clear All
      </button>
    </div>
  );
}
