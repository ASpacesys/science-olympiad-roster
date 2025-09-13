import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // TODO: run real algorithm
  const filled = {
    "Chemistry Lab": ["Karen Huang", "Dhruv Subramanian"],
    "Codebusters": ["TBD1", "TBD2", "TBD3"],
  };

  return NextResponse.json({ roster: filled });
}
