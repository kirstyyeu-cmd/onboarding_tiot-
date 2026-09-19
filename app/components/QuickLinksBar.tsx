"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  LogIn,
  UserPlus,
  Car,
  MapPin,
  CircleUserRound,
  Info,
  ChevronDown,
} from "lucide-react";

export default function QuickLinksBar({
  defaultOpen = true,
}: {
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-b">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-1 py-2 text-xs text-gray-500"
      >
        {open ? "Hide quick links" : "Show quick links"}
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="flex flex-wrap gap-6 justify-center items-center pb-4 text-sm">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition">
            <Home size={18} className="text-green-700" />
            <div className="text-left">
              <p className="font-medium">Home</p>
              <p className="text-xs text-gray-500">Back to landing page</p>
            </div>
          </Link>

          <Link href="/signin" className="flex items-center gap-2 hover:opacity-70 transition">
            <LogIn size={18} className="text-green-700" />
            <div className="text-left">
              <p className="font-medium">Sign in</p>
              <p className="text-xs text-gray-500">Access your account</p>
            </div>
          </Link>

          <Link href="/signup" className="flex items-center gap-2 hover:opacity-70 transition">
            <UserPlus size={18} className="text-green-700" />
            <div className="text-left">
              <p className="font-medium">Sign up</p>
              <p className="text-xs text-gray-500">Create a new account</p>
            </div>
          </Link>

          <Link href="/onboarding" className="flex items-center gap-2 hover:opacity-70 transition">
            <Car size={18} className="text-green-700" />
            <div className="text-left">
              <p className="font-medium">Become a driver</p>
              <p className="text-xs text-gray-500">Start earning today</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 opacity-50 cursor-not-allowed">
            <MapPin size={18} className="text-gray-500" />
            <div className="text-left">
            </div>
          </div>

          {/* Profile — round icon only, no text label */}
          <div
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center opacity-50 cursor-not-allowed"
            title="Profile"
          >
            <CircleUserRound size={20} className="text-gray-500" />
          </div>

          <div className="flex items-center gap-2 opacity-50 cursor-not-allowed">
            <Info size={18} className="text-gray-500" />
            <div className="text-left">
              <p className="font-medium">About</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}