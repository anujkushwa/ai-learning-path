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

    /* ---------- GET TEACHER ---------- */

    const teacherRes = await pool.query(
      `
      SELECT institute_id, course
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

    const { institute_id, course } = teacherRes.rows[0];

    /* ---------- STUDENTS (FIXED) ---------- */

    const studentsRes = await pool.query(
      `
      SELECT id, name
      FROM students
      WHERE LOWER(TRIM(course)) = LOWER(TRIM($1))
      `,
      [course]
    );

    const students = studentsRes.rows;

    /* ---------- RESULTS (FIXED) ---------- */

    const resultsRes = await pool.query(
      `
      SELECT
        s.id AS student_id,
        s.name,
        t.topic,
        r.score
      FROM test_results r
      JOIN students s ON s.id = r.student_id
      JOIN tests t ON t.id = r.test_id
      WHERE LOWER(TRIM(s.course)) = LOWER(TRIM($1))
      `,
      [course]
    );

    const results = resultsRes.rows;

    /* ---------- EDGE CASE ---------- */

    if (results.length === 0) {
      return NextResponse.json({
        summary: {
          totalStudents: students.length,
          totalTopics: 0,
          weakestTopic: "N/A",
        },
        topicReport: [],
        studentReport: [],
      });
    }

    /* ---------- TOPIC REPORT ---------- */

    const topicMap = {};

    results.forEach((r) => {
      const topic = r.topic?.trim() || "Unknown";

      if (!topicMap[topic]) {
        topicMap[topic] = [];
      }

      topicMap[topic].push(Number(r.score));
    });

    const topicReport = Object.entries(topicMap).map(
      ([topic, scores]) => {
        const avg =
          scores.reduce((a, b) => a + b, 0) / scores.length;

        let status = "Strong";

        if (avg < 40) status = "Weak";
        else if (avg < 70) status = "Average";

        return {
          topic,
          avgScore: Math.round(avg),
          status,
          totalAttempts: scores.length,
        };
      }
    );

    /* ---------- STUDENT REPORT ---------- */

    const studentMap = {};

    results.forEach((r) => {
      if (!studentMap[r.student_id]) {
        studentMap[r.student_id] = {
          id: r.student_id,
          name: r.name,
          topics: {},
          totalScore: 0,
          count: 0,
        };
      }

      studentMap[r.student_id].topics[r.topic] = r.score;
      studentMap[r.student_id].totalScore += Number(r.score);
      studentMap[r.student_id].count += 1;
    });

    const studentReport = Object.values(studentMap).map((s) => {
      const avg = s.totalScore / s.count;

      let level = "Strong";
      if (avg < 40) level = "Weak";
      else if (avg < 70) level = "Average";

      return {
        id: s.id,
        name: s.name,
        topics: s.topics,
        avgScore: Math.round(avg),
        level,
      };
    });

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
        weakestTopic,
      },
      topicReport,
      studentReport,
    });

  } catch (error) {
    console.error("❌ REPORT ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}