import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import pool from "@/lib/db";

export async function GET() {

  try {

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ---------- GET TEACHER ---------- */

    const teacherRes = await pool.query(
      `
      SELECT institution, course
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

    const institution = teacher.institution;
    const course = teacher.course;

    /* ---------- STUDENTS ---------- */

    const studentsRes = await pool.query(
      `
      SELECT id, name
      FROM students
      WHERE institution = $1
      AND course = $2
      `,
      [institution, course]
    );

    const students = studentsRes.rows;

    /* ---------- RESULTS ---------- */

    const resultsRes = await pool.query(
      `
      SELECT
        s.name,
        t.topic,
        r.score
      FROM test_results r
      JOIN students s ON s.clerk_id = r.student_clerk_id
      JOIN tests t ON t.id = r.test_id
      WHERE s.institution = $1
      AND s.course = $2
      `,
      [institution, course]
    );

    const results = resultsRes.rows;

    /* ---------- TOPIC REPORT ---------- */

    const topicMap = {};

    results.forEach((r) => {

      if (!topicMap[r.topic]) {
        topicMap[r.topic] = [];
      }

      topicMap[r.topic].push(Number(r.score));
    });

    const topicReport = Object.entries(topicMap).map(([topic, scores]) => {

      const avg =
        scores.reduce((a, b) => a + b, 0) / scores.length;

      let status = "Strong";

      if (avg < 40) status = "Weak";
      else if (avg < 70) status = "Average";

      return {
        topic,
        avgScore: Math.round(avg),
        status
      };

    });

    /* ---------- STUDENT REPORT ---------- */

    const studentMap = {};

    results.forEach((r) => {

      if (!studentMap[r.name]) {
        studentMap[r.name] = { name: r.name, topics: {} };
      }

      studentMap[r.name].topics[r.topic] = r.score;

    });

    const studentReport = Object.values(studentMap);

    /* ---------- SUMMARY ---------- */

    const totalStudents = students.length;

    const totalTopics = topicReport.length;

    let weakestTopic = "N/A";

    if (topicReport.length > 0) {

      const sorted = [...topicReport].sort(
        (a, b) => a.avgScore - b.avgScore
      );

      weakestTopic = sorted[0].topic;
    }

    return NextResponse.json({

      summary: {
        totalStudents,
        totalTopics,
        weakestTopic
      },

      topicReport,
      studentReport

    });

  } catch (error) {

    console.error("REPORT ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }

}