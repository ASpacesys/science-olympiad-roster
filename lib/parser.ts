import * as XLSX from "xlsx";
import { Student } from "./types";

interface ParsedRow {
  Name?: string;
  Grade?: string | number;
  Events?: string;
  Placements?: string;
  Years?: string | number;
}

export function parseSpreadsheet(fileBuffer: Buffer): Student[] {
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: ParsedRow[] = XLSX.utils.sheet_to_json(sheet);

  const students: Student[] = rows.map((row) => {
    let events: string[] = [];
    if (row.Events) {
      events = row.Events.split(",").map((e: string) => e.trim());
    }

    let placements: Record<string, number> = {};
    if (row.Placements) {
      try {
        placements = JSON.parse(row.Placements);
      } catch {
        console.warn("Placements column not valid JSON");
      }
    }

    return {
      name: row.Name,
      grade: parseInt(row.Grade, 10),
      events,
      placements,
      years: parseInt(row.Years, 10) || 0,
    };
  });

  return students;
}
