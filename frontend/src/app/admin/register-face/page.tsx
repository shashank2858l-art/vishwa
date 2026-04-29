"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { authService } from "@/services/authService";

type EnrollStatus =
  | "initializing"
  | "camera_ready"
  | "capturing"
  | "enrolling"
  | "success"
  | "error";

export default function RegisterFacePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<EnrollStatus>("initializing");
  const [errorMessage, setErrorMessage] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    // Must have a temp token (came from Step 1) or be a logged-in admin
    const tempToken = sessionStorage.getItem("vishwas_temp_token");
    const token = localStorage.getItem("vishwas_token");
    if (!tempToken && !token) {
      router.push("/login");
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
    } catch {
      setStatus("error");
      setErrorMessage("Camera access denied. Please allow camera permission.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    setStatus("capturing");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(imageData);
  };

  const handleEnroll = async () => {
    if (!capturedImage) return;

    setStatus("enrolling");
    setErrorMessage("");

    try {
      // For enrollment during first login, we need to use the temp token
      // to first complete a simplified registration, then proceed
      await authService.registerAdminFace(capturedImage);

      setStatus("success");
      stopCamera();

      // After enrollment, redirect to face verification to complete login
      setTimeout(() => {
        const hasEnrollFlag = sessionStorage.getItem("vishwas_face_enroll");
        if (hasEnrollFlag) {
          sessionStorage.removeItem("vishwas_face_enroll");
          router.push("/admin/verify-face");
        } else {
          router.push("/admin");
        }
      }, 2000);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Face registration failed");
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setStatus("camera_ready");
  };

  const handleBack = () => {
    stopCamera();
    sessionStorage.removeItem("vishwas_temp_token");
    sessionStorage.removeItem("vishwas_face_enroll");
    router.push("/login");
  };

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
            <UserPlus size={32} className="text-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary mb-1">
            Register Your Face
          </h1>
          <p className="text-text-secondary text-sm">
            One-time enrollment for biometric admin access
          </p>
        </div>

        <Card variant="glass" padding="lg">
          <Badge variant="accent" size="sm" className="w-full justify-center mb-4">
            🔒 This image is securely stored and used only for admin authentication
          </Badge>

          {/* Camera / Preview */}
          <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3] mb-4">
            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            ) : (
              <img
                src={capturedImage}
                alt="Captured face"
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* Guide oval */}
            {!capturedImage && status === "camera_ready" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-60 border-2 border-accent/60 rounded-[50%] animate-pulse" />
              </div>
            )}

            {/* Success overlay */}
            <AnimatePresence>
              {status === "success" && (
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
                  <p className="text-green-100 font-bold text-lg mt-3">Face Registered!</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enrolling overlay */}
            {status === "enrolling" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                <Loader2 size={40} className="text-accent animate-spin" />
                <p className="text-white font-medium mt-3">Registering face...</p>
              </div>
            )}
          </div>

          {/* Error */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-danger/10 border border-danger/20 mb-4"
            >
              <p className="text-sm text-danger">{errorMessage}</p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              icon={<ArrowLeft size={18} />}
            >
              Back
            </Button>

            {status === "camera_ready" && !capturedImage && (
              <Button
                size="lg"
                onClick={handleCapture}
                icon={<Camera size={18} />}
                className="flex-1"
              >
                Capture Photo
              </Button>
            )}

            {capturedImage && status !== "enrolling" && status !== "success" && (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleRetake}
                >
                  Retake
                </Button>
                <Button
                  size="lg"
                  onClick={handleEnroll}
                  icon={<ShieldCheck size={18} />}
                  className="flex-1"
                >
                  Register Face
                </Button>
              </>
            )}

            {status === "enrolling" && (
              <Button size="lg" loading disabled className="flex-1">
                Registering...
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
