import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import pool from "@/lib/db";

export async function GET(request, { params }) {

  try {

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const testId = params.id;

    /* ---------- GET STUDENT INFO ---------- */

    const studentRes = await pool.query(
      `
      SELECT institution, course
      FROM students
      WHERE clerk_id = $1
      `,
      [user.id]
    );

    if (studentRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 403 }
      );
    }

    const student = studentRes.rows[0];

    /* ---------- VERIFY TEST ACCESS ---------- */

    const testRes = await pool.query(
      `
      SELECT id, title, topic
      FROM tests
      WHERE id = $1
      AND institution = $2
      AND course = $3
      `,
      [
        testId,
        student.institution,
        student.course
      ]
    );

    if (testRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    /* ---------- FETCH QUESTIONS ---------- */

    const questionsRes = await pool.query(
      `
      SELECT question, options, correct
      FROM questions
      WHERE test_id = $1
      ORDER BY id
      `,
      [testId]
    );

    const questions = questionsRes.rows.map((q) => ({
      question: q.question,
      options: q.options,
      correct: q.correct
    }));

    return NextResponse.json({
      ...testRes.rows[0],
      questions
    });

  } catch (error) {

    console.error("GET TEST ERROR:", error);

    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );

  }

}