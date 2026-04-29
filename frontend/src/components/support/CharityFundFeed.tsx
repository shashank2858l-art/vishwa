"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Activity, Share2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

const CHARITY_FUNDS = [
  {
    id: "charity-1",
    title: "Anath Ashram (Orphanage)",
    description: "Providing shelter, education, and nutrition to orphaned and abandoned children. Your support helps us give them a brighter future and a safe home.",
    category: "Child Welfare",
    goal_amount: 500000,
    raised_amount: 320500,
    creator_name: "Anath Ashram Trust",
    upi_id: "shashank.s.shendre1@okhdfcbank",
    donor_count: 145,
    image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "charity-2",
    title: "Sanjeevani Old Age Home",
    description: "A sanctuary for elderly citizens who have been abandoned by their families. We provide medical care, meals, and a loving community.",
    category: "Elder Care",
    goal_amount: 300000,
    raised_amount: 185000,
    creator_name: "Sanjeevani Foundation",
    upi_id: "shashank.s.shendre1@okhdfcbank",
    donor_count: 89,
    image_url: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "charity-3",
    title: "Stray Animal Rescue",
    description: "Rescuing, treating, and rehabilitating injured and abused street animals. We also conduct sterilization and vaccination drives.",
    category: "Animal Welfare",
    goal_amount: 200000,
    raised_amount: 145200,
    creator_name: "Paws & Claws NGO",
    upi_id: "shashank.s.shendre1@okhdfcbank",
    donor_count: 210,
    image_url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "charity-4",
    title: "Women's Empowerment Shelter",
    description: "A safe house for victims of domestic abuse. We provide legal aid, vocational training, and psychological support to help women become independent.",
    category: "Women Welfare",
    goal_amount: 400000,
    raised_amount: 210000,
    creator_name: "Shakti Foundation",
    upi_id: "shashank.s.shendre1@okhdfcbank",
    donor_count: 134,
    image_url: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "charity-5",
    title: "Vidya - Education for All",
    description: "Funding the education of underprivileged children in rural areas. We provide books, uniforms, and digital learning tools.",
    category: "Education",
    goal_amount: 600000,
    raised_amount: 480000,
    creator_name: "Vidya Trust",
    upi_id: "shashank.s.shendre1@okhdfcbank",
    donor_count: 356,
    image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
  }
];

export function CharityFundFeed() {
  const [selectedCampaign, setSelectedCampaign] = useState<typeof CHARITY_FUNDS[0] | null>(null);
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [showQR, setShowQR] = useState(false);
  const [donating, setDonating] = useState(false);

  const handleDonate = () => {
    const amount = parseInt(donationAmount);
    if (amount > 0 && selectedCampaign) {
      setShowQR(true);
    }
  };

  const confirmDonation = async () => {
    if (!selectedCampaign) return;
    const amount = parseInt(donationAmount) || 0;
    if (amount <= 0) return;

    setDonating(true);
    // Simulate API call since this is hardcoded
    setTimeout(() => {
      setDonating(false);
      setShowQR(false);
      setSelectedCampaign(null);
      setDonationAmount("");
      alert("Thank you for your generous donation to the charity!");
    }, 1500);
  };

  const getUpiUrl = () => {
    if (!selectedCampaign || !selectedCampaign.upi_id) return "";
    const amount = parseInt(donationAmount) || 0;
    return `upi://pay?pa=${selectedCampaign.upi_id}&pn=${encodeURIComponent(selectedCampaign.creator_name)}&am=${amount}&cu=INR`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {CHARITY_FUNDS.map((campaign, idx) => {
        const progress = Math.min(100, Math.round((campaign.raised_amount / campaign.goal_amount) * 100));
        
        return (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card variant="outline" className="overflow-hidden border-border bg-bg-elevated flex flex-col md:flex-row">
              {/* Left Image Side */}
              <div className="w-full md:w-64 h-48 md:h-auto relative bg-bg-surface shrink-0 overflow-hidden">
                {campaign.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={campaign.image_url} alt={campaign.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <Activity size={32} />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="accent" className="bg-white/90 backdrop-blur-sm text-accent shadow-sm border-none">
                    {campaign.category}
                  </Badge>
                </div>
              </div>

              {/* Right Content Side */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-text-primary line-clamp-2">
                    {campaign.title}
                  </h3>
                  <Badge variant="outline" className="shrink-0 ml-2 border-accent text-accent">
                    <Building2 size={12} className="mr-1" /> Verified NGO
                  </Badge>
                </div>
                
                <p className="text-sm text-text-secondary line-clamp-3 mb-4 flex-1">
                  {campaign.description}
                </p>

                <div className="space-y-4 mt-auto">
                  {/* Progress Bar Area */}
                  <div>
                    <div className="flex justify-between text-sm font-medium mb-1.5">
                      <span className="text-accent">₹{campaign.raised_amount.toLocaleString()} raised</span>
                      <span className="text-text-muted">Goal: ₹{campaign.goal_amount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-bg-surface rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-muted mt-1">{campaign.donor_count} donors</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                        {campaign.creator_name.charAt(0)}
                      </div>
                      <span className="truncate max-w-[120px] font-medium text-text-primary">{campaign.creator_name}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" icon={<Share2 size={16} />}>Share</Button>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        icon={<Heart size={16} />}
                        onClick={() => setSelectedCampaign(campaign)}
                      >
                        Donate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}

      {/* Donation Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => {
                if (!showQR) setSelectedCampaign(null);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md bg-bg-elevated rounded-2xl shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-border bg-bg-surface">
                  <h3 className="font-bold text-text-primary text-lg flex items-center gap-2">
                    <Heart className="text-accent" size={20} /> Support Charity
                  </h3>
                  <p className="text-sm text-text-secondary truncate mt-1">
                    {selectedCampaign.title}
                  </p>
                </div>

                <div className="p-6">
                  {!showQR ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Select Amount
                        </label>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {[500, 1000, 5000].map(amt => (
                            <button
                              key={amt}
                              onClick={() => setDonationAmount(amt.toString())}
                              className={`py-2 rounded-xl border text-sm font-medium transition-all ${
                                donationAmount === amt.toString()
                                  ? "bg-accent/10 border-accent text-accent"
                                  : "bg-bg-surface border-border text-text-primary hover:border-accent/50"
                              }`}
                            >
                              ₹{amt}
                            </button>
                          ))}
                        </div>
                        <Input
                          type="number"
                          placeholder="Or enter custom amount (₹)"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                        />
                      </div>

                      <Button 
                        className="w-full" 
                        size="lg" 
                        disabled={!donationAmount || parseInt(donationAmount) <= 0}
                        onClick={handleDonate}
                      >
                        Proceed to Pay {donationAmount ? `₹${donationAmount}` : ""}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-bg-surface rounded-xl border border-border mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getUpiUrl())}`} 
                          alt="UPI QR Code" 
                          className="w-48 h-48"
                        />
                      </div>
                      <p className="font-bold text-text-primary">₹{donationAmount}</p>
                      <p className="text-sm text-text-secondary mb-4">Paying to: {selectedCampaign.creator_name}</p>
                      
                      <div className="flex gap-3 w-full">
                        <Button variant="outline" className="flex-1" onClick={() => setShowQR(false)}>Back</Button>
                        <Button variant="primary" className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={confirmDonation} disabled={donating}>
                          {donating ? "Recording..." : "I have paid"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
