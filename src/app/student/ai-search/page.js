"use client";
import StudentNavbar from "@/components/StudentNavbar";
import { useState } from "react";

export default function AISearchPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    try {
      setLoading(true);

      const res = await fetch("/api/student/ai-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const result = await res.json();

      console.log("AI RESULT:", result); // 🔥 debug

      // ❌ Agar backend error bheje
      if (result.error) {
        alert(result.error);
        setData(null);
      } else {
        setData(result);
      }

    } catch (err) {
      console.error("Frontend Error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <StudentNavbar />

      {/* CONTENT (important spacing fix) */}
      <div className="pt-24 p-6">

        {/* HEADER */}
        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            🤖 AI Learning Search
          </h1>
          <p className="text-gray-500 mt-2">
            Search any skill and get curated videos, teachers & resources
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-md">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search like Frontend Development, React, Java..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center mt-6 text-blue-600 font-medium">
            ⏳ AI is generating best resources...
          </div>
        )}

        {/* RESULTS */}
        {data && (
          <div className="max-w-6xl mx-auto mt-8 grid md:grid-cols-2 gap-6">

            {/* VIDEOS */}
            <div className="bg-white p-5 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">📺 Best Videos</h2>

              {data.videos?.length > 0 ? (
                data.videos.map((v, i) => (
                  <div key={i} className="mb-4">
                    <a
                      href={v.link}
                      target="_blank"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      {v.title}
                    </a>

                    {/* iframe safe */}
                    {v.link?.includes("youtube") && (
                      <iframe
                        src={v.link.replace("watch?v=", "embed/")}
                        className="w-full h-48 mt-2 rounded-lg"
                      />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No videos found</p>
              )}
            </div>

            {/* TEACHERS */}
            <div className="bg-white p-5 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">👨‍🏫 Top Teachers</h2>

              {data.teachers?.length > 0 ? (
                data.teachers.map((t, i) => (
                  <div
                    key={i}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition"
                  >
                    ⭐ {t}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No teachers found</p>
              )}
            </div>

            {/* RESOURCES */}
            <div className="bg-white p-5 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">📚 Resources</h2>

              {data.resources?.length > 0 ? (
                data.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.link}
                    target="_blank"
                    className="block p-3 mb-2 bg-gray-50 rounded-lg hover:bg-green-50 text-green-700"
                  >
                    🔗 {r.title}
                  </a>
                ))
              ) : (
                <p className="text-gray-500">No resources found</p>
              )}
            </div>

            {/* ROADMAP */}
            <div className="bg-white p-5 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">🧠 Learning Roadmap</h2>

              {data.roadmap?.length > 0 ? (
                data.roadmap.map((step, i) => (
                  <div
                    key={i}
                    className="p-3 mb-2 border-l-4 border-blue-500 bg-blue-50 rounded"
                  >
                    {i + 1}. {step}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No roadmap found</p>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}