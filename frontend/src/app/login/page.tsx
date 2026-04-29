"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth/AuthContext";
import { authService } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const { login, adminLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isAdminMode) {
        // Step 1: Password verification only — does NOT log in yet
        const { tempToken, requiresFaceEnrollment } = await authService.adminLoginStep1(email, password);

        // Store temp token for the face verification step
        sessionStorage.setItem("vishwas_temp_token", tempToken);
        
        if (requiresFaceEnrollment) {
          // Admin hasn't registered their face yet — go to enrollment
          sessionStorage.setItem("vishwas_face_enroll", "true");
          router.push("/admin/register-face");
        } else {
          // Proceed to face verification
          router.push("/admin/verify-face");
        }
      } else {
        await login(email, password);
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
            <ShieldCheck size={32} className="text-accent" />
          </div>
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-text-secondary">
            Sign in to your VISHWAS account
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setIsAdminMode(false)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !isAdminMode
                ? "bg-accent text-white"
                : "bg-bg-surface text-text-secondary hover:bg-bg-hover"
            }`}
          >
            Citizen Login
          </button>
          <button
            onClick={() => setIsAdminMode(true)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isAdminMode
                ? "bg-accent text-white"
                : "bg-bg-surface text-text-secondary hover:bg-bg-hover"
            }`}
          >
            Admin Login
          </button>
        </div>

        {/* Login form */}
        <Card variant="glass" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-danger/10 border border-danger/20"
              >
                <AlertCircle size={16} className="text-danger shrink-0" />
                <p className="text-sm text-danger">{error}</p>
              </motion.div>
            )}

            {!isAdminMode && (
              <>
                <button
                  type="button"
                  onClick={async () => {
                    setError("");
                    setIsLoading(true);
                    try {
                      const { supabase } = await import('@/lib/supabaseClient');
                      const { error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                          redirectTo: `${window.location.origin}/auth/callback`,
                        },
                      });
                      
                      if (error) throw error;
                      // The page will redirect to Google here
                    } catch (err) {
                      setError("Failed to initiate Google Auth: " + (err instanceof Error ? err.message : String(err)));
                      setIsLoading(false);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl bg-bg-elevated hover:bg-bg-hover transition-colors shadow-sm text-sm font-semibold text-text-primary"
                >
                  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.238-2.65-.611-3.917z"/>
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571c.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.238-2.65-.611-3.917z"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="flex items-center gap-4 my-6">
                  <div className="h-px bg-border flex-1"></div>
                  <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Or login with email</span>
                  <div className="h-px bg-border flex-1"></div>
                </div>
              </>
            )}

            <Input
              inputSize="lg"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              required
            />

            <div className="relative">
              <Input
                inputSize="lg"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={18} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 p-1 text-text-muted hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {isAdminMode && (
              <Badge variant="warning" size="sm" className="w-full justify-center">
                🔒 Admin access — restricted to authorized officials
              </Badge>
            )}

            <Button
              type="submit"
              size="xl"
              loading={isLoading}
              disabled={!email || !password}
              icon={<LogIn size={20} />}
              className="w-full"
            >
              {isAdminMode ? "Sign in as Admin" : "Sign In"}
            </Button>
          </form>
        </Card>

        {/* Footer links */}
        {!isAdminMode && (
          <div className="text-center mt-6">
            <p className="text-sm text-text-secondary">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-accent font-semibold hover:underline">
                Create one
              </Link>
            </p>
            <p className="text-xs text-text-muted mt-2">
              You can also{" "}
              <Link href="/submit" className="text-accent hover:underline">
                submit anonymously
              </Link>{" "}
              without logging in.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
