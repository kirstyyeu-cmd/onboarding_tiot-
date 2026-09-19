"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import Header from "../components/Header";
import QuickLinksBar from "../components/QuickLinksBar";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/welcome";

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setStep("code");
    }
  }

  function handleDigitChange(index: number, value: string) {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  }

  function handleDigitKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: digits.join(""),
      type: "email",
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push(redirectTo);
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />
      <QuickLinksBar defaultOpen={false} />

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {step === "email" ? (
            <>
              <p className="text-xs font-semibold text-orange-600 mb-2 tracking-wide">
                GET STARTED
              </p>
              <h1 className="text-2xl font-semibold mb-2">
                Create your account
              </h1>
              <p className="text-sm text-gray-600 mb-6">
                Sign up to book deliveries or start driving with TakeOFF.
              </p>

              {error && (
                <p className="text-sm text-red-600 mb-4 bg-red-50 rounded-md p-3">
                  {error}
                </p>
              )}

              <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-md pl-9 pr-4 py-3 text-sm text-black placeholder-gray-400"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-600 text-white rounded-md py-3 text-sm font-medium disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Continue"}
                </button>
              </form>

              <p className="text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <Link
                  href={`/signin${redirectTo !== "/welcome" ? `?redirect=${redirectTo}` : ""}`}
                  className="text-orange-600 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold text-orange-600 mb-2 tracking-wide">
                VERIFY YOUR EMAIL
              </p>
              <h1 className="text-2xl font-semibold mb-2">Enter your code</h1>
              <p className="text-sm text-gray-600 mb-6">
                We sent a 6-digit code to {email}.
              </p>

              {error && (
                <p className="text-sm text-red-600 mb-4 bg-red-50 rounded-md p-3">
                  {error}
                </p>
              )}

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                <div className="flex justify-between gap-2">
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputsRef.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      placeholder="X"
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(i, e)}
                      className="w-12 h-14 text-center text-lg font-medium border border-gray-300 rounded-md text-black placeholder-gray-300 focus:outline-none focus:border-orange-600"
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-600 text-white rounded-md py-3 text-sm font-medium disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify and continue"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-xs text-gray-600 underline"
                >
                  Use a different email
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}