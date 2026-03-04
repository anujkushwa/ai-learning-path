import { db } from "@/lib/db";
import { testAssignments } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { testId, studentIds } = await req.json();

    for (const studentId of studentIds) {
      await db.insert(testAssignments).values({
        testId,
        studentId,
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { error: "Assignment failed" },
      { status: 500 }
    );
  }
}
