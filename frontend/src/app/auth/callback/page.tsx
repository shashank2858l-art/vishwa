"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import api from "@/services/api";
import { useAuth } from "@/lib/auth/AuthContext";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { googleLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        // Supabase will automatically parse the #access_token from the URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          throw new Error("No active session found after Google Auth redirect.");
        }

        // Use AuthContext to ensure React state updates immediately
        await googleLogin(session.access_token);
        
        // Use window.location.href instead of router.push for OAuth callbacks 
        // to ensure a completely fresh app state and prevent stale layouts
        window.location.href = "/";
        
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(err instanceof Error ? err.message : "Failed to complete authentication");
        setTimeout(() => router.push("/login"), 3000);
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {error ? (
        <div className="text-center p-6 bg-danger/10 text-danger rounded-xl border border-danger/20 max-w-md">
          <h2 className="font-bold text-lg mb-2">Authentication Failed</h2>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-4 opacity-80">Redirecting back to login...</p>
        </div>
      ) : (
        <div className="text-center flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-accent" />
          <p className="text-text-secondary font-medium">Completing secure login...</p>
        </div>
      )}
    </div>
  );
}
