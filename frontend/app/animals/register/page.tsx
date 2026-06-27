"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function RegisterAnimal() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    animal_id: "",
    animal_type: "Cow",
    breed: "",
    age: "",
    weight: "",
    gender: "Female",
    pregnancy_status: "No",
    last_vaccination: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const farm_id = localStorage.getItem("farm_id");

    if (!farm_id) {
      setMessage("Please login again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://s-lacis.onrender.com/api/v1/animals/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            farm_id: Number(farm_id),
            animal_id: formData.animal_id,
            animal_type: formData.animal_type,
            breed: formData.breed,
            age: Number(formData.age),
            weight: Number(formData.weight),
            gender: formData.gender,
            pregnancy_status: formData.pregnancy_status,
            last_vaccination:
              formData.last_vaccination || "Not Recorded",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Animal Registered Successfully!");
        router.push("/animals");
      } else {
        setMessage(data.detail || "Registration Failed");
      }
    } catch {
      setMessage("Network Error");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-8 flex justify-center">

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="
        w-full
        max-w-2xl
        bg-white
        border-4
        border-black
        rounded-xl
        p-8
        shadow-[8px_8px_0px_rgba(0,0,0,1)]
        "
      >
        <h1 className="text-4xl font-black mb-8">
          Register Animal
        </h1>

        {message && (
          <div className="bg-red-200 border-2 border-black p-3 mb-6 font-bold">
            {message}
          </div>
        )}

        <div className="space-y-5">

          <input
            placeholder="Animal ID"
            required
            className="w-full border-4 border-black p-3 rounded"
            value={formData.animal_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                animal_id: e.target.value,
              })
            }
          />

          <select
            className="w-full border-4 border-black p-3 rounded"
            value={formData.animal_type}
            onChange={(e) =>
              setFormData({
                ...formData,
                animal_type: e.target.value,
              })
            }
          >
            <option>Cow</option>
            <option>Goat</option>
            <option>Sheep</option>
            <option>Poultry</option>
          </select>

          <input
            placeholder="Breed"
            required
            className="w-full border-4 border-black p-3 rounded"
            value={formData.breed}
            onChange={(e) =>
              setFormData({
                ...formData,
                breed: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Age (Months)"
            required
            className="w-full border-4 border-black p-3 rounded"
            value={formData.age}
            onChange={(e) =>
              setFormData({
                ...formData,
                age: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Weight (Kg)"
            required
            className="w-full border-4 border-black p-3 rounded"
            value={formData.weight}
            onChange={(e) =>
              setFormData({
                ...formData,
                weight: e.target.value,
              })
            }
          />

          <select
            className="w-full border-4 border-black p-3 rounded"
            value={formData.gender}
            onChange={(e) =>
              setFormData({
                ...formData,
                gender: e.target.value,
              })
            }
          >
            <option>Female</option>
            <option>Male</option>
          </select>

          <select
            className="w-full border-4 border-black p-3 rounded"
            value={formData.pregnancy_status}
            onChange={(e) =>
              setFormData({
                ...formData,
                pregnancy_status: e.target.value,
              })
            }
          >
            <option>No</option>
            <option>Yes</option>
            <option>Unknown</option>
          </select>

          <input
            type="date"
            className="w-full border-4 border-black p-3 rounded"
            value={formData.last_vaccination}
            onChange={(e) =>
              setFormData({
                ...formData,
                last_vaccination: e.target.value,
              })
            }
          />

          <button
            disabled={loading}
            className="
            w-full
            bg-green-400
            border-4
            border-black
            p-4
            font-black
            text-xl
            rounded-xl
            shadow-[6px_6px_0px_rgba(0,0,0,1)]
            hover:bg-green-300
            transition
            "
          >
            {loading ? "Registering..." : "Register Animal"}
          </button>

        </div>
      </motion.form>

    </div>
  );
}