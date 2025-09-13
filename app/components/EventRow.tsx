"use client";
import { useState } from "react";

export default function EventRow({ event }: { event: { name: string; slots: number } }) {
  const [names, setNames] = useState<string[]>(Array(event.slots).fill(""));

  function updateName(idx: number, value: string) {
    const updated = [...names];
    updated[idx] = value;
    setNames(updated);
  }

  return (
    <tr>
      <td className="border p-2">{event.name}</td>
      <td className="border p-2">
        <div className="flex gap-2">
          {names.map((n, idx) => (
            <input
              key={idx}
              value={n}
              onChange={(e) => updateName(idx, e.target.value)}
              placeholder="Name"
              className="border rounded p-1 flex-1"
            />
          ))}
        </div>
      </td>
    </tr>
  );
}
