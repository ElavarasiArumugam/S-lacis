"use client";

import { useEffect, useState } from "react";

export default function HealthPage() {
  const [animals, setAnimals] = useState<any[]>([]);
  const [animal, setAnimal] = useState("");

  const [disease, setDisease] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [treatment, setTreatment] = useState("");

  useEffect(() => {
    const farmId = localStorage.getItem("farm_id");

    fetch(`https://s-lacis.onrender.com/api/v1/animals/farm/${farmId}`)
      .then((res) => res.json())
      .then((data) => setAnimals(data))
      .catch(console.error);
  }, []);

  const saveRecord = async () => {
    if (!animal || !disease || !symptoms || !treatment) {
      alert("Please fill all fields");
      return;
    }

    try {
      await fetch(
        "https://s-lacis.onrender.com/api/v1/health/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            animal_id: Number(animal),
            disease,
            symptoms,
            treatment,
          }),
        }
      );

      alert("Health Record Saved Successfully");

      setAnimal("");
      setDisease("");
      setSymptoms("");
      setTreatment("");
    } catch (error) {
      console.error(error);
      alert("Failed to save health record");
    }
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background:
          "linear-gradient(to bottom right, #f8fafc, #ecfdf5, #f0fdf4)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="mb-10">
          <h1 className="text-5xl font-black text-gray-800">
            🩺 Health Records
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Track diseases, symptoms and treatments for livestock.
          </p>
        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-200">
            <h3 className="text-gray-500 font-semibold">
              Registered Animals
            </h3>

            <p className="text-4xl font-black text-green-600 mt-2">
              {animals.length}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-red-200">
            <h3 className="text-gray-500 font-semibold">
              Disease Monitoring
            </h3>

            <p className="text-4xl font-black text-red-500 mt-2">
              🦠
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-200">
            <h3 className="text-gray-500 font-semibold">
              Treatment Records
            </h3>

            <p className="text-4xl font-black text-blue-500 mt-2">
              💊
            </p>
          </div>
        </div>

        {/* Form Card */}

        <div
          className="
          bg-white/80
          backdrop-blur-md
          rounded-3xl
          p-8
          shadow-xl
          border
          border-green-100
          "
        >
          <h2 className="text-3xl font-black text-gray-800 mb-6">
            Add Health Record
          </h2>

          {/* Animal */}

          <div className="mb-5">
            <label className="block mb-2 font-bold text-gray-700">
              Select Animal
            </label>

            <select
              value={animal}
              onChange={(e) => setAnimal(e.target.value)}
              className="
              w-full
              p-4
              rounded-xl
              border
              border-gray-300
              focus:ring-2
              focus:ring-green-500
              outline-none
              "
            >
              <option value="">
                Choose Animal
              </option>

              {animals.map((a: any) => (
                <option
                  key={a.id}
                  value={a.id}
                >
                  {a.animal_id} - {a.breed}
                </option>
              ))}
            </select>
          </div>

          {/* Disease */}

          <div className="mb-5">
            <label className="block mb-2 font-bold text-gray-700">
              Disease
            </label>

            <input
              value={disease}
              onChange={(e) =>
                setDisease(e.target.value)
              }
              placeholder="Enter disease name"
              className="
              w-full
              p-4
              rounded-xl
              border
              border-gray-300
              focus:ring-2
              focus:ring-green-500
              outline-none
              "
            />
          </div>

          {/* Symptoms */}

          <div className="mb-5">
            <label className="block mb-2 font-bold text-gray-700">
              Symptoms
            </label>

            <textarea
              rows={4}
              value={symptoms}
              onChange={(e) =>
                setSymptoms(e.target.value)
              }
              placeholder="Enter symptoms"
              className="
              w-full
              p-4
              rounded-xl
              border
              border-gray-300
              focus:ring-2
              focus:ring-green-500
              outline-none
              "
            />
          </div>

          {/* Treatment */}

          <div className="mb-6">
            <label className="block mb-2 font-bold text-gray-700">
              Treatment
            </label>

            <textarea
              rows={4}
              value={treatment}
              onChange={(e) =>
                setTreatment(e.target.value)
              }
              placeholder="Enter treatment details"
              className="
              w-full
              p-4
              rounded-xl
              border
              border-gray-300
              focus:ring-2
              focus:ring-green-500
              outline-none
              "
            />
          </div>

          {/* Button */}

          <button
            onClick={saveRecord}
            className="
            w-full
            bg-green-500
            hover:bg-green-600
            text-white
            py-4
            rounded-xl
            font-bold
            text-lg
            transition-all
            duration-300
            hover:scale-[1.02]
            "
          >
            Save Health Record 
          </button>
        </div>
      </div>
    </div>
  );
}