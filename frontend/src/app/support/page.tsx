"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, PlusCircle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { FundraiserFeed } from "@/components/support/FundraiserFeed";
import { CreateFundraiserForm } from "@/components/support/CreateFundraiserForm";
import { CharityFundFeed } from "@/components/support/CharityFundFeed";

type Tab = "explore" | "create" | "charity";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<Tab>("explore");

  return (
    <div className="min-h-screen bg-bg-main pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Badge variant="accent" size="sm" className="mb-4">
            <Heart size={14} className="mr-1" /> Community Support
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Stand Together. Help Each Other.
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Directly fund citizens in need of urgent medical operations, loan relief, or education. Your contributions change lives.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="bg-bg-surface p-1.5 rounded-2xl inline-flex shadow-sm border border-border">
            <button
              onClick={() => setActiveTab("explore")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "explore"
                  ? "bg-bg-elevated text-accent shadow-sm border border-border/50"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
              }`}
            >
              <Search size={18} />
              Explore Causes
            </button>
            <button
              onClick={() => setActiveTab("charity")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "charity"
                  ? "bg-bg-elevated text-accent shadow-sm border border-border/50"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
              }`}
            >
              <Heart size={18} />
              Charity Funds
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "create"
                  ? "bg-bg-elevated text-accent shadow-sm border border-border/50"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
              }`}
            >
              <PlusCircle size={18} />
              Start a Fundraiser
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === "explore" && (
              <motion.div
                key="explore"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6 max-w-4xl mx-auto flex items-center gap-2 text-sm text-text-secondary bg-success/10 text-success px-4 py-3 rounded-xl">
                  <ShieldCheck size={18} className="shrink-0" />
                  <p>All funds transfer directly to the beneficiary's UPI ID. VISHWAS takes 0% platform fee.</p>
                </div>
                <FundraiserFeed />
              </motion.div>
            )}

            {activeTab === "charity" && (
              <motion.div
                key="charity"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6 max-w-4xl mx-auto flex items-center gap-2 text-sm text-text-secondary bg-accent/10 text-accent px-4 py-3 rounded-xl">
                  <ShieldCheck size={18} className="shrink-0" />
                  <p>These are verified, registered NGO trust funds. Your donations directly support their ongoing operations.</p>
                </div>
                <CharityFundFeed />
              </motion.div>
            )}

            {activeTab === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <CreateFundraiserForm onSuccess={() => setActiveTab("explore")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
