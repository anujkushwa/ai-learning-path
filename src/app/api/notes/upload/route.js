import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { pool } from "@/lib/db";

export async function POST(req) {

  const formData = await req.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const file = formData.get("file");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = Date.now() + "-" + file.name;

  const uploadDir = path.join(process.cwd(), "public/uploads");
  const uploadPath = path.join(uploadDir, fileName);

  await writeFile(uploadPath, buffer);

  const fileUrl = `/uploads/${fileName}`;

  await pool.query(
    "INSERT INTO notes(title,description,file_url,file_type) VALUES($1,$2,$3,$4)",
    [title, description, fileUrl, file.type]
  );

  return NextResponse.json({ success: true });
}
