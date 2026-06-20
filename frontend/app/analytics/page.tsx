"use client";

import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const farmId =
      localStorage.getItem("farm_id");

    fetch(
      `http://localhost:8000/api/v1/analytics/${farmId}`
    )
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error);
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-black">
        Loading Analytics...
      </div>
    );
  }

  const healthPercent =
    stats.total > 0
      ? (
          (stats.healthy /
            stats.total) *
          100
        ).toFixed(1)
      : 0;

  const vaccinationPercent =
    stats.total > 0
      ? (
          (stats.vaccinated /
            stats.total) *
          100
        ).toFixed(1)
      : 0;

  const healthData = [
    {
      name: "Healthy",
      value: stats.healthy,
    },
    {
      name: "Sick",
      value: stats.sick,
    },
  ];

  const animalData = [
    {
      name: "Cows",
      value: stats.cows,
    },
    {
      name: "Goats",
      value: stats.goats,
    },
    {
      name: "Sheep",
      value: stats.sheep,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-8">

      <div className="mb-10">
        <h1 className="text-5xl font-black text-gray-800">
          📊 Farm Analytics
        </h1>

        <p className="text-gray-500 mt-2">
          Smart Livestock Insights
        </p>
      </div>

      {/* KPI */}

      <div className="grid md:grid-cols-5 gap-5 mb-8">

        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <h2>Total Animals</h2>
          <p className="text-5xl font-black">
            {stats.total}
          </p>
        </div>

        <div className="bg-green-100 p-6 rounded-3xl shadow-lg">
          <h2>Healthy</h2>
          <p className="text-5xl font-black text-green-700">
            {stats.healthy}
          </p>
        </div>

        <div className="bg-red-100 p-6 rounded-3xl shadow-lg">
          <h2>Sick</h2>
          <p className="text-5xl font-black text-red-700">
            {stats.sick}
          </p>
        </div>

        <div className="bg-pink-100 p-6 rounded-3xl shadow-lg">
          <h2>Pregnant</h2>
          <p className="text-5xl font-black text-pink-700">
            {stats.pregnant}
          </p>
        </div>

        <div className="bg-yellow-100 p-6 rounded-3xl shadow-lg">
          <h2>Vaccinated</h2>
          <p className="text-5xl font-black text-yellow-700">
            {stats.vaccinated}
          </p>
        </div>

      </div>

      {/* Progress */}

      <div className="grid md:grid-cols-2 gap-6 mb-8">

        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <h2 className="text-2xl font-black mb-4">
            ❤️ Health Score
          </h2>

          <div className="w-full h-6 bg-gray-200 rounded-full">
            <div
              className="h-6 bg-green-500 rounded-full"
              style={{
                width: `${healthPercent}%`,
              }}
            />
          </div>

          <p className="text-4xl font-black mt-4 text-green-700">
            {healthPercent}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <h2 className="text-2xl font-black mb-4">
            💉 Vaccination Coverage
          </h2>

          <div className="w-full h-6 bg-gray-200 rounded-full">
            <div
              className="h-6 bg-blue-500 rounded-full"
              style={{
                width: `${vaccinationPercent}%`,
              }}
            />
          </div>

          <p className="text-4xl font-black mt-4 text-blue-700">
            {vaccinationPercent}%
          </p>
        </div>

      </div>

      {/* Charts */}

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white rounded-3xl shadow-lg p-6 h-[450px]">

          <h2 className="text-2xl font-black mb-4">
            🩺 Health Distribution
          </h2>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={healthData}
                dataKey="value"
                outerRadius={130}
                label
              >
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 h-[450px]">

          <h2 className="text-2xl font-black mb-4">
            🐄 Animal Distribution
          </h2>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={animalData}
                dataKey="value"
                outerRadius={130}
                label
              >
                <Cell fill="#22c55e" />
                <Cell fill="#3b82f6" />
                <Cell fill="#f59e0b" />
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* Risk Analysis */}

      <div className="grid md:grid-cols-3 gap-6 mt-8">

        <div className="bg-red-100 p-6 rounded-3xl shadow-lg">
          <h2 className="font-bold text-xl">
            High Risk
          </h2>

          <p className="text-5xl font-black text-red-600">
            {stats.high_risk}
          </p>
        </div>

        <div className="bg-yellow-100 p-6 rounded-3xl shadow-lg">
          <h2 className="font-bold text-xl">
            Medium Risk
          </h2>

          <p className="text-5xl font-black text-yellow-600">
            {stats.medium_risk}
          </p>
        </div>

        <div className="bg-green-100 p-6 rounded-3xl shadow-lg">
          <h2 className="font-bold text-xl">
            Low Risk
          </h2>

          <p className="text-5xl font-black text-green-600">
            {stats.low_risk}
          </p>
        </div>

      </div>

    </div>
  );
}