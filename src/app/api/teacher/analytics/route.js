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

    // 👨‍🏫 Get teacher
    const teacherRes = await pool.query(
      `SELECT * FROM teachers WHERE clerk_id = $1`,
      [user.id]
    );

    const teacher = teacherRes.rows[0];

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    // 📊 Analytics query (FINAL FIX)
    const result = await pool.query(
      `
      SELECT 
        tr.topic,
        ROUND(AVG(tr.score), 2) AS avg
      FROM test_results tr
      JOIN tests t ON tr.test_id = t.id
      JOIN students s ON tr.student_id = s.id

      WHERE t.institute_id = $1
      AND t.course = $2

      GROUP BY tr.topic
      ORDER BY avg ASC
      `,
      [teacher.institute_id, teacher.course]
    );

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error("Analytics API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}