"use client";

import Link from "next/link";
import {
  Home,
  PawPrint,
  Syringe,
  HeartPulse,
  Baby,
  BarChart3,
  MessageCircle,
  TriangleAlert,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white shadow-lg fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold text-green-700">
          S-LACIS
        </h1>
        <p className="text-gray-600 text-sm">
          Smart Livestock Care System
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-3">
        <Link href="/" className="flex gap-3 p-3 rounded-lg hover:bg-green-100">
          <Home /> Dashboard
        </Link>

        <Link href="/animals" className="flex gap-3 p-3 rounded-lg hover:bg-green-100">
          <PawPrint /> Animal Registry
        </Link>

        <Link href="/vaccinations" className="flex gap-3 p-3 rounded-lg hover:bg-green-100">
          <Syringe /> Vaccination
        </Link>

        <Link href="/health" className="flex gap-3 p-3 rounded-lg hover:bg-green-100">
          <HeartPulse /> Health Records
        </Link>

        <Link href="/breeding" className="flex gap-3 p-3 rounded-lg hover:bg-green-100">
          <Baby /> Breeding
        </Link>

        <Link href="/production" className="flex gap-3 p-3 rounded-lg hover:bg-green-100">
          <BarChart3 /> Production
        </Link>

        <Link href="/chat" className="flex gap-3 p-3 rounded-lg hover:bg-green-100">
          <MessageCircle /> AI Chat
        </Link>

        <Link href="/alerts" className="flex gap-3 p-3 rounded-lg hover:bg-green-100">
          <TriangleAlert /> Alerts
        </Link>

        <Link href="/analytics" className="flex gap-3 p-3 rounded-lg hover:bg-green-100">
          <BarChart3 /> Analytics
        </Link>
      </nav>

      <div className="p-4 border-t">
        <button className="flex gap-3">
          <LogOut /> Logout
        </button>
      </div>
    </div>
  );
}