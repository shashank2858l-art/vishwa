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
        // Step 1: Check if we have hash fragment params (implicit flow)
        // Supabase OAuth returns: /auth/callback#access_token=...&refresh_token=...
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1) // remove the '#'
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        let session = null;

        if (accessToken && refreshToken) {
          // We have tokens in the URL hash — set the session manually
          const { data, error: setError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (setError) {
            console.error("Failed to set session from hash:", setError);
            throw new Error(setError.message);
          }

          session = data.session;
        }

        // Step 2: If no hash tokens, try getSession (handles PKCE / code flow)
        if (!session) {
          // Check for ?code= param (PKCE flow)
          const url = new URL(window.location.href);
          const code = url.searchParams.get("code");

          if (code) {
            // Exchange the authorization code for a session
            const { data, error: exchangeError } =
              await supabase.auth.exchangeCodeForSession(code);

            if (exchangeError) {
              console.error("Code exchange error:", exchangeError);
              throw new Error(exchangeError.message);
            }
            session = data.session;
          }
        }

        // Step 3: Fallback — wait for Supabase to auto-detect session
        if (!session) {
          // Give Supabase client time to auto-detect the session from URL
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const {
            data: { session: existingSession },
            error: sessionError,
          } = await supabase.auth.getSession();

          if (sessionError) {
            console.error("getSession error:", sessionError);
            throw new Error(sessionError.message);
          }
          session = existingSession;
        }

        // Step 4: Final check — listen for auth state change
        if (!session) {
          session = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(
                new Error(
                  "Authentication timed out. Please try logging in again."
                )
              );
            }, 10000);

            const {
              data: { subscription },
            } = supabase.auth.onAuthStateChange((event, sess) => {
              if (event === "SIGNED_IN" && sess) {
                clearTimeout(timeout);
                subscription.unsubscribe();
                resolve(sess);
              }
            });
          });
        }

        if (!session) {
          throw new Error(
            "No active session found after Google Auth. Please try again."
          );
        }

        // Step 5: Send the Supabase access token to our backend
        // Backend verifies it with Supabase and creates/returns our own JWT
        const result = await authService.googleLogin(session.access_token);

        // Step 6: Redirect to home page with full page reload
        // to ensure AuthContext picks up the new localStorage auth state
        window.location.href = "/";
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to complete authentication"
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      }
    }

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {error ? (
        <div className="text-center p-6 bg-danger/10 text-danger rounded-xl border border-danger/20 max-w-md">
          <h2 className="font-bold text-lg mb-2">Authentication Failed</h2>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-4 opacity-80">
            Redirecting back to login...
          </p>
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
