import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req, context) {
  try {
    const { params } = context;
    const id = params?.id;

    const studentId = req.nextUrl.searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID required" },
        { status: 400 }
      );
    }

    // get student info
    const studentResult = await pool.query(
      "SELECT institute_id, course FROM students WHERE id=$1",
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    const { institute_id, course } = studentResult.rows[0];

    // get note only if institute + course match
    const noteResult = await pool.query(
      "SELECT * FROM notes WHERE id=$1 AND institute_id=$2 AND course=$3",
      [id, institute_id, course]
    );

    if (noteResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Note not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json(noteResult.rows[0]);

  } catch (error) {

    console.error("NOTE FETCH ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}