"use client";

import { useEffect, useState } from "react";

export default function ProductionPage() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://s-lacis.onrender.com/api/v1/production/")
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch(console.error);
  }, []);

  const totalProduction = records.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background:
          "linear-gradient(to bottom right, #f8fafc, #fff7ed, #fffbeb)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-10">
          <h1 className="text-5xl font-black text-gray-800">
            📈 Production Monitoring
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Monitor milk, egg, wool and livestock production records.
          </p>
        </div>

        {/* Statistics */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-orange-200">
            <h3 className="text-gray-500 font-semibold">
              Total Records
            </h3>

            <p className="text-4xl font-black text-orange-600 mt-2">
              {records.length}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-yellow-200">
            <h3 className="text-gray-500 font-semibold">
              Total Production
            </h3>

            <p className="text-4xl font-black text-yellow-600 mt-2">
              {totalProduction}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-200">
            <h3 className="text-gray-500 font-semibold">
              Monitoring Status
            </h3>

            <p className="text-4xl font-black text-green-600 mt-2">
              Active
            </p>
          </div>
        </div>

        {/* Production Cards */}

        {records.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700">
              No Production Records Found
            </h2>

            <p className="text-gray-500 mt-3">
              Production data will appear here once recorded.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {records.map((r: any) => (
              <div
                key={r.id}
                className="
                bg-white/80
                backdrop-blur-md
                rounded-3xl
                p-6
                border
                border-orange-100
                shadow-lg
                hover:shadow-2xl
                hover:-translate-y-2
                hover:scale-105
                transition-all
                duration-300
                "
              >
                {/* Icon */}

                <div className="flex justify-between items-center mb-4">
                  <div className="text-5xl">
                    {r.production_type?.toLowerCase() ===
                    "milk"
                      ? "🥛"
                      : r.production_type?.toLowerCase() ===
                        "egg"
                      ? "🥚"
                      : r.production_type?.toLowerCase() ===
                        "wool"
                      ? "🐑"
                      : "📦"}
                  </div>

                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                    {r.production_type}
                  </span>
                </div>

                {/* Title */}

                <h2 className="text-2xl font-black text-gray-800 mb-4">
                  Production Record
                </h2>

                {/* Details */}

                <div className="space-y-3 text-gray-700">
                  <p>
                    <span className="font-bold">
                      Animal ID:
                    </span>{" "}
                    {r.animal_id}
                  </p>

                  <p>
                    <span className="font-bold">
                      Production Type:
                    </span>{" "}
                    {r.production_type}
                  </p>

                  <p>
                    <span className="font-bold">
                      Quantity:
                    </span>{" "}
                    {r.quantity}
                  </p>

                  <p>
                    <span className="font-bold">
                      Record Date:
                    </span>{" "}
                    {r.record_date}
                  </p>
                </div>

                {/* Footer */}

                <div className="mt-6">
                  <div className="bg-orange-500 text-white text-center py-3 rounded-xl font-bold">
                    Production Logged ✓
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}