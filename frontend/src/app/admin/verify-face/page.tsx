"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ShieldCheck,
  ShieldAlert,
  Scan,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth/AuthContext";

type VerifyStatus =
  | "initializing"
  | "camera_ready"
  | "center_face"
  | "capturing"
  | "verifying"
  | "access_granted"
  | "face_mismatch"
  | "no_face"
  | "error"
  | "expired";

const STATUS_CONFIG: Record<VerifyStatus, { label: string; color: string; icon: React.ReactNode }> = {
  initializing: { label: "Initializing Camera...", color: "text-text-secondary", icon: <Loader2 size={20} className="animate-spin" /> },
  camera_ready: { label: "Camera Ready", color: "text-accent", icon: <Camera size={20} /> },
  center_face: { label: "Center Your Face", color: "text-yellow-500", icon: <Scan size={20} /> },
  capturing: { label: "Capturing...", color: "text-accent", icon: <Camera size={20} /> },
  verifying: { label: "Verifying Identity...", color: "text-accent", icon: <Loader2 size={20} className="animate-spin" /> },
  access_granted: { label: "Access Granted", color: "text-green-500", icon: <CheckCircle2 size={20} /> },
  face_mismatch: { label: "Face Mismatch", color: "text-red-500", icon: <XCircle size={20} /> },
  no_face: { label: "No Face Detected", color: "text-yellow-500", icon: <ShieldAlert size={20} /> },
  error: { label: "Verification Error", color: "text-red-500", icon: <XCircle size={20} /> },
  expired: { label: "Session Expired", color: "text-red-500", icon: <ShieldAlert size={20} /> },
};

const MAX_ATTEMPTS = 3;

export default function VerifyFacePage() {
  const router = useRouter();
  const { adminLoginStep2 } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<VerifyStatus>("initializing");
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);

  // Check for temp token on mount
  useEffect(() => {
    const tempToken = sessionStorage.getItem("vishwas_temp_token");
    if (!tempToken) {
      setStatus("expired");
      setErrorMessage("No active login session. Please login again.");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setStatus("initializing");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("camera_ready");

      // Auto-transition to center_face after a brief moment
      setTimeout(() => setStatus("center_face"), 1500);
    } catch (err) {
      setStatus("error");
      setErrorMessage("Camera access denied. Please allow camera permission and try again.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const captureFrame = (): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const handleVerify = useCallback(async () => {
    if (attempts >= MAX_ATTEMPTS) {
      setStatus("error");
      setErrorMessage("Maximum verification attempts reached. Please login again.");
      stopCamera();
      setTimeout(() => {
        sessionStorage.removeItem("vishwas_temp_token");
        router.push("/login");
      }, 3000);
      return;
    }

    // Countdown animation
    setStatus("capturing");
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((r) => setTimeout(r, 700));
    }
    setCountdown(null);

    // Capture
    const faceImage = captureFrame();
    if (!faceImage) {
      setStatus("error");
      setErrorMessage("Failed to capture image from camera.");
      return;
    }

    // Verify
    setStatus("verifying");
    const tempToken = sessionStorage.getItem("vishwas_temp_token");
    if (!tempToken) {
      setStatus("expired");
      return;
    }

    try {
      // Use AuthContext to ensure React state updates immediately
      await adminLoginStep2(tempToken, faceImage);

      // Success!
      setStatus("access_granted");
      stopCamera();

      // Clean up session
      sessionStorage.removeItem("vishwas_temp_token");

      // Redirect to admin dashboard after brief success animation
      // Using window.location.href ensures a completely fresh app state
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      setAttempts((prev) => prev + 1);

      if (msg.includes("No face detected")) {
        setStatus("no_face");
      } else if (msg.includes("expired")) {
        setStatus("expired");
        sessionStorage.removeItem("vishwas_temp_token");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setStatus("face_mismatch");
      }
      setErrorMessage(msg);
    }
  }, [attempts, router]);

  const handleRetry = () => {
    setErrorMessage("");
    setStatus("center_face");
  };

  const handleBack = () => {
    stopCamera();
    sessionStorage.removeItem("vishwas_temp_token");
    router.push("/login");
  };

  const currentStatus = STATUS_CONFIG[status];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-bg-primary via-bg-primary to-bg-elevated">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
            <ShieldCheck size={32} className="text-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary mb-1">
            Face Verification
          </h1>
          <p className="text-text-secondary text-sm">
            Step 2 of 2 — Confirm your identity
          </p>
        </div>

        {/* Camera Card */}
        <Card variant="glass" padding="lg">
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-2 ${currentStatus.color}`}>
              {currentStatus.icon}
              <span className="text-sm font-semibold">{currentStatus.label}</span>
            </div>
            <span className="text-xs text-text-muted">
              Attempts Remaining: {MAX_ATTEMPTS - attempts}
            </span>
          </div>

          {/* Camera Viewport */}
          <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3] mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
              style={{ transform: "scaleX(-1)" }}
            />

            {/* Canvas for capture (hidden) */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Scan Overlay */}
            <AnimatePresence>
              {(status === "center_face" || status === "camera_ready") && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Face guide oval */}
                  <div className="w-48 h-60 border-2 border-accent/60 rounded-[50%] animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scanning Animation */}
            <AnimatePresence>
              {status === "verifying" && (
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"
                />
              )}
            </AnimatePresence>

            {/* Countdown Overlay */}
            <AnimatePresence>
              {countdown !== null && (
                <motion.div
                  key={countdown}
                  initial={{ scale: 2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40"
                >
                  <span className="text-6xl font-bold text-white drop-shadow-lg">
                    {countdown}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Overlay */}
            <AnimatePresence>
              {status === "access_granted" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/20 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <CheckCircle2 size={64} className="text-green-500" />
                  </motion.div>
                  <p className="text-green-100 font-bold text-lg mt-3">Identity Confirmed</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Failure Overlay */}
            <AnimatePresence>
              {(status === "face_mismatch" || status === "no_face") && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/20 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <XCircle size={64} className="text-red-500" />
                  </motion.div>
                  <p className="text-red-100 font-bold text-lg mt-3">
                    {status === "no_face" ? "No Face Detected" : "Face Mismatch"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error Message */}
          {errorMessage && (status === "face_mismatch" || status === "no_face" || status === "error") && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-danger/10 border border-danger/20 mb-4"
            >
              <p className="text-sm text-danger">{errorMessage}</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              icon={<ArrowLeft size={18} />}
              className="flex-1"
            >
              Back
            </Button>

            {(status === "center_face" || status === "camera_ready") && (
              <Button
                size="lg"
                onClick={handleVerify}
                icon={<Scan size={18} />}
                className="flex-[2]"
              >
                Verify Face
              </Button>
            )}

            {(status === "face_mismatch" || status === "no_face") && attempts < MAX_ATTEMPTS && (
              <Button
                size="lg"
                onClick={handleRetry}
                icon={<RefreshCw size={18} />}
                className="flex-[2]"
              >
                Retry ({MAX_ATTEMPTS - attempts} left)
              </Button>
            )}

            {status === "verifying" && (
              <Button size="lg" loading disabled className="flex-[2]">
                Verifying...
              </Button>
            )}
          </div>
        </Card>

        {/* Security Notice */}
        <p className="text-center text-xs text-text-muted mt-4">
          🔒 Your camera feed is processed securely and never stored.
        </p>
      </motion.div>
    </div>
  );
}
