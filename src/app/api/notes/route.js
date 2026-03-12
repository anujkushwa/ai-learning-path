import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentRes = await pool.query(
      `SELECT institute_id, course
       FROM students
       WHERE clerk_id = $1`,
      [user.id]
    );

    if (studentRes.rows.length === 0) {
      return NextResponse.json([]);
    }

    const { institute_id, course } = studentRes.rows[0];

    const notesRes = await pool.query(
      `SELECT id, title, description, file_url, file_type
       FROM notes
       WHERE institute_id = $1
       AND course = $2
       ORDER BY created_at DESC`,
      [institute_id, course]
    );

    return NextResponse.json(notesRes.rows);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}