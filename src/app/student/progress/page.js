"use client";

import StudentNavbar from "@/components/StudentNavbar";
import StudentFooter from "@/components/StudentFooter";
import { useEffect, useState } from "react";
import { Brain, Sparkles, Map, Loader2 } from "lucide-react";

export default function StudentProgress() {

  const [recentTopics, setRecentTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- LOAD TESTS ---------------- */
  useEffect(() => {
    async function loadTests() {
      try {
        const res = await fetch("/api/student/tests");
        const data = await res.json();
        setRecentTopics(Array.isArray(data) ? data : []);
      } catch (err) {
        setRecentTopics([]);
      } finally {
        setLoadingTopics(false);
      }
    }
    loadTests();
  }, []);

  /* ---------------- AI CALL ---------------- */
  async function handleTopicClick(topicObj) {
    try {
      setSelectedTopic(topicObj);
      setLoadingAI(true);
      setAiResult(null);
      setError(null);

      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicObj.topic,
          score: topicObj.score,
          missed: [],
        }),
      });

      const data = await res.json();

      setAiResult({
        feedback: data.mentor_analysis || [],
        roadmap: data.remedy_roadmap || [],
      });

    } catch (err) {
      setError("Unable to load AI feedback.");
    } finally {
      setLoadingAI(false);
    }
  }

  return (
    <>
      <StudentNavbar />

      <main className="pt-24 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-6">

        <div className="max-w-6xl mx-auto space-y-12">

          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Performance Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
              Click on a topic to get AI-powered improvement suggestions.
            </p>
          </div>

          {/* ---------------- TEST CARDS ---------------- */}
          {loadingTopics ? (
            <p className="text-indigo-600 font-medium">
              Loading your performance...
            </p>
          ) : recentTopics.length === 0 ? (
            <p className="text-gray-500">
              No tests attempted yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">

              {recentTopics.map((t, index) => {

                const badgeColor =
                  t.status === "Weak"
                    ? "bg-red-100 text-red-600"
                    : t.status === "Average"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-600";

                return (
                  <div
                    key={t.id ?? index}
                    onClick={() => handleTopicClick(t)}
                    className={`cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300
                      ${selectedTopic?.topic === t.topic && "ring-2 ring-indigo-500"}`}
                  >
                    {/* Topic */}
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t.topic}
                    </h3>

                    {/* Score */}
                    <div className="mt-4 flex items-center justify-between">

                      <div>
                        <p className="text-2xl font-bold text-indigo-600">
                          {t.score}%
                        </p>
                        <p className="text-sm text-gray-500">
                          Your Score
                        </p>
                      </div>

                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${badgeColor}`}>
                        {t.status}
                      </span>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

          {/* ---------------- AI RESULT ---------------- */}
          {selectedTopic && (
            <section className="bg-white rounded-2xl shadow-xl p-10 space-y-8 transition-all">

              <h2 className="text-xl font-semibold flex items-center gap-2 text-indigo-700">
                <Brain />
                AI Analysis for {selectedTopic.topic}
              </h2>

              {/* Loading */}
              {loadingAI && (
                <div className="flex items-center gap-3 text-indigo-600">
                  <Loader2 className="animate-spin" />
                  Generating smart feedback...
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-red-500 font-medium">{error}</p>
              )}

              {/* Result */}
              {aiResult && !loadingAI && (
                <div className="grid md:grid-cols-2 gap-10">

                  {/* Feedback */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="text-indigo-600" />
                      Strengths & Weaknesses
                    </h3>

                    <ul className="space-y-3">
                      {aiResult.feedback.map((f, i) => (
                        <li key={i} className="bg-indigo-50 p-3 rounded-lg text-sm">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Roadmap */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Map className="text-indigo-600" />
                      Improvement Roadmap
                    </h3>

                    <ol className="space-y-3">
                      {aiResult.roadmap.map((r, i) => (
                        <li key={i} className="bg-green-50 p-3 rounded-lg text-sm">
                          {r}
                        </li>
                      ))}
                    </ol>
                  </div>

                </div>
              )}

            </section>
          )}

        </div>
      </main>

      <StudentFooter />
    </>
  );
}