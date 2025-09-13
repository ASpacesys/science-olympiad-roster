import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const config = { api: { bodyParser: false } };

// Top-level interface declarations
interface ParsedRow {
  Name: string;
  Grade: number | string;
  Events: string;
  Placements?: string;
  Years?: number | string;
  Experience?: number | string;
}

interface Student {
  name: string;
  grade: number;
  events: string[];
  placements: Record<string, number>;
  years: number;
}

// Helper to parse placements
function parsePlacements(str?: string): Record<string, number> {
  if (!str) return {};
  const placements: Record<string, number> = {};
  str.split(",").forEach((entry) => {
    const [event, value] = entry.split(":").map((s) => s.trim());
    if (event && value && !isNaN(Number(value))) placements[event] = Number(value);
  });
  return placements;
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let students: Student[] = [];

    if (contentType.includes("application/json")) {
      const data = await req.json();
      students = data.students || [];
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      if (!file) return NextResponse.json({ students: [] });

      const buffer = Buffer.from(await file.arrayBuffer());
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<ParsedRow>(sheet);

      // Map rows to Student[]
      students = rows.map((row) => ({
        name: row.Name ?? "",
        grade: parseInt(row.Grade?.toString() ?? "0"),
        events: row.Events
          ? row.Events.toString().split(",").map((e) => e.trim())
          : [],
        placements: parsePlacements(row.Placements),
        years: parseInt(row.Years?.toString() ?? row.Experience?.toString() ?? "0"),
      }));
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type", students: [] },
        { status: 400 }
      );
    }

    return NextResponse.json({ students });
  } catch (err) {
    console.error("Error parsing file:", err);
    return NextResponse.json({ students: [] });
  }
}
