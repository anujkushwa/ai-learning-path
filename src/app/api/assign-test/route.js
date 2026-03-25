import { db } from "@/db";
import { testAssignments } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { testId, studentIds } = await req.json();

    // ✅ Validation
    if (!testId || !studentIds || !studentIds.length) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // ✅ Bulk insert (FAST)
    const values = studentIds.map((studentId) => ({
      testId,
      studentId,
    }));

    await db.insert(testAssignments).values(values);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Assignment Error:", error); // ✅ debug

    return NextResponse.json({ error: "Assignment failed" }, { status: 500 });
  }
}
