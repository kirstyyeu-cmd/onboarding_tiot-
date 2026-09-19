"use client";

import Link from "next/link";
import { Car } from "lucide-react";
import Header from "../components/Header";
import QuickLinksBar from "../components/QuickLinksBar";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Header showHamburger />
      <QuickLinksBar defaultOpen={false} />

      <section className="max-w-md mx-auto px-6 py-16 text-center">
        <p className="text-xs font-semibold text-green-700 mb-2 tracking-wide">
          YOU&apos;RE SIGNED IN
        </p>
        <h1 className="text-2xl font-semibold mb-2">Welcome to TakeOFF</h1>
        <p className="text-sm text-gray-600 mb-10">
          Your account is ready. Here&apos;s what you can do next.
        </p>

        <div className="flex flex-col gap-3 text-left">
          <Link
            href="/onboarding"
            className="border border-green-200 bg-green-50 rounded-lg p-4 hover:bg-green-100 transition"
          >
            <div className="flex items-center gap-2 mb-1">
              <Car size={18} className="text-green-700" />
              <p className="text-sm font-medium">Become a driver</p>
            </div>
            <p className="text-xs text-green-800">
              Start your driver application →
            </p>
          </Link>

          <DisabledCard title="My deliveries" subtitle="Coming soon" />
          <DisabledCard title="Track a shipment" subtitle="Coming soon" />
          <DisabledCard title="Account settings" subtitle="Coming soon" />
        </div>
      </section>
    </main>
  );
}

function DisabledCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 cursor-not-allowed opacity-60">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}