"use client";

import { useEffect, useState } from "react";
import StudentNavbar from "@/components/StudentNavbar";
import StudentFooter from "@/components/StudentFooter";
import Link from "next/link";
import { FileText } from "lucide-react";

export default function StudentNotesPage() {

  const [notes, setNotes] = useState([]);

  useEffect(() => {

    // later login system se studentId ayega
    const studentId = 1;

    fetch(`/api/notes?studentId=${studentId}`)
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error("NOTES FETCH ERROR:", err));

  }, []);

  return (
    <>
      <StudentNavbar />

      <main className="pt-24 min-h-screen bg-gradient-to-br from-gray-50 via-sky-50 to-indigo-50 px-6">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-3xl font-semibold mb-10">
            Study Notes
          </h1>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

            {notes.map((n) => (
              <Link
                key={n.id}
                href={`/student/notes/${n.id}`}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition block"
              >

                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <FileText />
                </div>

                <h2 className="font-semibold text-lg mb-1">
                  {n.title}
                </h2>

                <p className="text-sm text-gray-500 mb-4">
                  {n.description}
                </p>

                <span className="px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600">
                  {n.file_type}
                </span>

              </Link>
            ))}

          </div>

        </div>
      </main>

      <StudentFooter />
    </>
  );
}