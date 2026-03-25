"use client";

import { useEffect, useState } from "react";
import TeacherNavbar from "@/components/TeacherNavbar";
import DashboardFooter from "@/components/DashboardFooter";
import { Eye, Upload } from "lucide-react";

export default function LearnerHub() {

  // 🔥 Learners state
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Upload state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  // 🚀 Fetch learners (DYNAMIC)
  useEffect(() => {
    async function fetchLearners() {
      try {
        const res = await fetch("/api/teacher/learners");
        const data = await res.json();
        setLearners(data);
      } catch (err) {
        console.error("Error fetching learners:", err);
        setLearners([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLearners();
  }, []);

  // 📤 Upload Notes
  async function handleUpload() {
    if (!title || !description || !file) {
      alert("All fields required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const res = await fetch("/api/notes/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Notes uploaded successfully");
        setTitle("");
        setDescription("");
        setFile(null);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
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

          {/* 🔥 Upload Notes */}
          <section className="bg-white rounded-2xl shadow-lg p-8">

            <div className="flex items-center gap-2 mb-6">
              <Upload className="text-emerald-600" />
              <h2 className="text-xl font-semibold">
                Upload Extra Notes
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arrays Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />

                <label className="block text-sm font-medium mt-4 mb-1">
                  Description
                </label>
                <textarea
                  rows="4"
                  placeholder="Short description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

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
                </div>

                <button
                  onClick={handleUpload}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg"
                >
                  Upload Notes
                </button>
              </div>

            </div>
          </section>

          {/* 🔥 Learner Directory (DYNAMIC) */}
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
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4">
                      Loading...
                    </td>
                  </tr>
                ) : learners.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">
                      No learners found
                    </td>
                  </tr>
                ) : (
                  learners.map((s) => (
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

                      <td className="p-3 text-center">
                        {s.weakTopic || "-"}
                      </td>

                      <td className="p-3 text-center">
                        {s.tests}
                      </td>

                      <td className="p-3 text-center">
                        <button className="flex items-center gap-1 text-emerald-600 hover:underline mx-auto">
                          <Eye size={16} />
                          View
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>

          </section>

        </div>

        <DashboardFooter />
      </main>
    </>
  );
}