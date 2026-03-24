import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { calculateStatus } from "@/lib/calcStatus";

export async function POST(request) {
  try {
    // 🔐 1. Get logged-in user (Clerk)
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📥 2. Get request data
    const { testId, topic, score } = await request.json();

    if (!testId || !topic || score === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 👨‍🎓 3. Get student from DB
    const studentRes = await pool.query(
      `SELECT * FROM students WHERE clerk_id = $1`,
      [user.id]
    );

    const student = studentRes.rows[0];

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // 🧠 4. Calculate status
    const status = calculateStatus(score);

    // 🔥 5. INSERT FIX (MAIN CHANGE)
    await pool.query(
      `
      INSERT INTO test_results 
      (student_id, test_id, topic, score, status)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [student.id, testId, topic, score, status]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("POST /api/tests/submit error:", error);

    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}