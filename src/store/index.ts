import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, User, Company, Job, Referral, Application, Candidate, Payout } from '@/types';

interface AppStore extends AppState {
  // Auth actions
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  
  // Company actions
  addCompany: (company: Company) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  
  // Job actions
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  
  // Referral actions
  addReferral: (referral: Referral) => void;
  updateReferral: (id: string, updates: Partial<Referral>) => void;
  
  // Application actions
  addApplication: (application: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  
  // Candidate actions
  addCandidate: (candidate: Candidate) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  
  // Payout actions
  addPayout: (payout: Payout) => void;
  updatePayout: (id: string, updates: Partial<Payout>) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      auth: {
        user: null,
        isLoading: false,
        isAuthenticated: false,
      },
      companies: [],
      jobs: [],
      referrals: [],
      applications: [],
      candidates: [],
      payouts: [],

      // Auth actions
      login: (user: User) =>
        set((state) => ({
          auth: {
            ...state.auth,
            user,
            isAuthenticated: true,
            isLoading: false,
          },
        })),

      logout: () =>
        set((state) => ({
          auth: {
            ...state.auth,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          },
        })),

      setLoading: (loading: boolean) =>
        set((state) => ({
          auth: {
            ...state.auth,
            isLoading: loading,
          },
        })),

      // Company actions
      addCompany: (company: Company) =>
        set((state) => ({
          companies: [...state.companies, company],
        })),

      updateCompany: (id: string, updates: Partial<Company>) =>
        set((state) => ({
          companies: state.companies.map((company) =>
            company.id === id ? { ...company, ...updates } : company
          ),
        })),

      // Job actions
      addJob: (job: Job) =>
        set((state) => ({
          jobs: [...state.jobs, job],
        })),

      updateJob: (id: string, updates: Partial<Job>) =>
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job.id === id ? { ...job, ...updates } : job
          ),
        })),

      deleteJob: (id: string) =>
        set((state) => ({
          jobs: state.jobs.filter((job) => job.id !== id),
        })),

      // Referral actions
      addReferral: (referral: Referral) =>
        set((state) => ({
          referrals: [...state.referrals, referral],
        })),

      updateReferral: (id: string, updates: Partial<Referral>) =>
        set((state) => ({
          referrals: state.referrals.map((referral) =>
            referral.id === id ? { ...referral, ...updates } : referral
          ),
        })),

      // Application actions
      addApplication: (application: Application) =>
        set((state) => ({
          applications: [...state.applications, application],
        })),

      updateApplication: (id: string, updates: Partial<Application>) =>
        set((state) => ({
          applications: state.applications.map((application) =>
            application.id === id ? { ...application, ...updates } : application
          ),
        })),

      // Candidate actions
      addCandidate: (candidate: Candidate) =>
        set((state) => ({
          candidates: [...state.candidates, candidate],
        })),

      updateCandidate: (id: string, updates: Partial<Candidate>) =>
        set((state) => ({
          candidates: state.candidates.map((candidate) =>
            candidate.id === id ? { ...candidate, ...updates } : candidate
          ),
        })),

      // Payout actions
      addPayout: (payout: Payout) =>
        set((state) => ({
          payouts: [...state.payouts, payout],
        })),

      updatePayout: (id: string, updates: Partial<Payout>) =>
        set((state) => ({
          payouts: state.payouts.map((payout) =>
            payout.id === id ? { ...payout, ...updates } : payout
          ),
        })),
    }),
    {
      name: 'refery-store',
    }
  )
);