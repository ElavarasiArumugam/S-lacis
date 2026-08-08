"use client";

import { useEffect, useState } from "react";

export default function ProductionPage() {

  const [animals, setAnimals] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);

  const [animalId, setAnimalId] = useState("");
  const [productionType, setProductionType] = useState("Milk");
  const [quantity, setQuantity] = useState("");
  const [recordDate, setRecordDate] = useState("");

  const farmId =
    typeof window !== "undefined"
      ? localStorage.getItem("farm_id")
      : null;

  const loadAnimals = async () => {

    if (!farmId) return;

    try {

      const res = await fetch(
        `https://s-lacis.onrender.com/api/v1/animals/farm/${farmId}`
      );

      const data = await res.json();

      setAnimals(data);

    } catch (err) {
      console.error(err);
    }
  };

  const loadRecords = async () => {

    if (!farmId) return;

    try {

      const res = await fetch(
        `https://s-lacis.onrender.com/api/v1/production/${farmId}`
      );

      const data = await res.json();

      setRecords(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
    }

  };

  useEffect(() => {

    loadAnimals();
    loadRecords();

  }, []);

  const saveProduction = async () => {

    if (
      !animalId ||
      !productionType ||
      !quantity ||
      !recordDate
    ) {
      alert("Please fill all fields");
      return;
    }

    try {

      const response = await fetch(
        "https://s-lacis.onrender.com/api/v1/production/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            animal_id: Number(animalId),
            production_type: productionType,
            quantity: Number(quantity),
            record_date: recordDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed");
      }

      alert("Production Saved Successfully");

      setAnimalId("");
      setProductionType("Milk");
      setQuantity("");
      setRecordDate("");

      loadRecords();

    } catch (err) {

      console.error(err);

      alert("Failed to save production.");

    }

  };

  const totalProduction = records.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  return (

    <div
      className="min-h-screen p-8"
      style={{
        background:
          "linear-gradient(to bottom right,#fefce8,#fff7ed,#f8fafc)",
      }}
    >

      <div className="max-w-7xl mx-auto">

        <div className="mb-10">

          <h1 className="text-5xl font-black text-gray-800">

            📈 Production Monitoring

          </h1>

          <p className="text-gray-600 mt-3 text-lg">

            Record milk, egg, wool and meat production for your livestock.

          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <h3 className="text-gray-500 font-semibold">

              Registered Animals

            </h3>

            <p className="text-4xl font-black text-blue-600 mt-2">

              {animals.length}

            </p>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <h3 className="text-gray-500 font-semibold">

              Production Records

            </h3>

            <p className="text-4xl font-black text-orange-600 mt-2">

              {records.length}

            </p>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <h3 className="text-gray-500 font-semibold">

              Total Quantity

            </h3>

            <p className="text-4xl font-black text-green-600 mt-2">

              {totalProduction}

            </p>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl mb-10">

          <h2 className="text-3xl font-black mb-6">

            Add Production Record

          </h2>

          <label className="font-bold">

            Animal

          </label>

          <select
            value={animalId}
            onChange={(e)=>setAnimalId(e.target.value)}
            className="w-full p-4 border rounded-xl mt-2 mb-5"
          >

            <option value="">Select Animal</option>

            {animals.map((a:any)=>(
              <option key={a.id} value={a.id}>
                {a.animal_id} - {a.animal_type}
              </option>
            ))}

          </select>

          <label className="font-bold">

            Production Type

          </label>

          <select
            value={productionType}
            onChange={(e)=>setProductionType(e.target.value)}
            className="w-full p-4 border rounded-xl mt-2 mb-5"
          >

            <option>Milk</option>

            <option>Egg</option>

            <option>Wool</option>

            <option>Meat</option>

          </select>
                    <label className="font-bold">

            Quantity

          </label>

          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter Quantity"
            className="w-full p-4 border rounded-xl mt-2 mb-5"
          />

          <label className="font-bold">

            Record Date

          </label>

          <input
            type="date"
            value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)}
            className="w-full p-4 border rounded-xl mt-2 mb-8"
          />

          <button
            onClick={saveProduction}
            className="
              w-full
              bg-orange-500
              hover:bg-orange-600
              text-white
              py-4
              rounded-xl
              font-bold
              text-lg
              transition
            "
          >
            Save Production
          </button>

        </div>

        {records.length === 0 ? (

          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">

            <h2 className="text-2xl font-bold text-gray-700">

              No Production Records

            </h2>

            <p className="text-gray-500 mt-3">

              Start adding production records.

            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {records.map((r: any) => (

              <div
                key={r.id}
                className="
                bg-white
                rounded-3xl
                p-6
                shadow-lg
                border
                border-orange-100
                hover:shadow-2xl
                hover:-translate-y-2
                transition
                "
              >

                <div className="flex justify-between items-center mb-5">

                  <div className="text-5xl">

                    {r.production_type === "Milk"
                      ? "🥛"
                      : r.production_type === "Egg"
                      ? "🥚"
                      : r.production_type === "Wool"
                      ? "🐑"
                      : "🥩"}

                  </div>

                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">

                    {r.production_type}

                  </span>

                </div>

                <h2 className="text-2xl font-black mb-4">

                  Production Record

                </h2>

                <div className="space-y-3">

                  <p>

                    <span className="font-bold">

                      Animal ID:

                    </span>{" "}

                    {r.animal_id}

                  </p>

                  <p>

                    <span className="font-bold">

                      Quantity:

                    </span>{" "}

                    {r.quantity}

                  </p>

                  <p>

                    <span className="font-bold">

                      Date:

                    </span>{" "}

                    {r.record_date}

                  </p>

                </div>

                <div className="mt-6">

                  <div className="bg-green-500 text-white rounded-xl py-3 text-center font-bold">

                    Saved ✓

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