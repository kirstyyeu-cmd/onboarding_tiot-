"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Incorrect email or password.");
    } else {
      router.push("/admin");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-black px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-2">Admin sign in</h1>
        <p className="text-sm text-gray-600 mb-6">
          Restricted access. Staff credentials only.
        </p>

        {error && (
          <p className="text-sm text-red-600 mb-4 bg-red-50 rounded-md p-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSignIn} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded-md py-3 text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}