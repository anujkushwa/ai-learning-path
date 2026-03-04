import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT topic,
             AVG(score) as avg,
             COUNT(DISTINCT user_id) as students
      FROM test_results
      GROUP BY topic
    `);

    return NextResponse.json(result.rows);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}
