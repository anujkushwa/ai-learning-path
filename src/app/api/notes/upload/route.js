import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

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
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF, DOCX, PPT allowed" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Max size 10MB" },
        { status: 400 }
      );
    }

    // 👨‍🏫 Get teacher
    const teacherRes = await pool.query(
      `SELECT institute_id, course FROM teachers WHERE clerk_id = $1`,
      [user.id]
    );

    if (teacherRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    let { institute_id, course } = teacherRes.rows[0];

    if (!institute_id || !course) {
      return NextResponse.json(
        { error: "Teacher institute or course missing" },
        { status: 400 }
      );
    }

    course = course.trim();

    // 📤 Upload to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const fileUrl = uploadRes.secure_url;

    // 💾 Save note
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
      { error: error.message },
      { status: 500 }
    );
  }
}