import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    // ⚠️ Later you can filter by user_id
    const result = await pool.query(
      `SELECT id, topic, score, status
       FROM test_results
       ORDER BY created_at DESC
       LIMIT 6`,
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api/student/tests error:", error);

    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
