import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 👨‍🏫 Get teacher
    const teacherRes = await pool.query(
      "SELECT institute_id, course FROM teachers WHERE clerk_id = $1",
      [user.id]
    );

    if (teacherRes.rows.length === 0) {
      return NextResponse.json([]);
    }

    const { institute_id, course } = teacherRes.rows[0];

    // 📊 Get learners data
    const result = await pool.query(
      `
      SELECT 
        s.id,
        s.name,
        COUNT(tr.id) AS tests,
        COALESCE(AVG(tr.score), 0) AS avg_score,
        MIN(tr.topic) AS weak_topic
      FROM students s
      LEFT JOIN test_results tr ON s.id = tr.student_id
      WHERE s.institute_id = $1
      AND LOWER(TRIM(s.course)) = LOWER(TRIM($2))
      GROUP BY s.id
      `,
      [institute_id, course]
    );

    // 🧠 Format
    const data = result.rows.map((s) => {
      let level = "Strong";

      if (s.avg_score < 40) level = "Weak";
      else if (s.avg_score < 70) level = "Average";

      return {
        id: s.id,
        name: s.name,
        level,
        weakTopic: s.weak_topic || "-",
        tests: Number(s.tests),
      };
    });

    return NextResponse.json(data);

  } catch (error) {
    console.error("❌ LEARNERS ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}