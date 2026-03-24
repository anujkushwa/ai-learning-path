import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teacherRes = await pool.query(
      `SELECT * FROM teachers WHERE clerk_id = $1`,
      [user.id]
    );

    const teacher = teacherRes.rows[0];

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    console.log("Teacher:", teacher);

    // 🔥 IMPORTANT FIX: LEFT JOIN (data missing hone pe bhi show karega)
    const result = await pool.query(
      `
      SELECT 
        COALESCE(tr.topic, t.topic, 'Unknown') AS topic,
        ROUND(COALESCE(AVG(tr.score), 0)::numeric, 2) AS avg
      FROM tests t
      LEFT JOIN test_results tr ON tr.test_id = t.id

      WHERE t.institute_id = $1
      AND LOWER(TRIM(t.course)) = LOWER(TRIM($2))

      GROUP BY COALESCE(tr.topic, t.topic)
      ORDER BY avg ASC
      `,
      [teacher.institute_id, teacher.course]
    );

    console.log("RESULT:", result.rows);

    return NextResponse.json(result.rows || []);

  } catch (error) {
    console.error("Analytics API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}