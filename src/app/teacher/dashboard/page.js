"use client";
  import { AlertTriangle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

import TeacherNavbar from "@/components/TeacherNavbar";
import DashboardFooter from "@/components/DashboardFooter";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

/* ---------------- CHART REGISTER ---------------- */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

/* ---------------- HELPERS ---------------- */
const getStatus = (avg) => {
  if (avg < 40) return "Weak";
  if (avg < 70) return "Average";
  return "Strong";
};

/* ================================================= */

export default function TeacherDashboard() {

  /* ---------------- STATES ---------------- */
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showTopics, setShowTopics] = useState(false);
  const [showAIPlan, setShowAIPlan] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("default");

  /* ---------------- FETCH ANALYTICS ---------------- */
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await fetch("/api/teacher/analytics");
        const data = await res.json();

        const formatted = data.map((item) => ({
          topic: item.topic,
          avg: Number(item.avg),
          status: getStatus(Number(item.avg)),
        }));

        setAnalysis(formatted);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <>
        <TeacherNavbar />
        <p className="pt-24 text-center">Loading analytics...</p>
      </>
    );
  }

  /* ---------------- DERIVED DATA ---------------- */
  const labels = analysis.map((t) => t.topic);
  const values = analysis.map((t) => t.avg);

  const weakestTopic =
    analysis.find((t) => t.status === "Weak")?.topic || "None";

  const strongCount = analysis.filter(
    (t) => t.status === "Strong"
  ).length;

  const weakCount = analysis.filter(
    (t) => t.status === "Weak"
  ).length;

  const overallLevel =
    analysis.length === 0
      ? "N/A"
      : strongCount > weakCount
      ? "Good"
      : "Needs Improvement";

  const weakTopics = analysis.filter(
    (t) => t.status === "Weak"
  );

  /* ---------------- FILTER + SORT ---------------- */
  let filteredTopics = analysis.filter((t) =>
    t.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortType === "high") {
    filteredTopics.sort((a, b) => b.avg - a.avg);
  }

  if (sortType === "low") {
    filteredTopics.sort((a, b) => a.avg - b.avg);
  }

  /* ---------------- CHART DATA ---------------- */
  const barData = {
    labels,
    datasets: [
      {
        label: "Average Score",
        data: values,
        backgroundColor: "#10b981",
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: "Performance Trend",
        data: values,
        borderColor: "#0d9488",
        backgroundColor: "rgba(13,148,136,0.1)",
        fill: true,
        tension: 0.45,
        pointRadius: 5,
      },
    ],
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      <TeacherNavbar />

      <main className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-8">

        <h1 className="text-3xl font-semibold mb-8">
          Teacher Dashboard
        </h1>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <StatCard
            title="Total Topics"
            value={analysis.length}
            onClick={() => setShowTopics(true)}
          />

          <StatCard
            title="Weakest Topic"
            value={weakestTopic}
            onClick={() => setShowTopics(true)}
          />

          <StatCard
            title="Overall Level"
            value={overallLevel}
            onClick={() => setShowAIPlan(true)}
          />

        </div>

        {/* INSIGHTS */}
     

<div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl shadow-xl p-8 mb-12 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">

  <div className="flex items-center justify-between mb-8">
    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
      📊 Topic Insights
    </h2>
    <span className="text-sm text-slate-500 dark:text-slate-400">
      Performance Overview
    </span>
  </div>

  <div className="grid md:grid-cols-3 gap-8">

    {analysis.map((t) => {
      const isWeak = t.status === "Weak";
      const isAverage = t.status === "Average";

      return (
        <div
          key={t.topic}
          className="group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
        >
          
          {/* Top Section */}
          <div className="flex items-center justify-between mb-4">
            
            <div className={`p-3 rounded-xl ${
              isWeak
                ? "bg-red-100 text-red-600"
                : isAverage
                ? "bg-yellow-100 text-yellow-600"
                : "bg-emerald-100 text-emerald-600"
            }`}>
              {isWeak ? <AlertTriangle size={20} /> : <TrendingUp size={20} />}
            </div>

            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isWeak
                ? "bg-red-100 text-red-600"
                : isAverage
                ? "bg-yellow-100 text-yellow-600"
                : "bg-emerald-100 text-emerald-600"
            }`}>
              {t.status}
            </span>

          </div>

          {/* Topic Name */}
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
            {t.topic}
          </h3>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                isWeak
                  ? "bg-red-500"
                  : isAverage
                  ? "bg-yellow-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${t.avg}%` }}
            ></div>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Avg Score: <span className="font-semibold">{t.avg.toFixed(1)}%</span>
          </p>

        </div>
      );
    })}

  </div>
