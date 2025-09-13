"use client";

import React, { useState } from "react";
import RosterTable from "./components/RosterTable";

interface Student {
  name: string;
  grade: number;
  events: string[];
  placements: Record<string, number>;
  years: number;
}

export default function Page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [roster, setRoster] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/parse-file", { method: "POST", body: formData });
    const data = await res.json();
    setStudents(data.students);
    setLoading(false);
  };

  const runAlgorithm = async () => {
    if (!students.length) return;
    setLoading(true);
    const res = await fetch("/api/run-algorithm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ students, prefilled: roster }),
    });
    const data = await res.json();
    setRoster(data.roster);
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Science Olympiad Rostermaking Tool</h1>
 <p className="text-gray-700 mb-4">
    The algorithm creates a Science Olympiad roster for 15 students, enforcing a maximum of 7 seniors, 3–4 events per student, and event slot limits. Events are grouped into blocks to prevent scheduling conflicts. Students are scored for each event based on preferences, past placements, and experience, and the top students are selected while respecting senior limits. Prefilled events count toward assignments. Students are then assigned to events in score order without exceeding event or block limits, and under-assigned students are randomly placed in available events to meet minimum requirements. The output includes the roster, selected students, and each student’s event count.</p> <p className="text-gray-700 mb-4">
Uploaded spreadsheet must have the following columns: Name, Grade, Events, Placements, Years. These indicate Name, Grade Level, Events Selected or Participated, Competition Placement in Event, and Years Competed, respectively. For example, Name: Jane Doe | Grade: 12 | Events: Chemistry Lab, Forensics, Experimental Design | Placements: Chemistry Lab:1, Forensics:10, Experimental Design:24 | Years: 3</p> <p className="text-gray-700 mb-4">
Students can be entered by hand as a way to manually set a "seed" for the roster.
  </p>
<div className="mb-4 flex items-center gap-4">
  <label
    htmlFor="fileUpload"
    className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    Choose File
  </label>
  <input
    type="file"
    id="fileUpload"
    className="hidden"
    onChange={handleFileChange}
  />
  <span className="text-gray-700">
    {file ? file.name : "No file selected"}
  </span>
  <button
    onClick={uploadFile}
    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
  >
    Upload Spreadsheet
  </button>
</div>


      {students.length > 0 && (
        <>
          <RosterTable students={students} roster={roster} setRoster={setRoster} />
          <button
            onClick={runAlgorithm}
            className="bg-green-500 text-white px-4 py-2 mt-4"
            disabled={loading}
          >
            {loading ? "Running..." : "Run Algorithm"}
          </button>
        </>
      )}
    </div>
  );
}
