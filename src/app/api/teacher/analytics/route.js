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

    // 👨‍🏫 Step 1: Get teacher using clerk_id
    const teacherRes = await pool.query(
      "SELECT id FROM teachers WHERE clerk_id = $1",
      [user.id]
    );

    if (teacherRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    const teacherId = teacherRes.rows[0].id;

    // 📊 Step 2: Get analytics data
    const analyticsRes = await pool.query(
      `
      SELECT 
        t.id AS test_id,
        t.title,
        COUNT(tr.id) AS total_attempts,
        COALESCE(AVG(tr.score), 0) AS avg_score
      FROM tests t
      LEFT JOIN test_results tr ON t.id = tr.test_id
      WHERE t.teacher_id = $1
      GROUP BY t.id
      ORDER BY t.created_at DESC;
      `,
      [teacherId]
    );

    return NextResponse.json({
      success: true,
      data: analyticsRes.rows,
    });

  } catch (error) {
    console.error("Teacher Analytics Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}