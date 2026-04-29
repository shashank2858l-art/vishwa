"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mic, ShieldCheck, Search, CheckCircle2, ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      {/* Immersive Video Header */}
      <div className="relative w-full bg-black">
        <div className="absolute top-6 left-6 z-50">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/90 hover:text-white transition-all border border-white/10">
            <ArrowLeft size={18} />
            <span className="font-medium text-sm">Back to Home</span>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto w-full aspect-video relative group">
          <video 
            className="w-full h-full object-contain bg-black"
            controls
            autoPlay
            muted
            playsInline
            poster="/demo_thumb.png"
            src="/20260429-2213-20.8214360.mp4"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 text-text-primary">How VISHWAS Works</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            A step-by-step guide on how we empower citizens to report issues securely, anonymously, and effectively.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }} 
          className="grid sm:grid-cols-2 gap-6 mb-16"
        >
          <div className="p-8 bg-bg-surface rounded-3xl flex flex-col items-start gap-4 border border-border shadow-sm hover:shadow-md hover:border-accent/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
              <Mic size={26} className="text-accent" />
            </div>
            <div>
              <p className="font-display font-bold text-xl mb-2 text-text-primary">1. Speak & Upload</p>
              <p className="text-text-secondary leading-relaxed">Use your voice in any language. Attach a photo if you have one. Our AI will automatically transcribe and categorize your issue.</p>
            </div>
          </div>
          
          <div className="p-8 bg-bg-surface rounded-3xl flex flex-col items-start gap-4 border border-border shadow-sm hover:shadow-md hover:border-accent/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={26} className="text-accent" />
            </div>
            <div>
              <p className="font-display font-bold text-xl mb-2 text-text-primary">2. Stay Anonymous</p>
              <p className="text-text-secondary leading-relaxed">Your identity is completely protected. You can choose to remain 100% anonymous, ensuring no fear of retaliation.</p>
            </div>
          </div>
          
          <div className="p-8 bg-bg-surface rounded-3xl flex flex-col items-start gap-4 border border-border shadow-sm hover:shadow-md hover:border-accent/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
              <Search size={26} className="text-accent" />
            </div>
            <div>
              <p className="font-display font-bold text-xl mb-2 text-text-primary">3. Track with PIN</p>
              <p className="text-text-secondary leading-relaxed">After submission, you receive a secure 6-digit PIN. Use it to track the real-time status and see exactly when authorities act.</p>
            </div>
          </div>
          
          <div className="p-8 bg-bg-surface rounded-3xl flex flex-col items-start gap-4 border border-border shadow-sm hover:shadow-md hover:border-accent/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
              <CheckCircle2 size={26} className="text-accent" />
            </div>
            <div>
              <p className="font-display font-bold text-xl mb-2 text-text-primary">4. Verify Proof</p>
              <p className="text-text-secondary leading-relaxed">When the issue is resolved, authorities upload proof. The community validates if the work was actually completed.</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4 }} 
          className="text-center bg-accent/5 border border-accent/20 rounded-3xl p-10"
        >
          <h2 className="font-display text-2xl font-bold mb-3 text-text-primary">Ready to make a difference?</h2>
          <p className="text-text-secondary mb-8">It takes less than 2 minutes to report a civic issue.</p>
          <Link href="/submit">
            <Button size="xl" className="shadow-[0_8px_30px_rgb(var(--accent-rgb),0.3)] hover:shadow-[0_8px_30px_rgb(var(--accent-rgb),0.5)] transition-all hover:-translate-y-1 rounded-full px-8">
              <Mic size={20} className="mr-2" />
              Speak Your Complaint Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
