"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AnimalDetails() {
  const params = useParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [animal, setAnimal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchAnimal() {
      try {
        const response = await fetch(
          `https://s-lacis.onrender.com/api/v1/animals/${id}`
        );

        const data = await response.json();

        setAnimal(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnimal();
  }, [id]);

  const getAnimalIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "cow":
        return "🐄";
      case "goat":
        return "🐐";
      case "sheep":
        return "🐑";
      case "poultry":
        return "🐔";
      default:
        return "🐾";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-3xl font-bold text-green-600 animate-pulse">
          Loading Animal Details...
        </h1>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-3xl font-bold text-red-500">
          Animal Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-8">

      <div className="max-w-6xl mx-auto">

        {/* Header Card */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-green-100">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-6">

              <div className="text-8xl">
                {getAnimalIcon(animal.animal_type)}
              </div>

              <div>
                <h1 className="text-5xl font-black text-gray-800">
                  {animal.animal_id}
                </h1>

                <p className="text-gray-500 text-lg mt-2">
                  {animal.animal_type} • {animal.breed}
                </p>
              </div>

            </div>

            <div>
              <span
                className={`px-5 py-3 rounded-full font-bold text-lg ${
                  animal.status === "Healthy"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {animal.status}
              </span>
            </div>

          </div>
        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-gray-500 font-semibold">
              Age
            </h3>

            <p className="text-4xl font-black text-green-600 mt-2">
              {animal.age}
            </p>

            <p className="text-gray-500">
              Months
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-gray-500 font-semibold">
              Weight
            </h3>

            <p className="text-4xl font-black text-blue-600 mt-2">
              {animal.weight}
            </p>

            <p className="text-gray-500">
              Kg
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-gray-500 font-semibold">
              Risk Level
            </h3>

            <p className="text-4xl font-black text-orange-500 mt-2">
              {animal.risk_level}
            </p>
          </div>

        </div>

        {/* Details */}

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-3xl font-black mb-8 text-gray-800">
            Animal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <DetailCard
              title="Animal Type"
              value={animal.animal_type}
            />

            <DetailCard
              title="Breed"
              value={animal.breed}
            />

            <DetailCard
              title="Gender"
              value={animal.gender}
            />

            <DetailCard
              title="Pregnancy Status"
              value={animal.pregnancy_status}
            />

            <DetailCard
              title="Last Vaccination"
              value={animal.last_vaccination}
            />

            <DetailCard
              title="Next Vaccination"
              value={animal.next_vaccination}
            />

            <DetailCard
              title="Breeding Date"
              value={animal.breeding_date}
            />

            <DetailCard
              title="Expected Delivery"
              value={animal.expected_delivery}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

function DetailCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      className="
      bg-green-50
      rounded-2xl
      p-5
      border
      border-green-100
      hover:scale-105
      transition
      "
    >
      <p className="text-gray-500 font-semibold">
        {title}
      </p>

      <p className="text-xl font-bold text-gray-800 mt-2">
        {value || "Not Available"}
      </p>
    </div>
  );
}