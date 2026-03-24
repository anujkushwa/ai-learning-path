import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    // 🔥 Step 1: Get student from DB
    const studentRes = await pool.query(
      `SELECT * FROM students WHERE clerk_id = $1`,
      [user.id]
    );

    const student = studentRes.rows[0];

    if (!student) {
      return NextResponse.json([], { status: 200 });
    }

    // 🔥 Step 2: Use student_id (IMPORTANT FIX)
    const result = await pool.query(
      `
      SELECT
        t.topic,
        tr.score
      FROM test_results tr
      JOIN tests t ON t.id = tr.test_id
      WHERE tr.student_id = $1
      ORDER BY tr.created_at DESC
      `,
      [student.id]
    );

    const formatted = result.rows.map((r) => {
      let status = "Strong";

      if (r.score < 40) status = "Weak";
      else if (r.score < 70) status = "Average";

      return {
        topic: r.topic,
        score: r.score,
        status
      };
    });

    return NextResponse.json(formatted);

  } catch (error) {
    console.error("STUDENT DASHBOARD ERROR:", error);

    return NextResponse.json([], { status: 200 });
  }
}