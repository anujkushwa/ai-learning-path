import { NextResponse } from "next/server";
import pool from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {

    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const file = formData.get("file");

    if (!title || !description || !file) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = Date.now() + "-" + file.name;

    const uploadPath = path.join(
      process.cwd(),
      "public/uploads",
      fileName
    );

    fs.writeFileSync(uploadPath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    const institute_id = 1;
    const course = "MCA";

    await pool.query(
      `INSERT INTO notes
      (title, description, file_url, file_type, institute_id, course)
      VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        title,
        description,
        fileUrl,
        file.type,
        institute_id,
        course
      ]
    );

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}