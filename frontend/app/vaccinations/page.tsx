"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function VaccinationPage() {
  const [animals, setAnimals] = useState<any[]>([]);

  const [animalId, setAnimalId] = useState("");
  const [vaccine, setVaccine] = useState("");
  const [nextDate, setNextDate] = useState("");

  useEffect(() => {
    const farmId = localStorage.getItem("farm_id");

    fetch(
      `https://s-lacis.onrender.com/api/v1/animals/farm/${farmId}`
    )
      .then((res) => res.json())
      .then((data) => setAnimals(data))
      .catch(console.error);
  }, []);

  const saveVaccine = async () => {
    try {
      await fetch(
        `https://s-lacis.onrender.com/api/v1/animals/vaccinate?animal_id=${animalId}&vaccine_name=${vaccine}&next_date=${nextDate}`,
        {
          method: "POST",
        }
      );

      alert("Vaccination Updated Successfully");

      setAnimalId("");
      setVaccine("");
      setNextDate("");
    } catch (err) {
      console.error(err);
      alert("Failed to update vaccination");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      {/* Background Images */}

      <Image
        src="/cow.png"
        alt="cow"
        width={280}
        height={280}
        loading="eager"
        className="absolute top-10 right-10 opacity-10 pointer-events-none"
      />

      <Image
        src="/sheep.png"
        alt="sheep"
        width={240}
        height={240}
        className="absolute bottom-10 left-10 opacity-10 pointer-events-none"
      />

      <div className="max-w-6xl mx-auto p-8 relative z-10">

        {/* Header */}

        <div className="mb-10">
          <h1 className="text-5xl font-black text-blue-700">
              Vaccination Management
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Manage vaccination schedules and keep your livestock protected.
          </p>
        </div>

        {/* Stats Cards */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-200">
            <h3 className="text-gray-500 font-semibold">
              Registered Animals
            </h3>

            <p className="text-4xl font-black text-blue-600 mt-2">
              {animals.length}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-200">
            <h3 className="text-gray-500 font-semibold">
              Vaccination Module
            </h3>

            <p className="text-4xl font-black text-green-600 mt-2">
              Active
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-cyan-200">
            <h3 className="text-gray-500 font-semibold">
              Farm Protection
            </h3>

            <p className="text-4xl font-black text-cyan-600 mt-2">
              100%
            </p>
          </div>

        </div>

        {/* Vaccination Form */}

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-blue-100">

          <h2 className="text-3xl font-black text-blue-700 mb-2">
            New Vaccination Entry
          </h2>

          <p className="text-gray-600 mb-8">
            Assign vaccines and schedule the next vaccination date.
          </p>

          {/* Animal Selection */}

          <label className="block font-bold mb-2">
            Select Animal
          </label>

          <select
            value={animalId}
            onChange={(e) =>
              setAnimalId(e.target.value)
            }
            className="
              w-full
              p-4
              rounded-2xl
              border
              border-gray-200
              mb-5
              focus:outline-none
              focus:ring-2
              focus:ring-blue-400
            "
          >
            <option value="">
              Select Animal
            </option>

            {animals.map((a: any) => (
              <option
                key={a.id}
                value={a.id}
              >
                {a.animal_id} - {a.animal_type}
              </option>
            ))}
          </select>

          {/* Vaccine Name */}

          <label className="block font-bold mb-2">
            Vaccine Name
          </label>

          <input
            value={vaccine}
            placeholder="Enter Vaccine Name"
            onChange={(e) =>
              setVaccine(e.target.value)
            }
            className="
              w-full
              p-4
              rounded-2xl
              border
              border-gray-200
              mb-5
              focus:outline-none
              focus:ring-2
              focus:ring-blue-400
            "
          />

          {/* Next Vaccination Date */}

          <label className="block font-bold mb-2">
            Next Vaccination Date
          </label>

          <input
            type="date"
            value={nextDate}
            onChange={(e) =>
              setNextDate(e.target.value)
            }
            className="
              w-full
              p-4
              rounded-2xl
              border
              border-gray-200
              mb-8
              focus:outline-none
              focus:ring-2
              focus:ring-blue-400
            "
          />

          {/* Button */}

          <button
            onClick={saveVaccine}
            className="
              w-full
              bg-blue-500
              hover:bg-blue-600
              text-white
              py-4
              rounded-2xl
              font-bold
              text-lg
              transition-all
              duration-300
              hover:shadow-xl
            "
          >
            Save Vaccination →
          </button>

        </div>

      </div>
    </div>
  );
}