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

   
    const teacherRes = await pool.query(
      `SELECT institute_id, course
       FROM teachers
       WHERE clerk_id = $1`,
      [user.id]
    );

    if (teacherRes.rows.length === 0) {
      return NextResponse.json([]);
    }

    const { institute_id, course } = teacherRes.rows[0];

    // 📊 Get learners data (IMPROVED)
    const result = await pool.query(
      `
      SELECT 
        s.id,
        s.name,
        COUNT(tr.id) AS total_tests,
        COALESCE(AVG(tr.score), 0) AS avg_score
      FROM students s
      LEFT JOIN test_results tr ON s.id = tr.student_id
      WHERE s.institute_id = $1
      AND LOWER(TRIM(s.course)) = LOWER(TRIM($2))
      GROUP BY s.id, s.name
      ORDER BY s.name ASC
      `,
      [institute_id, course]
    );

    // 🔥 Get weak topic separately (IMPORTANT FIX)
    const learners = [];

    for (let s of result.rows) {
      // get weakest topic (lowest score)
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
        weakRes.rows.length > 0 ? weakRes.rows[0].topic : "-";

      // 🧠 Level calculation
      let level = "Strong";

      if (s.avg_score < 40) level = "Weak";
      else if (s.avg_score < 70) level = "Average";

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