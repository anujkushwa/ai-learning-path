import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    // 🔐 Get logged-in user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 👨‍🎓 Get student ID from DB using clerk_id
    const studentRes = await pool.query(
      "SELECT id FROM students WHERE clerk_id = $1",
      [user.id]
    );

    if (studentRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    const studentId = studentRes.rows[0].id;

    // 🔥 ONLY this student's data
    const result = await pool.query(
      `
      SELECT id, topic, score, status
      FROM test_results
      WHERE student_id = $1
      ORDER BY created_at DESC
      LIMIT 6
      `,
      [studentId]
    );

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error("GET /api/student/tests error:", error);

    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}