"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<any[]>([]);

  useEffect(() => {
    const farmId = localStorage.getItem("farm_id");

    if (!farmId) return;

    fetch(`http://localhost:8000/api/v1/animals/farm/${farmId}`)
      .then((res) => res.json())
      .then((data) => setAnimals(data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-black mb-8">
          Animal Registry
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          {animals.map((animal) => (
            <Link
              key={animal.id}
              href={`/animals/${animal.id}`}
            >
              <div
                className="
                bg-white
                p-6
                border-4
                border-black
                rounded-xl
                shadow-[6px_6px_0px_rgba(0,0,0,1)]
                hover:translate-x-1
                hover:translate-y-1
                transition
                cursor-pointer
                "
              >
                <h2 className="font-black text-xl">
                  {animal.animal_id}
                </h2>

                <p>{animal.animal_type}</p>

                <p>{animal.breed}</p>

                <p className="mt-3">
                  Status:
                  <span className="font-bold ml-2">
                    {animal.status}
                  </span>
                </p>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </div>
  );
}