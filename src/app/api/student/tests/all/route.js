import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {pool} from "@/lib/db";

export async function GET() {

  try {

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    const institution = student.institution;
    const course = student.course;

    /* ---------- FETCH TESTS ---------- */

    const testsRes = await pool.query(
      `
      SELECT 
        t.id,
        t.title,
        t.topic,
        t.created_at,
        COUNT(q.id)::int AS question_count
      FROM tests t
      LEFT JOIN questions q ON q.test_id = t.id
      WHERE t.institution = $1
      AND t.course = $2
      GROUP BY t.id, t.title, t.topic, t.created_at
      ORDER BY t.created_at DESC
      `,
      [institution, course]
    );

    /* ---------- FORMAT RESPONSE ---------- */

    const formatted = testsRes.rows.map((test) => ({
      ...test,
      duration: `${test.question_count * 2} mins`
    }));

    return NextResponse.json(formatted);

  } catch (error) {

    console.error("STUDENT TEST LIST ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }

}