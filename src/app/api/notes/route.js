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

    // 👨‍🎓 Get student
    const studentRes = await pool.query(
      `SELECT institute_id, course FROM students WHERE clerk_id = $1`,
      [user.id]
    );

    if (studentRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    let { institute_id, course } = studentRes.rows[0];

    // ✅ Safety checks
    if (!institute_id) {
      return NextResponse.json(
        { error: "Student institute not set" },
        { status: 400 }
      );
    }

    if (!course) {
      return NextResponse.json(
        { error: "Student course not set" },
        { status: 400 }
      );
    }

    course = course.trim();

    // 📄 Fetch notes
    const notesRes = await pool.query(
      `SELECT id, title, description, file_url, file_type
       FROM notes
       WHERE institute_id = $1
       AND LOWER(TRIM(course)) = LOWER(TRIM($2))
       ORDER BY id DESC`,
      [institute_id, course]
    );

    return NextResponse.json(notesRes.rows);

  } catch (error) {
    console.error("❌ NOTES FETCH ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}