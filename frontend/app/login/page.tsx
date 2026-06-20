"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "error" | null }>({ text: "", type: null });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: null });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok) {
        // Successful login! Save farm ID and redirect to dashboard
        if (data.data?.id) {
          localStorage.setItem("farm_id", data.data.id.toString());
        }
        router.push("/dashboard");
      } else {
        setMessage({ text: data.detail || "Login failed.", type: "error" });
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setMessage({ text: "Request timeout. Check if backend is running on localhost:8000", type: "error" });
      } else {
        setMessage({ text: "Network error: Make sure the backend is running!", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-mono relative overflow-hidden">
      <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-20 right-20 text-7xl opacity-20">🐄</motion.div>

      <form onSubmit={handleLogin} className="relative z-10 w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
        <h1 className="text-4xl font-black uppercase border-b-4 border-black pb-4 mb-6 text-center">S-LACIS</h1>
        <h2 className="text-xl font-bold mb-6 text-center bg-yellow-200 border-2 border-black py-2">System Login</h2>

        {message.text && (
          <div className="mb-6 p-4 border-4 border-black font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-red-300">
            {message.text}
          </div>
        )}

        <div className="space-y-4 mb-8">
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            className="w-full p-4 border-4 border-black rounded bg-gray-50 focus:bg-white focus:outline-none shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            className="w-full p-4 border-4 border-black rounded shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:outline-none"
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <button type="submit" disabled={loading} className={`w-full text-black font-black text-xl py-4 mb-4 border-4 border-black rounded shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all uppercase ${loading ? 'bg-gray-300' : 'bg-emerald-400 hover:bg-emerald-300'}`}>
          {loading ? 'Authenticating...' : 'Enter Platform'}
        </button>

        <div className="text-center font-bold mt-6 border-t-4 border-black pt-4">
          <p>No farm profile yet?</p>
          <Link href="/register" className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-4">
            Register a new farm
          </Link>
        </div>
      </form>
    </div>
  );
}