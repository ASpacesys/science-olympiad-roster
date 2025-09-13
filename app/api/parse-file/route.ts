import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // For MVP, return fake parsed students
  const students = [
    { name: "Karen Huang", grade: 12, events: ["Chemistry Lab"], placements: { "Chemistry Lab": 1 }, years: 3 },
    { name: "Dhruv Subramanian", grade: 10, events: ["Anatomy"], placements: { "Anatomy": 4 }, years: 2 },
  ];
  return NextResponse.json({ students });
}
