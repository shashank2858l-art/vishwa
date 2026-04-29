export type FundraiserCategory = "Medical" | "Education" | "Relief" | "Loan" | "Community";

export interface Fundraiser {
  id: string;
  title: string;
  description: string;
  category: FundraiserCategory;
  targetAmount: number;
  raisedAmount: number;
  beneficiaryName: string;
  upiId: string;
  imageUrl?: string;
  createdAt: string;
  isVerified: boolean;
}
