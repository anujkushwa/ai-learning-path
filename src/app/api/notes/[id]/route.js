import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { pool } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const noteId = params.id;

    // student info
    const studentRes = await pool.query(
      `SELECT institute_id, course
       FROM students
       WHERE clerk_id = $1`,
      [user.id],
    );

    if (studentRes.rows.length === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const { institute_id, course } = studentRes.rows[0];

    // secure note fetch
    const noteRes = await pool.query(
      `SELECT *
       FROM notes
       WHERE id = $1
       AND institute_id = $2
       AND course = $3`,
      [noteId, institute_id, course],
    );

    if (noteRes.rows.length === 0) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(noteRes.rows[0]);
  } catch (error) {
    console.error("NOTE ERROR:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
