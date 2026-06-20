"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function BreedingPage() {
  const [animals, setAnimals] = useState<any[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);

  const [pregnancyStatus, setPregnancyStatus] = useState("");
  const [breedingDate, setBreedingDate] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");

  useEffect(() => {
    const farmId = localStorage.getItem("farm_id");

    fetch(`http://localhost:8000/api/v1/breeding/${farmId}`)
      .then((res) => res.json())
      .then((data) => setAnimals(data))
      .catch((err) =>
        console.error("Breeding fetch error:", err)
      );
  }, []);

  const openEdit = (animal: any) => {
    setSelectedAnimal(animal);

    setPregnancyStatus(
      animal.pregnancy_status || "Unknown"
    );

    setBreedingDate(
      animal.breeding_date &&
      animal.breeding_date !== "Not Set"
        ? animal.breeding_date
        : ""
    );

    setExpectedDelivery(
      animal.expected_delivery &&
      animal.expected_delivery !== "Not Set"
        ? animal.expected_delivery
        : ""
    );
  };

  const saveBreeding = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/animals/breeding/${selectedAnimal.animal_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pregnancy_status: pregnancyStatus,
            breeding_date: breedingDate,
            expected_delivery: expectedDelivery,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update");
        return;
      }

      alert("Breeding record updated successfully");

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  const pregnantCount = animals.filter(
    (a) => a.pregnancy_status === "Pregnant"
  ).length;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50">

      {/* Background Images */}

      <Image
        src="/cow.png"
        alt="cow"
        width={280}
        height={280}
        className="absolute top-10 right-10 opacity-10 pointer-events-none"
      />

      <Image
        src="/sheep.png"
        alt="sheep"
        width={240}
        height={240}
        className="absolute bottom-10 left-10 opacity-10 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto p-8 relative z-10">

        {/* Header */}

        <div className="mb-10">
          <h1 className="text-5xl font-black text-pink-700">
            🐄 Breeding & Pregnancy
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Monitor breeding cycles, pregnancy status and delivery schedules.
          </p>
        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-200">
            <h3 className="text-gray-500 font-semibold">
              Total Records
            </h3>

            <p className="text-4xl font-black text-pink-600 mt-2">
              {animals.length}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-200">
            <h3 className="text-gray-500 font-semibold">
              Pregnant Animals
            </h3>

            <p className="text-4xl font-black text-green-600 mt-2">
              {pregnantCount}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-200">
            <h3 className="text-gray-500 font-semibold">
              Active Monitoring
            </h3>

            <p className="text-4xl font-black text-blue-600 mt-2">
              {animals.length}
            </p>
          </div>

        </div>

        {/* Records */}

        {animals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700">
              No Breeding Records Found
            </h2>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {animals.map((a: any) => {
              let daysRemaining = "Not Available";

              if (
                a.expected_delivery &&
                a.expected_delivery !== "Not Set" &&
                a.expected_delivery !== "Not Available"
              ) {
                const today = new Date();

                const delivery = new Date(
                  a.expected_delivery
                );

                const diff = Math.ceil(
                  (delivery.getTime() -
                    today.getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                daysRemaining =
                  diff > 0
                    ? `${diff} days`
                    : "Due";
              }

              return (
                <div
                  key={a.id}
                  className="
                  bg-white/80
                  backdrop-blur-md
                  rounded-3xl
                  p-6
                  border
                  border-pink-100
                  shadow-lg
                  hover:-translate-y-2
                  hover:shadow-2xl
                  transition-all
                  duration-300
                  "
                >

                  <div className="flex justify-between items-center mb-4">

                    <h2 className="text-2xl font-black text-gray-800">
                      {a.animal_id}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        a.pregnancy_status === "Pregnant"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {a.pregnancy_status}
                    </span>

                  </div>

                  <div className="space-y-3 text-gray-700">

                    <p>
                      <b>Breed:</b> {a.breed}
                    </p>

                    <p>
                      <b>Breeding Date:</b>{" "}
                      {a.breeding_date || "Not Set"}
                    </p>

                    <p>
                      <b>Expected Delivery:</b>{" "}
                      {a.expected_delivery || "Not Set"}
                    </p>

                    <p>
                      <b>Days Remaining:</b>{" "}
                      {daysRemaining}
                    </p>

                  </div>

                  <button
                    onClick={() => openEdit(a)}
                    className="
                    mt-6
                    w-full
                    bg-pink-500
                    hover:bg-pink-600
                    text-white
                    py-3
                    rounded-xl
                    font-bold
                    transition
                    "
                  >
                    Update Breeding →
                  </button>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}

      {selectedAnimal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 shadow-2xl w-[450px]">

            <h2 className="text-3xl font-black text-pink-700 mb-6">
              Update Breeding
            </h2>

            <label className="block mb-2 font-semibold">
              Pregnancy Status
            </label>

            <select
              value={pregnancyStatus}
              onChange={(e) =>
                setPregnancyStatus(e.target.value)
              }
              className="w-full p-3 rounded-xl border border-gray-300 mb-4"
            >
              <option value="Pregnant">
                Pregnant
              </option>

              <option value="Not Pregnant">
                Not Pregnant
              </option>

              <option value="Unknown">
                Unknown
              </option>

              <option value="Lactating">
                Lactating
              </option>
            </select>

            <label className="block mb-2 font-semibold">
              Breeding Date
            </label>

            <input
              type="date"
              value={breedingDate}
              onChange={(e) =>
                setBreedingDate(e.target.value)
              }
              className="w-full p-3 rounded-xl border border-gray-300 mb-4"
            />

            <label className="block mb-2 font-semibold">
              Expected Delivery
            </label>

            <input
              type="date"
              value={expectedDelivery}
              onChange={(e) =>
                setExpectedDelivery(e.target.value)
              }
              className="w-full p-3 rounded-xl border border-gray-300 mb-6"
            />

            <div className="flex gap-3">

              <button
                onClick={saveBreeding}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold"
              >
                Save
              </button>

              <button
                onClick={() =>
                  setSelectedAnimal(null)
                }
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}