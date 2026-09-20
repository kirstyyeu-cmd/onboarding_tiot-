"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import Header from "../components/Header";
import { supabase } from "../../lib/supabaseClient";

type Status = "draft" | "submitted" | "under_review" | "approved" | "rejected";

const statusConfig: Record<
  Status,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  draft: {
    label: "Draft — not yet submitted",
    color: "text-gray-700",
    bg: "bg-gray-50",
    icon: <FileText size={18} />,
  },
  submitted: {
    label: "Submitted — awaiting review",
    color: "text-orange-800",
    bg: "bg-orange-50",
    icon: <Clock size={18} />,
  },
  under_review: {
    label: "Under review",
    color: "text-orange-800",
    bg: "bg-orange-50",
    icon: <Clock size={18} />,
  },
  approved: {
    label: "Approved",
    color: "text-green-800",
    bg: "bg-green-50",
    icon: <CheckCircle2 size={18} />,
  },
  rejected: {
    label: "Not approved",
    color: "text-red-800",
    bg: "bg-red-50",
    icon: <XCircle size={18} />,
  },
};

export default function ApplicationStatusPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStatus() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You need to be signed in to view your application status.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("drivers")
        .select("application_status")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        setError("No application found for your account yet.");
      } else {
        setStatus(data.application_status as Status);
      }
      setLoading(false);
    }

    fetchStatus();
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-6">Application status</h1>

        {loading && <p className="text-sm text-gray-500">Checking...</p>}

        {!loading && error && (
          <div>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Link
              href="/onboarding"
              className="inline-block bg-green-700 text-white text-sm font-medium px-6 py-3 rounded-md"
            >
              Start an application
            </Link>
          </div>
        )}

        {!loading && status && (
          <div
            className={`flex items-center gap-3 rounded-lg p-4 text-left ${statusConfig[status].bg}`}
          >
            <span className={statusConfig[status].color}>
              {statusConfig[status].icon}
            </span>
            <p className={`text-sm font-medium ${statusConfig[status].color}`}>
              {statusConfig[status].label}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}