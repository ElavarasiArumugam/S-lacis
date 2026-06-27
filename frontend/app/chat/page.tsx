"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Send, ArrowLeft, AlertTriangle, Loader } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [farmId, setFarmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedFarmId = localStorage.getItem("farm_id");
    setFarmId(storedFarmId);

    // Add welcome message
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm S-LACIS, your AI-powered farm assistant. I can help you with disease detection, vaccination scheduling, care guidance, and emergency support for your livestock. How can I assist you today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !farmId || loading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://s-lacis.onrender.com/api/v1/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farm_id: parseInt(farmId),
          message: input,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to get response");
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Connection error";
      setError(errorMessage);

      const errorBotMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${errorMessage}. Make sure Ollama is running on localhost:11434.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] font-mono flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-4 border-black p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black uppercase">S-LACIS Chat Engine</h1>
            <p className="text-gray-600 font-bold mt-1">Veterinary Intelligence Assistant</p>
          </div>
          <Link href="/dashboard">
            <button className="flex items-center gap-2 bg-yellow-300 hover:bg-yellow-200 text-black font-bold py-3 px-6 border-4 border-black rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all uppercase">
              <ArrowLeft size={20} /> Back to Dashboard
            </button>
          </Link>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full py-6 px-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-white border-4 border-black rounded-xl p-6 mb-4 shadow-[6px_6px_0px_rgba(0,0,0,1)] space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg border-3 border-black ${
                  msg.role === "user"
                    ? "bg-blue-200 text-black font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                    : "bg-emerald-100 text-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-lg border-3 border-black bg-emerald-100 text-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2">
                  <Loader size={20} className="animate-spin" />
                  <span className="font-bold">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="px-4 py-3 rounded-lg border-3 border-black bg-red-300 text-black font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                <AlertTriangle size={20} />
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about symptoms, vaccination, care, or emergencies..."
            disabled={loading || !farmId}
            className="flex-1 p-4 border-4 border-black rounded-lg bg-white focus:outline-none focus:bg-yellow-50 font-bold disabled:bg-gray-200 disabled:text-gray-500"
          />
          <button
            type="submit"
            disabled={loading || !farmId || !input.trim()}
            className={`px-6 py-4 border-4 border-black rounded-lg font-bold uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-2 transition-all ${
              loading || !farmId || !input.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-emerald-400 hover:bg-emerald-300 text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            }`}
          >
            <Send size={20} strokeWidth={3} />
            Send
          </button>
        </form>

        {!farmId && (
          <div className="mt-4 p-4 bg-red-300 border-4 border-black rounded-lg font-bold text-center">
            Farm ID not loaded. Please go back to dashboard and login again.
          </div>
        )}
      </div>
    </div>
  );
}
