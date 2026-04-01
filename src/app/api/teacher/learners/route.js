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

    // 👨‍🏫 Teacher info
    const teacherRes = await pool.query(
      `SELECT institute_id, course
       FROM teachers
       WHERE clerk_id = $1`,
      [user.id]
    );

    if (teacherRes.rows.length === 0) {
      return NextResponse.json([]);
    }

    const { course } = teacherRes.rows[0];

    // 🔥 FIXED: removed institute_id dependency
    const result = await pool.query(
      `
      SELECT 
        s.id,
        s.name,
        COUNT(tr.id) AS total_tests,
        COALESCE(AVG(tr.score), 0) AS avg_score
      FROM students s
      LEFT JOIN test_results tr ON s.id = tr.student_id
      WHERE LOWER(TRIM(s.course)) = LOWER(TRIM($1))
      GROUP BY s.id, s.name
      ORDER BY s.name ASC
      `,
      [course]
    );

    const learners = [];

    for (let s of result.rows) {

      const weakRes = await pool.query(
        `
        SELECT topic, score
        FROM test_results
        WHERE student_id = $1
        ORDER BY score ASC
        LIMIT 1
        `,
        [s.id]
      );

      const weakTopic =
        weakRes.rows.length > 0 ? weakRes.rows[0].topic.trim() : "-";

      const avg = Number(s.avg_score);

      let level = "Strong";
      if (avg < 40) level = "Weak";
      else if (avg < 70) level = "Average";

      learners.push({
        id: s.id,
        name: s.name,
        level,
        weakTopic,
        tests: Number(s.total_tests),
      });
    }

    return NextResponse.json(learners);

  } catch (error) {
    console.error("❌ LEARNERS ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}