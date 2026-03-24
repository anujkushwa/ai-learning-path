"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StudentNavbar from "@/components/StudentNavbar";

export default function TakeTest() {

  const { id } = useParams();
  const router = useRouter();

  const [test, setTest] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(15 * 60);

  /* ---------------- LOAD TEST ---------------- */
  useEffect(() => {
    async function loadTest() {
      try {
        const res = await fetch(`/api/student/tests/${id}`, {
          cache: "no-store"
        });

        const data = await res.json();
        setTest(data);

      } catch (err) {
        console.error("Load test error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTest();
  }, [id]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (!test) return;

    if (timeLeft <= 0) {
      submitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, test]);

  /* ---------------- FORMAT TIME ---------------- */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  /* ---------------- SUBMIT TEST (FIXED 🔥) ---------------- */
  async function submitTest() {

    if (!test || submitted) return;

    setSubmitted(true);

    let score = 0;

    test.questions.forEach((q, index) => {
      if (selected[index] === q.correct) {
        score++;
      }
    });

    const finalScore = Math.round(
      (score / test.questions.length) * 100
    );

    try {

      console.log("🚀 Submitting test...");

      const res = await fetch("/api/tests/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId: Number(id),
          topic: test.topic,
          score: finalScore,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ API Error:", errText);
        throw new Error("Submit failed");
      }

      const data = await res.json();
      console.log("✅ Submit success:", data);

      alert(`Test submitted! Your score: ${finalScore}%`);

      // 🔥 IMPORTANT FIX: wait before redirect
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.replace("/student/dashboard");

    } catch (err) {

      console.error("❌ Submit error:", err);
      alert("Failed to submit test ❌");

      setSubmitted(false);
    }
  }

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <>
        <StudentNavbar />
        <p className="pt-24 text-center">Loading...</p>
      </>
    );
  }

  /* ---------------- EMPTY ---------------- */
  if (!test || !test.questions || test.questions.length === 0) {
    return (
      <>
        <StudentNavbar />
        <p className="pt-24 text-center">No questions found.</p>
      </>
    );
  }

  const totalQuestions = test.questions.length;
  const progressPercent = ((current + 1) / totalQuestions) * 100;

  return (
    <>
      <StudentNavbar />

      <main className="pt-24 min-h-screen bg-gray-100 px-6">

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">

            <div>
              <h2 className="text-xl font-semibold">
                {test.title}
              </h2>
              <p className="text-sm text-gray-500">
                Question {current + 1} of {totalQuestions}
              </p>
            </div>

            <div className={`px-4 py-2 rounded-lg font-semibold 
              ${timeLeft < 60
                ? "bg-red-100 text-red-600"
                : "bg-indigo-100 text-indigo-600"}`}>
              ⏳ {formatTime(timeLeft)}
            </div>

          </div>

          {/* PROGRESS */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* QUESTION */}
          <p className="font-medium mb-4">
            {test.questions[current].question}
          </p>

          {/* OPTIONS */}
          <div className="space-y-3">
            {test.questions[current].options.map((opt) => (
              <label
                key={opt}
                className={`block p-3 rounded-lg border cursor-pointer
                  ${selected[current] === opt
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-300 hover:bg-gray-50"
                  }`}
              >
                <input
                  type="radio"
                  className="hidden"
                  checked={selected[current] === opt}
                  onChange={() =>
                    setSelected({ ...selected, [current]: opt })
                  }
                />
                {opt}
              </label>
            ))}
          </div>

          {/* NAVIGATION */}
          <div className="flex justify-between mt-8">

            <button
              disabled={current === 0}
              onClick={() => setCurrent(c => c - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <button
              disabled={submitted}
              onClick={() =>
                current === totalQuestions - 1
                  ? submitTest()
                  : setCurrent(c => c + 1)
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              {current === totalQuestions - 1
                ? "Submit"
                : "Next"}
            </button>

          </div>

        </div>
      </main>
    </>
  );
}