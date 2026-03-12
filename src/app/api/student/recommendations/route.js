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

    const resultsRes = await pool.query(
      `
      SELECT t.topic, r.score
      FROM test_results r
      JOIN tests t ON t.id = r.test_id
      WHERE r.student_clerk_id = $1
      `,
      [user.id]
    );

    const results = resultsRes.rows;

    if (results.length === 0) {
      return NextResponse.json({});
    }

    let weakTopic = results[0].topic;
    let lowest = results[0].score;

    results.forEach((r) => {
      if (r.score < lowest) {
        lowest = r.score;
        weakTopic = r.topic;
      }
    });

    const youtube = {
      Arrays: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
      Recursion: "https://www.youtube.com/watch?v=IJDJ0kBx2LM",
      Sorting: "https://www.youtube.com/watch?v=KGyK-pNvWos"
    };

    return NextResponse.json({
      weakTopic,
      video: youtube[weakTopic] || null
    });

  } catch (error) {

    console.error("RECOMMENDATION ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }

}