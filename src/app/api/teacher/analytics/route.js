import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    // 🔐 1. Get logged-in user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 👨‍🏫 


    const teacherRes = await pool.query(
      `SELECT * FROM teachers WHERE clerk_id = $1`,
      [user.id],
    );

    const teacher = teacherRes.rows[0];

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    console.log("Teacher:", teacher);

    const result = await pool.query(
      `
      SELECT 
        COALESCE(t.topic, tr.topic, 'Unknown') AS topic,
        ROUND(COALESCE(AVG(tr.score), 0)::numeric, 2) AS avg_score,
        COUNT(tr.id) AS total_tests
      FROM test_results tr
      LEFT JOIN tests t ON tr.test_id = t.id
      WHERE 
        ($1::int IS NULL OR t.institute_id = $1)
      GROUP BY COALESCE(t.topic, tr.topic)
      ORDER BY avg_score ASC;
      `,
      [teacher.institute_id || null],
    );

    console.log("RESULT:", result.rows);

    return NextResponse.json(result.rows || []);
  } catch (error) {
    console.error("Analytics API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
