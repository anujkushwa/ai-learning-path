import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import pool from "@/lib/db";

export async function POST(req) {

  const client = await pool.connect();

  try {

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, topic, questions } = await req.json();

    if (!title || !topic || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ---------- GET TEACHER INFO ---------- */

    const teacherRes = await client.query(
      `
      SELECT id, institution, course
      FROM teachers
      WHERE clerk_id = $1
      `,
      [user.id]
    );

    if (teacherRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 403 }
      );
    }

    const teacher = teacherRes.rows[0];

    const teacherId = teacher.id;
    const institution = teacher.institution;
    const course = teacher.course;

    /* ---------- START TRANSACTION ---------- */

    await client.query("BEGIN");

    /* ---------- CREATE TEST ---------- */

    const testRes = await client.query(
      `
      INSERT INTO tests
      (title, topic, teacher_id, institution, course)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING id
      `,
      [
        title,
        topic,
        teacherId,
        institution,
        course
      ]
    );

    const testId = testRes.rows[0].id;

    /* ---------- INSERT QUESTIONS ---------- */

    for (const q of questions) {

      if (!q.question || !q.options || !q.correct) {
        throw new Error("Invalid question format");
      }

      await client.query(
        `
        INSERT INTO questions
        (test_id, question, options, correct)
        VALUES ($1,$2,$3,$4)
        `,
        [
          testId,
          q.question,
          JSON.stringify(q.options),
          q.correct
        ]
      );
    }

    /* ---------- COMMIT ---------- */

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      testId
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error("CREATE TEST ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  } finally {

    client.release();

  }

}