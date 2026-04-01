import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    const result = await pool.query(
      `
      SELECT 
        COALESCE(t.topic, tr.topic) AS topic,
        tr.score
      FROM test_results tr
      LEFT JOIN tests t ON t.id = tr.test_id
      WHERE tr.student_id = $1
      ORDER BY tr.created_at DESC
      `,
      [student.id]
    );

    // ✅ RETURN ALL RESULTS (IMPORTANT)
    const formatted = result.rows.map((r) => ({
      topic: r.topic || "Unknown",
      score: Number(r.score),
    }));

    return NextResponse.json(formatted);

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}