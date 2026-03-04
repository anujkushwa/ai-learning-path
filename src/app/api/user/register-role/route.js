import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import pool from "@/lib/db";

export async function POST(req) {

  try {

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, course, institution } = await req.json();

    const userId = user.id;

    const name =
      `${user.firstName || ""} ${user.lastName || ""}`.trim();

    if (!role || !course || !institution) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (role === "student") {

      await pool.query(
        `
        INSERT INTO students (clerk_id, name, institution, course)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (clerk_id)
        DO UPDATE SET
        name = $2,
        institution = $3,
        course = $4
        `,
        [userId, name, institution, course]
      );

    }

    if (role === "teacher") {

      await pool.query(
        `
        INSERT INTO teachers (clerk_id, name, institution, course)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (clerk_id)
        DO UPDATE SET
        name = $2,
        institution = $3,
        course = $4
        `,
        [userId, name, institution, course]
      );

    }

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }

}