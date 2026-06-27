"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cattleCount: 0,
    sheepCount: 0,
    goatCount: 0,
    poultryCount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | null }>({ text: "", type: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: null });

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match!", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://s-lacis.onrender.com/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          cattle_count: formData.cattleCount,
          sheep_count: formData.sheepCount,
          goat_count: formData.goatCount,
          poultry_count: formData.poultryCount,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: data.message + " Redirecting to login...", type: "success" });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        let errorMessage = "Registration failed.";
        
        if (typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          const errorField = data.detail[0].loc[data.detail[0].loc.length - 1];
          errorMessage = `Invalid input in ${errorField}: ${data.detail[0].msg}`;
        }
        
        setMessage({ text: errorMessage, type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Network error: Make sure the FastAPI backend is running!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-mono relative overflow-hidden">
      <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-10 left-10 text-6xl opacity-20">🚜</motion.div>

      <form noValidate onSubmit={handleSubmit} className="relative z-10 w-full max-w-2xl bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
        <h1 className="text-3xl font-black uppercase border-b-4 border-black pb-4 mb-6">Farm Registration</h1>
        
        {message.text && (
          <div className={`mb-6 p-4 border-4 border-black font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] ${message.type === 'success' ? 'bg-emerald-200' : 'bg-red-300'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold bg-emerald-200 inline-block px-2 border-2 border-black">1. Farmer Details</h2>
          <input type="text" placeholder="Full Name" required
            className="w-full p-3 border-4 border-black rounded bg-gray-50 focus:bg-white focus:outline-none shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email Address" required
            className="w-full p-3 border-4 border-black rounded bg-gray-50 focus:bg-white focus:outline-none shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input type="password" placeholder="Password (Min 8 chars)" required minLength={8}
              className="w-full p-3 border-4 border-black rounded shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <input type="password" placeholder="Confirm Password" required minLength={8}
              className="w-full p-3 border-4 border-black rounded shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:outline-none"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold bg-yellow-200 inline-block px-2 border-2 border-black">2. Initial Livestock Count</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Cattle', 'Sheep', 'Goat', 'Poultry'].map((animal) => (
              <div key={animal} className="flex flex-col border-4 border-black p-2 rounded shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-orange-50">
                <label className="font-bold text-sm uppercase">{animal}</label>
                <input type="number" min="0" defaultValue="0"
                  className="mt-1 p-1 border-2 border-black focus:outline-none text-center font-bold text-xl"
                  onChange={(e) => setFormData({...formData, [`${animal.toLowerCase()}Count`]: parseInt(e.target.value) || 0})} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className={`w-full text-black font-black text-xl py-4 border-4 border-black rounded shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all uppercase ${loading ? 'bg-gray-300' : 'bg-emerald-400 hover:bg-emerald-300'}`}>
          {loading ? 'Registering...' : 'Create Farm Profile'}
        </button>
      </form>
    </div>
  );
}