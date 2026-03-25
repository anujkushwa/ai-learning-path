"use client";

import { useState } from "react";
import TeacherNavbar from "@/components/TeacherNavbar";
import DashboardFooter from "@/components/DashboardFooter";
import { Eye, Upload } from "lucide-react";

/* -------- MOCK DATA (later from DB) -------- */
const learners = [
  { id: 1, name: "Amit", level: "Weak", weakTopic: "Arrays", tests: 5 },
  { id: 2, name: "Neha", level: "Average", weakTopic: "Loops", tests: 3 },
  { id: 3, name: "Rahul", level: "Strong", weakTopic: "-", tests: 6 },
];

export default function LearnerHub() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  async function handleUpload() {
    if (!title || !description || !file) {
      alert("All fields required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    const res = await fetch("/api/notes/upload", {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      alert("Notes uploaded successfully");
      setTitle("");
      setDescription("");
      setFile(null);
    } else {
      alert("Upload failed");
    }
  }

  return (
    <>
      <TeacherNavbar />

      <main className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-8">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Learner Hub
            </h1>
            <p className="text-gray-500">
              Manage learners and share study resources
            </p>
          </div>

          {/* UPLOAD EXTRA NOTES */}
          <section className="bg-white rounded-2xl shadow-lg p-8">

            <div className="flex items-center gap-2 mb-6">
              <Upload className="text-emerald-600" />
              <h2 className="text-xl font-semibold">
                Upload Extra Notes
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {/* LEFT */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arrays Important Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />

                <label className="block text-sm font-medium mt-4 mb-1">
                  Description
                </label>
                <textarea
                  rows="4"
                  placeholder="Short description about this note..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* RIGHT */}
              <div className="flex flex-col justify-between">

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Upload File
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full p-3 border rounded-lg bg-slate-50"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Supported: PDF, DOCX, PPT, JPG, PNG
                  </p>
                </div>

                <button
                  onClick={handleUpload}
                  className="mt-6 px-6 py-3
                  bg-gradient-to-r from-emerald-600 to-teal-600
                  hover:from-emerald-700 hover:to-teal-700
                  text-white rounded-lg font-medium shadow-md transition"
                >
                  Upload Notes
                </button>

              </div>

            </div>
          </section>

          {/* LEARNER DIRECTORY */}
          <section className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-xl font-semibold mb-6">
              Learner Directory
            </h2>

            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-center">Level</th>
                  <th className="p-3 text-center">Weak Topic</th>
                  <th className="p-3 text-center">Tests Taken</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {learners.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-medium">{s.name}</td>

                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          s.level === "Weak"
                            ? "bg-red-100 text-red-600"
                            : s.level === "Average"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {s.level}
                      </span>
                    </td>

                    <td className="p-3 text-center">{s.weakTopic}</td>
                    <td className="p-3 text-center">{s.tests}</td>

                    <td className="p-3 text-center">
                      <button className="flex items-center gap-1 text-emerald-600 hover:underline mx-auto">
                        <Eye size={16} />
                        View
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

          </section>

        </div>

        <DashboardFooter />
      </main>
    </>
  );
}