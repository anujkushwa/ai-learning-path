"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import StudentNavbar from "@/components/StudentNavbar";
import StudentFooter from "@/components/StudentFooter";
import { Download } from "lucide-react";

export default function NoteDetail() {

  const params = useParams();
  const searchParams = useSearchParams();

  const id = params?.id;
  const studentId = searchParams.get("studentId") || 1;

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!id) return;

    fetch(`/api/notes/${id}?studentId=${studentId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load note");
        return res.json();
      })
      .then(data => {
        setNote(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("NOTE FETCH ERROR:", err);
        setLoading(false);
      });

  }, [id, studentId]);

  if (loading) {
    return (
      <div className="pt-24 text-center text-lg">
        Loading note...
      </div>
    );
  }

  if (!note) {
    return (
      <div className="pt-24 text-center text-red-500">
        Note not found
      </div>
    );
  }

  return (
    <>
      <StudentNavbar />

      <main className="pt-24 min-h-screen bg-gradient-to-br from-gray-50 via-sky-50 to-indigo-50 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">

          <h1 className="text-2xl font-semibold mb-2">
            {note.title}
          </h1>

          <p className="text-gray-500 mb-6">
            {note.description}
          </p>

          {/* PDF Preview */}
          <iframe
            src={`${encodeURI(note.file_url)}#toolbar=0`}
            className="w-full h-[500px] border rounded-lg mb-6"
          />

          {/* Download */}
          <a
            href={encodeURI(note.file_url)}
            download
            className="inline-flex items-center gap-2 px-6 py-3
            bg-gradient-to-r from-indigo-600 to-purple-600
            text-white rounded-lg hover:scale-105 transition"
          >
            <Download size={18} />
            Download
          </a>

        </div>
      </main>

      <StudentFooter />
    </>
  );
}