import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized user" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const file = formData.get("file");

    if (!title || !description || !file) {
      return NextResponse.json(
        { error: "Title, description and file are required" },
        { status: 400 }
      );
    }

    // 📁 Allowed file types
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF, DOCX, PPT files allowed" },
        { status: 400 }
      );
    }

    // 📏 Size limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File must be < 10MB" },
        { status: 400 }
      );
    }

    // 👨‍🏫 Get teacher institute + course
    const teacherRes = await pool.query(
      `SELECT institute_id, course
       FROM teachers
       WHERE clerk_id = $1`,
      [user.id]
    );

    if (teacherRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    const { institute_id, course } = teacherRes.rows[0];

    // 📦 File processing
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueName =
      Date.now() +
      "-" +
      Math.random().toString(36).substring(2) +
      "-" +
      file.name.replace(/\s/g, "_");

    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadPath = path.join(uploadDir, uniqueName);

    fs.writeFileSync(uploadPath, buffer);

    const fileUrl = `/uploads/${uniqueName}`;

    // 💾 Save in DB
    await pool.query(
      `INSERT INTO notes
       (title, description, file_url, file_type, institute_id, course)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [title, description, fileUrl, file.type, institute_id, course]
    );

    return NextResponse.json({
      success: true,
      message: "Note uploaded successfully",
      fileUrl,
    });

  } catch (error) {
    console.error("❌ UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}