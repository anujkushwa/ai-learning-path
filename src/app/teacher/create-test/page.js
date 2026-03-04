"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TeacherNavbar from "@/components/TeacherNavbar";
import { Plus, Trash2, Save, Sparkles } from "lucide-react";

export default function CreateTest() {
  const router = useRouter();

  /* ---------------- STATES ---------------- */

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correct: "",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // AI states
  const [aiLevel, setAiLevel] = useState("Easy");
  const [aiCount, setAiCount] = useState(5);
  const [aiLoading, setAiLoading] = useState(false);

  /* ---------------- MANUAL TEST LOGIC ---------------- */

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correct: "",
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const updateQuestion = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const setCorrect = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correct = value;
    setQuestions(updated);
  };

  /* ---------------- AI GENERATE ---------------- */

  const generateAITest = async () => {
    if (!topic) {
      alert("Please enter topic first");
      return;
    }

    try {
      setAiLoading(true);

      const res = await fetch("/api/teacher/generate-ai-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          level: aiLevel,
          count: aiCount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setQuestions(data.questions);

    } catch (err) {
      console.error(err);
      alert("AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  /* ---------------- SAVE TEST ---------------- */

  const saveTest = async () => {
    if (!title || !topic || questions.length === 0) {
      alert("Please enter title, topic and questions");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/teacher/create-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          topic,
          questions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create test");
      }

      alert("Test created successfully!");
      router.push("/teacher/dashboard");

    } catch (err) {
      console.error(err);
      alert("Error creating test");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <TeacherNavbar />

      <main className="relative pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-6 overflow-hidden">

        <div className="relative max-w-5xl mx-auto">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-800">
              Create New Test
            </h1>
            <p className="text-gray-500 mt-1">
              Add questions manually or generate using AI
            </p>
          </div>

          {/* TITLE */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <label className="text-sm font-medium text-gray-600">
              Test Title
            </label>
            <input
              type="text"
              placeholder="e.g. Java Basics Test"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* TOPIC */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <label className="text-sm font-medium text-gray-600">
              Topic
            </label>
            <input
              type="text"
              placeholder="e.g. Java"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* AI GENERATE SECTION */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-600" />
              Generate with AI
            </h2>

            <div className="flex flex-wrap gap-4 items-center">

              <select
                value={aiLevel}
                onChange={(e) => setAiLevel(e.target.value)}
                className="border p-2 rounded-lg"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>

              <input
                type="number"
                min={1}
                max={50}
                value={aiCount}
                onChange={(e) => setAiCount(Number(e.target.value))}
                className="border p-2 rounded-lg w-28"
              />

              <button
                onClick={generateAITest}
                className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                {aiLoading ? "Generating..." : "Generate Test"}
              </button>

            </div>
          </div>

          {/* QUESTIONS */}
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="bg-white rounded-2xl shadow-md p-6 mb-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">
                  Question {qIndex + 1}
                </h2>

                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="Enter question"
                value={q.question}
                onChange={(e) =>
                  updateQuestion(qIndex, e.target.value)
                }
                className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-emerald-500 outline-none"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                {q.options.map((opt, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={opt}
                    onChange={(e) =>
                      updateOption(qIndex, oIndex, e.target.value)
                    }
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                ))}
              </div>

              <input
                type="text"
                placeholder="Correct Answer"
                value={q.correct}
                onChange={(e) =>
                  setCorrect(qIndex, e.target.value)
                }
                className="w-full p-3 border rounded-lg mt-4 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          ))}

          {/* BUTTONS */}
          <div className="flex gap-4 mb-24">
            <button
              onClick={addQuestion}
              className="flex items-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 rounded-lg font-medium transition"
            >
              <Plus size={18} />
              Add Question
            </button>

            <button
              onClick={saveTest}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg shadow-md transition disabled:opacity-60"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Test"}
            </button>
          </div>

        </div>
      </main>
    </>
  );
}