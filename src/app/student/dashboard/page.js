"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import StudentNavbar from "@/components/StudentNavbar";
import StudentFooter from "@/components/StudentFooter";

import { BookOpen, TrendingUp, AlertTriangle } from "lucide-react";

export default function StudentDashboard() {

  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [results, setResults] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- ROLE SECURITY ---------- */
  useEffect(() => {

    if (!isLoaded) return;

    const role = user?.unsafeMetadata?.role;

    if (role !== "student") {
      router.replace("/select-role");
    }

  }, [user, isLoaded, router]);

  /* ---------- LOAD DASHBOARD (FIXED 🔥) ---------- */
  useEffect(() => {

    if (!isLoaded) return;

    async function loadDashboard() {
      try {

        const res = await fetch("/api/student/dashboard", {
          cache: "no-store" // 🔥 FIX: no caching
        });

        if (!res.ok) {
          console.warn("Dashboard API failed");
          setResults([]);
          return;
        }

        const data = await res.json();

        setResults(Array.isArray(data) ? data : []);

      } catch (err) {

        console.error("Dashboard error:", err);
        setResults([]);

      } finally {

        setLoading(false);

      }
    }

    loadDashboard();

  }, [isLoaded]);

  /* ---------- AUTO REFRESH (OPTIONAL 🔥) ---------- */
  useEffect(() => {

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/student/dashboard", {
          cache: "no-store"
        });

        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);

      } catch (err) {
        console.warn("Auto refresh failed");
      }
    }, 5000); // every 5 sec

    return () => clearInterval(interval);

  }, []);

  /* ---------- LOAD AI SUGGESTIONS ---------- */
  useEffect(() => {

    async function loadSuggestions() {
      try {

        const res = await fetch("/api/student/recommendations", {
          cache: "no-store"
        });

        if (!res.ok) return;

        const data = await res.json();

        setRecommendation(data);

      } catch (err) {
        console.warn("Recommendation API error");
      }
    }

    loadSuggestions();

  }, []);

  /* ---------- CALCULATIONS ---------- */

  const testsTaken = results.length;

  const averageScore =
    testsTaken === 0
      ? 0
      : Math.round(
          results.reduce((sum, r) => sum + Number(r.score || 0), 0) /
            testsTaken
        );

  let weakTopic = "N/A";

  if (results.length > 0) {
    const sorted = [...results].sort((a, b) => a.score - b.score);
    weakTopic = sorted[0]?.topic || "N/A";
  }

  return (
    <>
      <StudentNavbar />

      <main className="relative pt-24 min-h-screen px-6 overflow-hidden">

        {/* BACKGROUND */}
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-purple-300 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] bg-indigo-300 rounded-full blur-[120px] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto">

          <h1 className="text-3xl font-semibold text-gray-800 mb-8">
            Student Dashboard
          </h1>

          {loading ? (
            <p>Loading dashboard...</p>
          ) : (
            <>

              {/* STATS */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">

                <StatCard
                  icon={<BookOpen size={22} />}
                  title="Tests Attempted"
                  value={testsTaken}
                />

                <StatCard
                  icon={<TrendingUp size={22} />}
                  title="Average Score"
                  value={`${averageScore}%`}
                />

                <StatCard
                  icon={<AlertTriangle size={22} />}
                  title="Weak Topic"
                  value={weakTopic}
                />

              </div>

              {/* RECENT TESTS */}
              <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-lg p-6 mb-12 border border-white">

                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                  Recent Tests
                </h2>

                {results.length === 0 ? (
                  <p className="text-gray-500">
                    No tests attempted yet.
                  </p>
                ) : (
                  <div className="divide-y">

                    {results.slice(0, 5).map((test, i) => (

                      <div
                        key={i}
                        className="flex justify-between items-center py-4"
                      >

                        <p className="font-medium text-gray-800">
                          {test.topic}
                        </p>

                        <span
                          className={`px-4 py-1 rounded-full text-sm font-medium
                          ${
                            test.score < 40
                              ? "bg-red-100 text-red-700"
                              : test.score < 70
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {test.score}%
                        </span>

                      </div>

                    ))}

                  </div>
                )}

              </div>

              {/* AI SUGGESTION */}
              {recommendation?.weakTopic && (

                <div className="bg-white rounded-xl shadow-lg p-6 mb-12">

                  <h2 className="text-lg font-semibold mb-4">
                    AI Learning Suggestion
                  </h2>

                  <p className="mb-3">
                    Weak Topic:
                    <span className="ml-2 font-semibold text-red-600">
                      {recommendation.weakTopic}
                    </span>
                  </p>

                  {recommendation.video && (

                    <a
                      href={recommendation.video}
                      target="_blank"
                      className="text-indigo-600 underline"
                    >
                      Watch Recommended Video
                    </a>

                  )}

                </div>

              )}

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 mb-16">

                <a
                  href="/student/test"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:scale-105 transition"
                >
                  Attempt Test
                </a>

                <a
                  href="/student/notes"
                  className="px-6 py-3 bg-white/70 backdrop-blur border border-white rounded-lg font-medium hover:bg-white transition"
                >
                  View Notes
                </a>

              </div>

            </>
          )}

        </div>
      </main>

      <StudentFooter />
    </>
  );
}

/* ---------- COMPONENT ---------- */

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-lg p-6 flex items-center gap-5 border border-white">

      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>
      </div>

    </div>
  );
}