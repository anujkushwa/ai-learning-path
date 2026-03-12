import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {pool} from "@/lib/db";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    const userId = user.id;

    const result = await pool.query(
      `
      SELECT
        t.topic,
        tr.score
      FROM test_results tr
      JOIN tests t ON t.id = tr.test_id
      WHERE tr.student_clerk_id = $1
      ORDER BY tr.created_at DESC
      `,
      [userId]
    );

    const formatted = result.rows.map((r) => {
      let status = "Strong";

      if (r.score < 40) status = "Weak";
      else if (r.score < 70) status = "Average";

      return {
        topic: r.topic,
        score: r.score,
        status
      };
    });

    return NextResponse.json(formatted);

  } catch (error) {

    console.error("STUDENT DASHBOARD ERROR:", error);

    return NextResponse.json([], { status: 200 });
  }
}