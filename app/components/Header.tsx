"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  User,
  Settings,
  Tag,
  MapPin,
  Info,
  Car,
  LogOut,
  Home,
  LogIn,
  UserPlus,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function Header({
  showHamburger = false,
}: {
  showHamburger?: boolean;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <header className="relative flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-lg font-semibold text-green-700">
          TakeOFF
        </Link>

        {/* Plain navbar — no borders/dividers */}
        <nav className="hidden sm:flex items-center gap-5 text-sm">
          <Link href="/" className="flex items-center gap-1 hover:text-green-700 transition">
            <Home size={15} /> Home
          </Link>
          <Link href="/signin" className="flex items-center gap-1 hover:text-green-700 transition">
            <LogIn size={15} /> Sign in
          </Link>
          <Link href="/signup" className="flex items-center gap-1 hover:text-green-700 transition">
            <UserPlus size={15} /> Sign up
          </Link>
          <Link href="/onboarding" className="flex items-center gap-1 hover:text-green-700 transition">
            <Car size={15} /> Become a driver
          </Link>
        </nav>
      </div>

      {showHamburger && (
        <>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            className="p-1"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {menuOpen && (
            <div className="absolute top-full right-6 mt-1 w-64 bg-white border rounded-lg shadow-lg py-2 z-10">
              <MenuItem icon={<User size={16} />} label="Profile" disabled />
              <MenuItem icon={<Settings size={16} />} label="Settings" disabled />
              <MenuItem icon={<Tag size={16} />} label="Pricing" disabled />
              <MenuItem icon={<MapPin size={16} />} label="Track delivery" disabled />
              <MenuItem icon={<Info size={16} />} label="Help & support" disabled />

              <div className="border-t my-2" />

              <Link
                href="/onboarding"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"
              >
                <Car size={16} className="text-green-700" />
                Start driver application
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 text-left"
              >
                <LogOut size={16} className="text-red-600" />
                Sign out
              </button>
            </div>
          )}
        </>
      )}
    </header>
  );
}

function MenuItem({
  icon,
  label,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 text-sm ${
        disabled ? "text-gray-400 cursor-not-allowed" : ""
      }`}
    >
      {icon}
      {label}
      {disabled && <span className="text-xs ml-auto">Soon</span>}
    </div>
  );
}