import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { calculateStatus } from "@/lib/calcStatus";

export async function POST(request) {
  try {
    const { userId, topic, score } = await request.json();

    if (!userId || !topic || score === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const status = calculateStatus(score);

    await pool.query(
      `INSERT INTO test_results (user_id, topic, score, status)
       VALUES ($1, $2, $3, $4)`,
      [userId, topic, score, status]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("POST /api/tests/submit error:", error);

    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}