</div>

        {/* CHARTS */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">

          <ChartCard title="Topic-wise Average Performance">
            <Bar data={barData} />
          </ChartCard>

          <ChartCard title="Overall Learning Trend">
            <Line data={lineData} />
          </ChartCard>

        </div>

        {/* TOPIC MODAL */}
        {showTopics && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[600px] max-h-[80vh] overflow-y-auto rounded-2xl p-6">

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  All Topics
                </h2>

                <button
                  onClick={() => setShowTopics(false)}
                  className="text-red-500"
                >
                  Close
                </button>
              </div>

              <input
                type="text"
                placeholder="Search topic..."
                className="w-full border rounded-lg px-3 py-2 mb-4"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

              <div className="flex gap-3 mb-4">

                <button
                  onClick={() => setSortType("high")}
                  className="px-3 py-1 bg-emerald-100 rounded-lg"
                >
                  High → Low
                </button>

                <button
                  onClick={() => setSortType("low")}
                  className="px-3 py-1 bg-emerald-100 rounded-lg"
                >
                  Low → High
                </button>

                <button
                  onClick={() => setSortType("default")}
                  className="px-3 py-1 bg-gray-100 rounded-lg"
                >
                  Reset
                </button>

              </div>

              <div className="space-y-3">

                {filteredTopics.map((t) => (
                  <div
                    key={t.topic}
                    className="p-4 bg-slate-50 rounded-xl border flex justify-between"
                  >
                    <span>{t.topic}</span>
                    <span className="font-medium">
                      {t.avg.toFixed(1)}%
                    </span>
                  </div>
                ))}

              </div>

            </div>

          </div>
        )}

        {/* AI PLAN MODAL */}
        {showAIPlan && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[650px] max-h-[80vh] overflow-y-auto rounded-2xl p-6">

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  🤖 AI Teaching Recommendation
                </h2>

                <button
                  onClick={() => setShowAIPlan(false)}
                  className="text-red-500"
                >
                  Close
                </button>
              </div>

              <h3 className="font-semibold mb-2">
                📌 Weak Areas Detected
              </h3>

              {weakTopics.length === 0 ? (
                <p className="text-emerald-600 mb-4">
                  No weak topics detected 🎉
                </p>
              ) : (
                <ul className="list-disc pl-5 mb-4">
                  {weakTopics.map((t) => (
                    <li key={t.topic}>
                      {t.topic} (Avg {t.avg.toFixed(1)}%)
                    </li>
                  ))}
                </ul>
              )}

              <h3 className="font-semibold mb-2">
                🛣 Step-by-Step Teaching Path
              </h3>

              <ol className="list-decimal pl-5 space-y-2">
                <li>Revise basics of weak topics</li>
                <li>Explain using simple examples</li>
                <li>Give daily practice</li>
                <li>Short quizzes</li>
                <li>Revise average topics</li>
                <li>Weekly mock test</li>
                <li>Re-evaluate progress</li>
              </ol>

            </div>

          </div>
        )}

        <DashboardFooter />
      </main>
    </>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ title, value, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-semibold text-emerald-600 mt-2">
        {value}
      </h2>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
