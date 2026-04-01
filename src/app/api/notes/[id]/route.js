import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { pool } from "@/lib/db";

export async function GET(req, context) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Safe params
    const noteId = Number(context?.params?.id);

    if (!noteId) {
      return NextResponse.json(
        { error: "Invalid note ID" },
        { status: 400 }
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

    // 📄 Fetch single note
    const noteRes = await pool.query(
      `SELECT id, title, description, file_url, file_type
       FROM notes
       WHERE id = $1
       AND institute_id = $2
       AND LOWER(TRIM(course)) = LOWER(TRIM($3))`,
      [noteId, institute_id, course]
    );

    if (noteRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Access denied or note not found" },
        { status: 403 }
      );
    }

    return NextResponse.json(noteRes.rows[0]);

  } catch (error) {
    console.error("❌ NOTE FETCH ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}