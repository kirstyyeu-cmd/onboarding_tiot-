"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Header from "../../components/Header";

export default function CompletePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <div className="flex items-center justify-center px-6 py-16">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={30} className="text-green-700" />
          </div>

          <h1 className="text-2xl font-semibold mb-2">Application submitted</h1>
          <p className="text-sm text-gray-700 mb-8">
            Thanks for applying to drive with TakeOFF. We&apos;re reviewing
            your details now — you&apos;ll get an email once a decision has
            been made. This usually takes 1–2 business days.
          </p>

          <div className="bg-orange-50 rounded-lg p-4 mb-8 text-left">
            <p className="text-xs font-medium text-orange-900 mb-1">
              Application status
            </p>
            <p className="text-sm text-orange-800">Under review</p>
          </div>

          <Link
            href="/"
            className="inline-block bg-green-700 text-white text-sm font-medium px-6 py-3 rounded-md"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}