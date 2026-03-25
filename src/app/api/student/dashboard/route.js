import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    // 🔐 1. Get logged-in user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 👨‍🎓 2. Get student
    const studentRes = await pool.query(
      `SELECT * FROM students WHERE clerk_id = $1`,
      [user.id]
    );

    const student = studentRes.rows[0];

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    console.log("🔥 Student ID:", student.id);

    // 📊 3. Get results (SAFE QUERY)
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

    console.log("🔥 Results:", result.rows);

    // 📦 4. Format data
    const formatted = result.rows.map((r) => {
      let status = "Strong";

      if (r.score < 40) status = "Weak";
      else if (r.score < 70) status = "Average";

      return {
        topic: r.topic || "Unknown",
        score: Number(r.score),
        status,
      };
    });

    // ✅ 5. Extra stats (SAFE ADDITION)
    const totalTests = result.rows.length;

    const avgScore =
      result.rows.reduce((sum, r) => sum + Number(r.score), 0) /
      (result.rows.length || 1);

    return NextResponse.json({
      totalTests,
      avgScore: Number(avgScore.toFixed(2)),
      data: formatted,
    });
  } catch (error) {
    console.error("❌ STUDENT DASHBOARD ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}