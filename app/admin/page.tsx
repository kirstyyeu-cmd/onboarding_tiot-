"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Driver = {
  id: string;
  full_name: string;
  email: string;
  city: string;
  application_status: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchDrivers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("drivers")
      .select("id, full_name, email, city, application_status")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDrivers(data as Driver[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/signin");
        return;
      }

      // Check the admin_users table — enforced again by RLS on the
      // server, so even a modified frontend can't bypass this
      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !data) {
        router.push("/admin/signin");
        return;
      }

      setAuthorized(true);
      setChecking(false);
      fetchDrivers();
    }
    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("drivers")
      .update({ application_status: status })
      .eq("id", id);

    if (!error) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === id ? { ...d, application_status: status } : d))
      );
    }
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm text-gray-500">Checking access...</p>
      </main>
    );
  }

  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-white text-black p-6">
      <h1 className="text-2xl font-semibold mb-6">Driver applications</h1>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : drivers.length === 0 ? (
        <p className="text-sm text-gray-500">No applications yet.</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id} className="border-t">
                  <td className="px-4 py-3">{driver.full_name}</td>
                  <td className="px-4 py-3">{driver.email}</td>
                  <td className="px-4 py-3">{driver.city}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        driver.application_status === "approved"
                          ? "bg-green-50 text-green-800"
                          : driver.application_status === "rejected"
                          ? "bg-red-50 text-red-800"
                          : "bg-orange-50 text-orange-800"
                      }`}
                    >
                      {driver.application_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => updateStatus(driver.id, "approved")}
                      className="text-xs bg-green-700 text-white px-3 py-1.5 rounded-md"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(driver.id, "rejected")}
                      className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-md"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}