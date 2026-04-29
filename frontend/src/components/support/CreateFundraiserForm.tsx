"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, CheckCircle2, AlertTriangle, UploadCloud, X, ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth/AuthContext";
import api from "@/services/api";

interface CreateFundraiserFormProps {
  onSuccess?: () => void;
}

export function CreateFundraiserForm({ onSuccess }: CreateFundraiserFormProps = {}) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "medical",
    goalAmount: "",
    upiId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to create a fundraiser.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await api.post("/fundraisers", {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        goal_amount: parseInt(formData.goalAmount),
        upi_id: formData.upiId,
        creator_name: user.name || "Anonymous",
        creator_email: user.email || "",
      });

      const fundraiserId = (res as any).data?.id;

      if (fundraiserId && imageFile) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);
        await api.post(`/fundraisers/${fundraiserId}/upload-image`, uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      
      setSuccess(true);
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "medical",
        goalAmount: "",
        upiId: "",
      });
      setImageFile(null);
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
      
    } catch (err: any) {
      setError(err.message || "Failed to create fundraiser");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card variant="outline" padding="lg" className="text-center max-w-2xl mx-auto">
        <Heart className="mx-auto text-text-muted mb-4" size={48} />
        <h2 className="text-xl font-bold text-text-primary mb-2">Login Required</h2>
        <p className="text-text-secondary mb-6">
          You need an account to verify your identity and start a fundraiser.
        </p>
        <Button variant="primary" onClick={() => router.push("/login")}>
          Sign In / Register
        </Button>
      </Card>
    );
  }

  if (success) {
    return (
      <Card variant="outline" padding="lg" className="text-center max-w-2xl mx-auto border-success bg-success/5">
        <CheckCircle2 className="mx-auto text-success mb-4" size={48} />
        <h2 className="text-2xl font-bold text-text-primary mb-2">Fundraiser Created!</h2>
        <p className="text-text-secondary mb-6">
          Your community support request is now live. Others can securely donate via the UPI ID provided.
        </p>
      </Card>
    );
  }

  return (
    <Card variant="outline" padding="lg" className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Start a Fundraiser</h2>
        <p className="text-text-secondary">
          Request direct community funding for a critical need. Be transparent and clear.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger flex items-center gap-3">
          <AlertTriangle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Campaign Title"
          name="title"
          placeholder="e.g., Urgent medical funds for surgery"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl border border-border bg-bg-surface text-text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            required
          >
            <option value="medical">Medical Emergency</option>
            <option value="education">Education Support</option>
            <option value="loan">Loan Relief</option>
            <option value="relief">Disaster Relief</option>
            <option value="community">Community Project</option>
            <option value="other">Other Need</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Detailed Description
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Explain the situation, why you need funds, and how they will be used..."
            value={formData.description}
            onChange={handleChange}
            className="w-full p-4 rounded-xl border border-border bg-bg-surface text-text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-y"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Campaign Image
          </label>
          {imageFile ? (
            <div className="relative rounded-xl overflow-hidden border border-border bg-bg-surface h-48 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Button variant="outline" size="sm" onClick={() => setImageFile(null)} icon={<X size={16} />}>
                  Remove Image
                </Button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl bg-bg-surface hover:bg-bg-elevated cursor-pointer transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-text-muted hover:text-accent transition-colors">
                <UploadCloud className="w-8 h-8 mb-2" />
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-xs text-text-secondary mt-1">JPEG, PNG up to 10MB</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }} 
              />
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Goal Amount (₹)"
            name="goalAmount"
            type="number"
            min="100"
            placeholder="e.g., 50000"
            value={formData.goalAmount}
            onChange={handleChange}
            required
          />
          <Input
            label="Your UPI ID"
            name="upiId"
            placeholder="e.g., name@bank"
            value={formData.upiId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="pt-4 border-t border-border">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            icon={<Heart size={18} />}
          >
            Submit Fundraiser
          </Button>
          <p className="text-center text-xs text-text-muted mt-4">
            By submitting, you agree to the VISHWAS Trust terms. Fraudulent requests will be permanently banned.
          </p>
        </div>
      </form>
    </Card>
  );
}
