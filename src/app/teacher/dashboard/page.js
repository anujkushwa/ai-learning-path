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
        const res = await fetch("/api/teacher/analytics", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("❌ Analytics API failed");
          setAnalysis([]);
          return;
        }

        const data = await res.json();
        console.log("✅ API DATA:", data); // DEBUG

        /* -------- SAFE MAPPING (IMPORTANT FIX) -------- */
        const formatted = Array.isArray(data)
          ? data.map((item) => {
              const avgValue =
                item.avg ??
                item.average ??
                item.score ??
                item.marks ??
                0;

              return {
                topic:
                  item.topic ??
                  item.subject ??
                  item.name ??
                  "Unknown",

                avg: Number(avgValue),

                status: getStatus(Number(avgValue)),
              };
            })
          : [];

        setAnalysis(formatted);

      } catch (err) {
        console.error("❌ API Error:", err);
        setAnalysis([]);
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

  /* ---------------- EMPTY DATA ---------------- */
  if (analysis.length === 0) {
    return (
      <>
        <TeacherNavbar />
        <p className="pt-24 text-center text-red-500">
          No data found from backend ⚠️
        </p>
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
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">

          <h2 className="text-xl font-semibold mb-6">
            📊 Topic Insights
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {analysis.map((t) => {
              const isWeak = t.status === "Weak";
              const isAverage = t.status === "Average";

              return (
                <div
                  key={t.topic}
                  className="p-5 rounded-xl border shadow-sm hover:shadow-lg transition"
                >

                  <div className="flex justify-between mb-3">
                    <div>
                      {isWeak ? <AlertTriangle /> : <TrendingUp />}
                    </div>

                    <span className="text-sm font-medium">
                      {t.status}
                    </span>
                  </div>

                  <h3 className="font-semibold mb-2">
                    {t.topic}
                  </h3>

                  <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                    <div
                      className="h-2 bg-emerald-500 rounded-full"
                      style={{ width: `${t.avg}%` }}
                    />
                  </div>

                  <p className="text-sm">
                    Avg: {t.avg.toFixed(1)}%
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