"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<any[]>([]);

  useEffect(() => {
    const farmId = localStorage.getItem("farm_id");

    if (!farmId) return;

    fetch(`https://s-lacis.onrender.com/api/v1/animals/farm/${farmId}`)
      .then((res) => res.json())
      .then((data) => setAnimals(data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-8">
      <div className="max-w-6xl mx-auto">

       <div className="flex items-center justify-between mb-8">
  <h1 className="text-4xl font-black">
    Animal Registry
  </h1>

  <Link href="/animals/register">
    <button
      className="
      bg-emerald-400
      hover:bg-emerald-300
      border-4
      border-black
      px-6
      py-3
      rounded-xl
      font-black
      shadow-[6px_6px_0px_rgba(0,0,0,1)]
      hover:translate-x-[2px]
      hover:translate-y-[2px]
      hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]
      transition-all
      "
    >
      + Add Animal
    </button>
  </Link>
</div>

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