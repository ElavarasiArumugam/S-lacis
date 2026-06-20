"use client";

import { useEffect, useState } from "react";

export default function AlertsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const farmId = localStorage.getItem("farm_id");

    fetch(`http://localhost:8000/api/v1/alerts/${farmId}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(console.error);
  }, []);

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background:
          "linear-gradient(to bottom right, #fef2f2, #fff7ed, #f8fafc)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-10">
          <h1 className="text-5xl font-black text-gray-800">
            🚨 Disease Alerts
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Monitor livestock health risks and disease outbreaks in real time.
          </p>
        </div>

        {data && (
          <>
            {/* Statistics */}

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-red-200">
                <h3 className="text-gray-500 font-semibold">
                  Sick Animals
                </h3>

                <p className="text-4xl font-black text-red-600 mt-2">
                  {data.sick_animals}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-yellow-200">
                <h3 className="text-gray-500 font-semibold">
                  High Risk Animals
                </h3>

                <p className="text-4xl font-black text-yellow-600 mt-2">
                  {data.high_risk}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-200">
                <h3 className="text-gray-500 font-semibold">
                  Farm Health Status
                </h3>

                <p className="text-4xl font-black text-green-600 mt-2">
                  Active
                </p>
              </div>
            </div>

            {/* Alert Cards */}

            {data.animals.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
                <h2 className="text-2xl font-bold text-green-700">
                  ✅ No Active Disease Alerts
                </h2>

                <p className="text-gray-500 mt-3">
                  All livestock are currently healthy.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.animals.map(
                  (a: any, index: number) => (
                    <div
                      key={index}
                      className="
                      bg-white/80
                      backdrop-blur-md
                      rounded-3xl
                      p-6
                      border
                      border-red-100
                      shadow-lg
                      hover:shadow-2xl
                      hover:-translate-y-2
                      hover:scale-105
                      transition-all
                      duration-300
                      "
                    >
                      {/* Top */}

                      <div className="flex justify-between items-center mb-4">
                        <div className="text-5xl">
                          🚨
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            a.status === "Healthy"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>

                      {/* Title */}

                      <h2 className="text-2xl font-black text-gray-800 mb-4">
                        Alert Record
                      </h2>

                      {/* Details */}

                      <div className="space-y-3 text-gray-700">
                        <p>
                          <span className="font-bold">
                            Animal ID:
                          </span>{" "}
                          {a.animal_id}
                        </p>

                        <p>
                          <span className="font-bold">
                            Health Status:
                          </span>{" "}
                          {a.status}
                        </p>

                        <p>
                          <span className="font-bold">
                            Risk Level:
                          </span>{" "}
                          {a.risk_level}
                        </p>
                      </div>

                      {/* Footer */}

                      <div className="mt-6">
                        <div
                          className={`text-center py-3 rounded-xl font-bold text-white ${
                            a.risk_level === "High"
                              ? "bg-red-500"
                              : a.risk_level === "Medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        >
                          {a.risk_level} Risk
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}