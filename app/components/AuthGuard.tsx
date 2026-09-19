"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function AuthGuard({
  children,
  redirectTo,
}: {
  children: React.ReactNode;
  redirectTo: string;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(redirectTo);
      } else {
        setChecking(false);
      }
    }
    checkAuth();
  }, [router, redirectTo]);

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm text-gray-500">Checking your session...</p>
      </main>
    );
  }

  return <>{children}</>;
}