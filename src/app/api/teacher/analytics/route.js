import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {

    const result = await pool.query(`
      SELECT topic, AVG(score) AS avg
      FROM test_results
      GROUP BY topic
    `);

    return NextResponse.json(result.rows);

  } catch (error) {

    console.error("Analytics API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}