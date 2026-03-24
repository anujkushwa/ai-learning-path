import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { calculateStatus } from "@/lib/calcStatus";

export async function POST(request) {
  try {
    console.log("🔥 API HIT");

    // 🔐 1. Get logged-in user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📥 2. Get request body
    const body = await request.json();
    const { testId, topic, score } = body;

    console.log("BODY:", body);

    if (!testId || !topic || score === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 👨‍🎓 3. Get student
    const studentRes = await pool.query(
      `SELECT id FROM students WHERE clerk_id = $1`,
      [user.id]
    );

    const student = studentRes.rows[0];

    console.log("STUDENT:", student);

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // 🧠 4. Calculate status
    const status = calculateStatus(Number(score));

    // 🔥 5. Insert into DB
    await pool.query(
      `
      INSERT INTO test_results 
      (student_id, test_id, topic, score, status)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        student.id,
        Number(testId),   // 🔥 IMPORTANT
        topic,
        Number(score),    // 🔥 IMPORTANT
        status
      ]
    );

    console.log("✅ INSERT SUCCESS");

    return NextResponse.json({
      success: true,
      message: "Test submitted successfully"
    });

  } catch (error) {
    console.error("❌ SUBMIT ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}