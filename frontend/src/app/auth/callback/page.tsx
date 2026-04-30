"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { authService } from "@/services/authService";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const processed = useRef(false);

  useEffect(() => {
    // Prevent double-processing in React StrictMode
    if (processed.current) return;
    processed.current = true;

    async function handleCallback() {
      try {
        // Wait for Supabase to establish the session from the URL
        const session = await new Promise<any>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Timeout waiting for Supabase session. Please try logging in again."));
          }, 15000); // 15 seconds timeout

          // Listen for auth state changes (this catches the session right after Google redirect)
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, sess) => {
            if (sess) {
              clearTimeout(timeout);
              subscription.unsubscribe();
              resolve(sess);
            }
          });
          
          // Also check immediately in case the session is already established
          supabase.auth.getSession().then(({ data, error }) => {
            if (error) {
               console.error("getSession error:", error);
            } else if (data.session) {
              clearTimeout(timeout);
              resolve(data.session);
            }
          }).catch(console.error);
        });

        if (!session || !session.access_token) {
          throw new Error("Failed to obtain access token from Google.");
        }

        // Send the Supabase access token to our backend
        const result = await authService.googleLogin(session.access_token);
        
        // Redirect to home page with full page reload
        window.location.href = "/";
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err?.message || "Failed to complete authentication. Please try again.");
      }
    }

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {error ? (
        <div className="text-center p-6 bg-danger/10 text-danger rounded-xl border border-danger/20 max-w-md">
          <h2 className="font-bold text-lg mb-2">Authentication Failed</h2>
          <p className="text-sm font-mono break-words bg-white/50 p-2 rounded mt-2">{error}</p>
          <button 
            onClick={() => window.location.href = "/login"}
            className="mt-6 px-4 py-2 bg-danger text-white rounded-lg text-sm font-medium"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <div className="text-center flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-accent" />
          <p className="text-text-secondary font-medium">
            Completing secure login...
          </p>
        </div>
      )}
    </div>
  );
}
