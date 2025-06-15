export interface User {
  id: string;
  email: string;
  name: string;
  role: 'poster' | 'referrer' | 'candidate';
  avatar?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  website?: string;
  logo?: string;
  description?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  companyId: string;
  company?: Company;
  title: string;
  description: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  rewardAmount: number;
  status: 'active' | 'paused' | 'closed';
  requirements: string[];
  benefits: string[];
  createdAt: string;
  closingDate?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  linkedin?: string;
  cv?: string;
  bio?: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  jobId: string;
  job?: Job;
  candidateId: string;
  candidate?: Candidate;
  referrerId: string;
  referrer?: User;
  status: 'not-reviewed' | 'viewed' | 'interviewing' | 'rejected' | 'offered' | 'hired';
  introNote: string;
  rewardStatus: 'pending' | 'in-escrow' | 'released';
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  job?: Job;
  candidateId: string;
  candidate?: Candidate;
  referrerId?: string;
  referrer?: User;
  status: 'not-reviewed' | 'viewed' | 'interviewing' | 'rejected' | 'offered' | 'hired';
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payout {
  id: string;
  referralId: string;
  referral?: Referral;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'bank' | 'paypal';
  createdAt: string;
  processedAt?: string;
}

export interface ScoutApplication {
  id: string;
  full_name: string;
  email: string;
  linkedin_url: string;
  role: 'Founder' | 'Operator' | 'Investor' | 'Other';
  cv_upload?: string;
  referral_example: string;
  trust_agreement: boolean;
  status: 'pending' | 'approved' | 'declined';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AppState {
  auth: AuthState;
  companies: Company[];
  jobs: Job[];
  referrals: Referral[];
  applications: Application[];
  candidates: Candidate[];
  payouts: Payout[];
  scoutApplications: ScoutApplication[];
}