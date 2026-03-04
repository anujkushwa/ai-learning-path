"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function ProgressChart({ tests }) {

  const data = {
    labels: tests.map(t => t.topic),
    datasets: [
      {
        label: "Score %",
        data: tests.map(t => t.score)
      }
    ]
  };

  return <Bar data={data} />;
}
