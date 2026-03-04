import { db } from "@/lib/db";
import { teacherTopics } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.select().from(teacherTopics);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}