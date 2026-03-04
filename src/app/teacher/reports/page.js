"use client";

import { useEffect, useState } from "react";
import TeacherNavbar from "@/components/TeacherNavbar";
import DashboardFooter from "@/components/DashboardFooter";
import { FileText, Users, Layers } from "lucide-react";

export default function TeacherReports() {

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState(null);

  /* ---------------- LOAD REPORTS ---------------- */

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/teacher/reports");

        if (!res.ok) throw new Error("Failed to load reports");

        const data = await res.json();

        console.log("REPORT DATA:", data); // debug

        setReportData(data);

      } catch (err) {
        console.error(err);
        setError("Unable to load reports.");
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  if (loading) {
    return <div className="pt-24 text-center">Loading Reports...</div>;
  }

  if (error) {
    return <div className="pt-24 text-center text-red-500">{error}</div>;
  }

  if (!reportData) {
    return <div className="pt-24 text-center">No data found.</div>;
  }

  /* ---------------- FIXED TOPIC EXTRACTION ---------------- */

  const topicSet = new Set();

  reportData.topicReport?.forEach((t) => topicSet.add(t.topic));

  reportData.studentReport?.forEach((s) => {
    Object.keys(s.topics || {}).forEach((topic) => topicSet.add(topic));
  });

  const allTopics = Array.from(topicSet);

  return (
    <>
      <TeacherNavbar />

      <main className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-8">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-gray-800">
              Reports & Analytics
            </h1>
          </div>

          {/* SUMMARY */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">

            <SummaryCard
              icon={<Users />}
              title="Total Students"
              value={reportData.summary?.totalStudents || 0}
            />

            <SummaryCard
              icon={<Layers />}
              title="Topics Covered"
              value={reportData.summary?.totalTopics || 0}
            />

            <SummaryCard
              icon={<FileText />}
              title="Weakest Topic"
              value={reportData.summary?.weakestTopic || "N/A"}
            />

          </div>

          {/* TOPIC REPORT */}

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">

            <h2 className="text-xl font-semibold mb-6">
              Topic-wise Performance
            </h2>

            {reportData.topicReport.length === 0 ? (
              <p className="text-gray-500">No topic data available</p>
            ) : (

              <table className="w-full text-sm">

                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-left">Topic</th>
                    <th className="p-3 text-center">Average Score</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {reportData.topicReport.map((t) => (
                    <tr key={t.topic} className="border-b hover:bg-slate-50">

                      <td className="p-3 font-medium">{t.topic}</td>

                      <td className="p-3 text-center">{t.avgScore}%</td>

                      <td className="p-3 text-center">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            t.status === "Weak"
                              ? "bg-red-100 text-red-600"
                              : t.status === "Average"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {t.status}
                        </span>

                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            )}

          </div>

          {/* STUDENT REPORT */}

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-20">

            <h2 className="text-xl font-semibold mb-6">
              Student-wise Performance
            </h2>

            {reportData.studentReport.length === 0 ? (
              <p className="text-gray-500">No student results available</p>
            ) : (

              <table className="w-full text-sm">

                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-left">Student</th>

                    {allTopics.map((topic) => (
                      <th key={topic} className="p-3 text-center">
                        {topic}
                      </th>
                    ))}

                  </tr>
                </thead>

                <tbody>

                  {reportData.studentReport.map((s) => (

                    <tr
                      key={s.name}
                      className="border-b hover:bg-slate-50 cursor-pointer"
                      onClick={() => setSelectedStudent(s)}
                    >

                      <td className="p-3 font-medium text-indigo-600">
                        {s.name}
                      </td>

                      {allTopics.map((topic) => (
                        <td key={topic} className="p-3 text-center">
                          {s.topics?.[topic] ?? "-"}
                        </td>
                      ))}

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        </div>

        <DashboardFooter />

      </main>

      {/* STUDENT DETAIL MODAL */}

      {selectedStudent && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-xl shadow-xl p-8 w-[400px]">

            <h2 className="text-xl font-semibold mb-4">
              {selectedStudent.name} Performance
            </h2>

            <div className="space-y-2">

              {Object.entries(selectedStudent.topics).map(([topic, score]) => (

                <div key={topic} className="flex justify-between border-b pb-2">

                  <span>{topic}</span>
                  <span className="font-medium">{score}%</span>

                </div>

              ))}

            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-lg"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </>
  );
}

function SummaryCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">

      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>

    </div>
  );
}