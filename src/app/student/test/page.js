"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StudentNavbar from "@/components/StudentNavbar";
import { ClipboardList, Clock, Play } from "lucide-react";

export default function StudentTestPage() {

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD TESTS ---------------- */
  useEffect(() => {
    fetch("/api/student/tests/all")
      .then(res => res.json())
      .then(data => {
        setTests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <StudentNavbar />

      <main className="relative pt-24 min-h-screen bg-gradient-to-br from-gray-50 via-sky-50 to-blue-50 px-6 overflow-hidden">

        <div className="relative max-w-7xl mx-auto">

          {/* HEADER */}
          <h1 className="text-3xl font-semibold text-gray-800 mb-10">
            Available Tests
          </h1>

          {/* LOADING */}
          {loading && (
            <p className="text-indigo-600 font-medium">
              Loading tests...
            </p>
          )}

          {/* EMPTY */}
          {!loading && tests.length === 0 && (
            <p className="text-gray-500">
              No tests available.
            </p>
          )}

          {/* GRID */}
          {!loading && tests.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8">

              {tests.map((test) => {

                const questionCount = Number(test.questions_count) || 0;
                const duration = questionCount * 2;

                return (
                  <div
                    key={test.id}
                    className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border"
                  >

                    {/* HEADER ROW */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg">
                        <ClipboardList />
                      </div>

                      <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium">
                        {questionCount} Questions
                      </span>
                    </div>

                    {/* TITLE */}
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      {test.title}
                    </h2>

                    {/* TOPIC */}
                    <p className="text-sm text-gray-500 mb-4">
                      Topic: {test.topic}
                    </p>

                    {/* INFO ROW */}
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-6">

                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {duration} mins
                      </span>

                      {test.difficulty && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${test.difficulty === "Easy" && "bg-green-100 text-green-600"}
                          ${test.difficulty === "Medium" && "bg-yellow-100 text-yellow-600"}
                          ${test.difficulty === "Hard" && "bg-red-100 text-red-600"}
                        `}>
                          {test.difficulty}
                        </span>
                      )}

                    </div>

                    {/* BUTTON */}
                    <Link
                      href={`/student/test/${test.id}`}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                      bg-gradient-to-r from-indigo-600 to-purple-600
                      text-white font-medium hover:scale-105 transition"
                    >
                      <Play size={16} />
                      Start Test
                    </Link>

                  </div>
                );
              })}

            </div>
          )}

        </div>
      </main>
    </>
  );
}