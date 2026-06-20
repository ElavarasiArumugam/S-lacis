"use client";

import Link from "next/link";
import Image from "next/image";
import {
  PawPrint,
  Syringe,
  HeartPulse,
  Baby,
  BarChart3,
  MessageCircle,
  TriangleAlert,
  Milk,
} from "lucide-react";

const modules = [
  {
    title: "Animal Registry",
    desc: "Add, view and manage livestock.",
    href: "/animals",
    icon: <PawPrint size={50} />,
    color: "bg-green-50 border-green-200",
  },
  {
    title: "Vaccination Management",
    desc: "Track vaccination schedules.",
    href: "/vaccinations",
    icon: <Syringe size={50} />,
    color: "bg-blue-50 border-blue-200",
  },
  {
    title: "Health Records",
    desc: "Store and monitor health history.",
    href: "/health",
    icon: <HeartPulse size={50} />,
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    title: "Breeding & Pregnancy",
    desc: "Monitor breeding and due dates.",
    href: "/breeding",
    icon: <Baby size={50} />,
    color: "bg-pink-50 border-pink-200",
  },
  {
    title: "Production Tracking",
    desc: "Track milk, eggs and wool.",
    href: "/production",
    icon: <Milk size={50} />,
    color: "bg-purple-50 border-purple-200",
  },
  {
    title: "AI Chat Assistant",
    desc: "Ask livestock-related questions.",
    href: "/chat",
    icon: <MessageCircle size={50} />,
    color: "bg-orange-50 border-orange-200",
  },
  {
    title: "Disease Alerts",
    desc: "Monitor high-risk animals.",
    href: "/alerts",
    icon: <TriangleAlert size={50} />,
    color: "bg-red-50 border-red-200",
  },
  {
    title: "Farm Analytics",
    desc: "Insights and performance reports.",
    href: "/analytics",
    icon: <BarChart3 size={50} />,
    color: "bg-indigo-50 border-indigo-200",
  },
];

export default function DashboardPage() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url('/barn-bg.jpg')",
      }}
    >
      {/* Light Overlay */}
      <div className="absolute inset-0 bg-white/75" />

      {/* Background Decorations */}

<Image
  src="/cow.png"
  alt="cow"
  width={300}
  height={300}
   style={{ width: "auto", height: "auto" }}
  className="absolute top-20 right-10 opacity-10"
/>

<Image
  src="/sheep.png"
  alt="sheep"
  width={300}
  height={300}
   style={{ width: "auto", height: "auto" }}
  className="absolute top-20 right-10 opacity-10"
/>

<Image
  src="/goat.png"
  alt="goat"
  width={300}
  height={300}
   style={{ width: "auto", height: "auto" }}
  className="absolute top-20 right-10 opacity-10"
/>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="px-10 pt-10">
          <h1 className="text-5xl font-bold text-gray-900">
            Welcome Back, Farmer! 
          </h1>

          <p className="text-xl text-gray-700 mt-2">
            Manage your livestock, track health, production and more.
          </p>
        </div>

        {/* Modules */}
        <div className="max-w-7xl mx-auto px-10 py-10">
          <div className="bg-white/90 rounded-3xl shadow-xl p-8 backdrop-blur-sm">
            <h2 className="text-center text-4xl font-bold mb-10">
              MODULES
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {modules.map((module, index) => (
                <Link key={index} href={module.href}>
                  <div
                    className={`
                      ${module.color}
                      border-2
                      rounded-3xl
                      p-6
                      h-full
                      hover:scale-105
                      transition-all
                      duration-300
                      cursor-pointer
                      shadow-md
                      hover:shadow-xl
                    `}
                  >
                    <div className="flex justify-center mb-4">
                      {module.icon}
                    </div>

                    <h3 className="text-xl font-bold text-center mb-3">
                      {module.title}
                    </h3>

                    <p className="text-center text-gray-600 mb-5">
                      {module.desc}
                    </p>

                    <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition">
                      View →
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}