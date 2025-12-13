import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://73b81519-cb8.db-pool-europe-west1.altan.ai';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjIwNzc1Mzg5MzYsImlhdCI6MTc2MjE3ODkzNiwiaXNzIjoic3VwYWJhc2UiLCJyb2xlIjoiYW5vbiJ9.kDqVtYhvs6jweD06QcXYZHGfgs6emOLQzRmeTGIPvTw';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types based on the schema
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          website?: string;
          logo?: string;
          description?: string;
          industry?: 'Technology' | 'Healthcare' | 'Finance' | 'Education' | 'Manufacturing' | 'Other';
          size?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
          created_at: string;
          updated_at: string;
          created_by: string;
          updated_by: string;
        };
        Insert: {
          name: string;
          website?: string;
          logo?: string;
          description?: string;
          industry?: 'Technology' | 'Healthcare' | 'Finance' | 'Education' | 'Manufacturing' | 'Other';
          size?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
        };
        Update: {
          name?: string;
          website?: string;
          logo?: string;
          description?: string;
          industry?: 'Technology' | 'Healthcare' | 'Finance' | 'Education' | 'Manufacturing' | 'Other';
          size?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          company: string;
          description?: string;
          location?: string;
          f_type?: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
          status?: 'Open' | 'Closed' | 'On Hold';
          reward_amount?: number;
          requirements?: string;
          closing_date?: string;
          created_at: string;
          updated_at: string;
          created_by: string;
          updated_by: string;
        };
        Insert: {
          title: string;
          company: string;
          description?: string;
          location?: string;
          f_type?: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
          status?: 'Open' | 'Closed' | 'On Hold';
          reward_amount?: number;
          requirements?: string;
          closing_date?: string;
        };
        Update: {
          title?: string;
          company?: string;
          description?: string;
          location?: string;
          f_type?: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
          status?: 'Open' | 'Closed' | 'On Hold';
          reward_amount?: number;
          requirements?: string;
          closing_date?: string;
        };
      };
      referrals: {
        Row: {
          id: string;
          candidate_name: string;
          candidate_email: string;
          candidate_linkedin: string;
          job: string;
          recommendation?: string;
          status?: 'Pending' | 'Reviewing' | 'Interviewing' | 'Hired' | 'Rejected';
          cv_text?: string;
          reward_status?: 'Pending' | 'In Escrow' | 'Released';
          created_at: string;
          updated_at: string;
          created_by: string;
          updated_by: string;
        };
        Insert: {
          candidate_name: string;
          candidate_email: string;
          candidate_linkedin: string;
          job: string;
          recommendation?: string;
          status?: 'Pending' | 'Reviewing' | 'Interviewing' | 'Hired' | 'Rejected';
          cv_text?: string;
          reward_status?: 'Pending' | 'In Escrow' | 'Released';
        };
        Update: {
          candidate_name?: string;
          candidate_email?: string;
          candidate_linkedin?: string;
          job?: string;
          recommendation?: string;
          status?: 'Pending' | 'Reviewing' | 'Interviewing' | 'Hired' | 'Rejected';
          cv_text?: string;
          reward_status?: 'Pending' | 'In Escrow' | 'Released';
        };
      };
      applications: {
        Row: {
          id: string;
          candidate_name: string;
          candidate_email: string;
          candidate_linkedin?: string;
          job: string;
          cv?: string;
          cover_letter?: string;
          status?: 'Applied' | 'Reviewing' | 'Interviewing' | 'Hired' | 'Rejected';
          created_at: string;
          updated_at: string;
          created_by: string;
          updated_by: string;
        };
        Insert: {
          candidate_name: string;
          candidate_email: string;
          candidate_linkedin?: string;
          job: string;
          cv?: string;
          cover_letter?: string;
          status?: 'Applied' | 'Reviewing' | 'Interviewing' | 'Hired' | 'Rejected';
        };
        Update: {
          candidate_name?: string;
          candidate_email?: string;
          candidate_linkedin?: string;
          job?: string;
          cv?: string;
          cover_letter?: string;
          status?: 'Applied' | 'Reviewing' | 'Interviewing' | 'Hired' | 'Rejected';
        };
      };
      payouts: {
        Row: {
          id: string;
          amount: number;
          status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
          payment_method: 'Bank Transfer' | 'PayPal';
          transaction_id?: string;
          payout_date?: string;
          referral: string;
          created_at: string;
          updated_at: string;
          created_by: string;
          updated_by: string;
        };
        Insert: {
          amount: number;
          status?: 'Pending' | 'Processing' | 'Completed' | 'Failed';
          payment_method: 'Bank Transfer' | 'PayPal';
          transaction_id?: string;
          payout_date?: string;
          referral: string;
        };
        Update: {
          amount?: number;
          status?: 'Pending' | 'Processing' | 'Completed' | 'Failed';
          payment_method?: 'Bank Transfer' | 'PayPal';
          transaction_id?: string;
          payout_date?: string;
          referral?: string;
        };
      };
      candidates: {
        Row: {
          id: string;
          name: string;
          email: string;
          linkedin_url?: string;
          whatsapp?: string;
          cv?: string;
          role_interest?: 'Engineering' | 'Product' | 'Growth' | 'Design' | 'Sales' | 'Marketing' | 'Operations' | 'Other';
          status?: 'Not Submitted' | 'Submitted' | 'Interviewing' | 'Hired' | 'Rejected';
          referrer: string;
          recommendation?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          email: string;
          linkedin_url?: string;
          whatsapp?: string;
          cv?: string;
          role_interest?: 'Engineering' | 'Product' | 'Growth' | 'Design' | 'Sales' | 'Marketing' | 'Operations' | 'Other';
          status?: 'Not Submitted' | 'Submitted' | 'Interviewing' | 'Hired' | 'Rejected';
          referrer: string;
          recommendation?: string;
        };
        Update: {
          name?: string;
          email?: string;
          linkedin_url?: string;
          whatsapp?: string;
          cv?: string;
          role_interest?: 'Engineering' | 'Product' | 'Growth' | 'Design' | 'Sales' | 'Marketing' | 'Operations' | 'Other';
          status?: 'Not Submitted' | 'Submitted' | 'Interviewing' | 'Hired' | 'Rejected';
          referrer?: string;
          recommendation?: string;
        };
      };
      referrer_profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          personal_message?: string;
          profile_image?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          username: string;
          personal_message?: string;
          profile_image?: string;
        };
        Update: {
          username?: string;
          personal_message?: string;
          profile_image?: string;
        };
      };
      candidate_job_matches: {
        Row: {
          id: string;
          candidate: string;
          job: string;
          match_score?: number;
          status?: 'Suggested' | 'Applied' | 'Not Interested';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          candidate: string;
          job: string;
          match_score?: number;
          status?: 'Suggested' | 'Applied' | 'Not Interested';
        };
        Update: {
          candidate?: string;
          job?: string;
          match_score?: number;
          status?: 'Suggested' | 'Applied' | 'Not Interested';
        };
      };
      scout_applications: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          linkedin_url: string;
          role: 'Founder' | 'Operator' | 'Investor' | 'Other';
          trust_agreement: boolean;
          status?: 'pending' | 'approved' | 'declined';
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          full_name: string;
          email: string;
          linkedin_url: string;
          role: 'Founder' | 'Operator' | 'Investor' | 'Other';
          trust_agreement: boolean;
          status?: 'pending' | 'approved' | 'declined';
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
        };
        Update: {
          full_name?: string;
          email?: string;
          linkedin_url?: string;
          role?: 'Founder' | 'Operator' | 'Investor' | 'Other';
          trust_agreement?: boolean;
          status?: 'pending' | 'approved' | 'declined';
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
        };
      };
      scout_referral_profiles: {
        Row: {
          id: string;
          linkedin_url: string;
          relationship: string;
          suggested_role: string;
          why_great: string;
          application_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          linkedin_url: string;
          relationship: string;
          suggested_role: string;
          why_great: string;
          application_id: string;
        };
        Update: {
          linkedin_url?: string;
          relationship?: string;
          suggested_role?: string;
          why_great?: string;
        };
      };
    };
  };
}

// Helper functions for database operations
export const dbHelpers = {
  // Referrals
  async getReferrals() {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          job:jobs(
            *,
            company:companies(*)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Error fetching referrals:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.warn('Error in getReferrals:', error);
      return [];
    }
  },

  async createReferral(referral: Database['public']['Tables']['referrals']['Insert']) {
    const { data, error } = await supabase
      .from('referrals')
      .insert(referral)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to create referral');
    return data[0];
  },

  async updateReferral(id: string, updates: Database['public']['Tables']['referrals']['Update']) {
    const { data, error } = await supabase
      .from('referrals')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to update referral');
    return data[0];
  },

  // Payouts
  async getPayouts() {
    try {
      const user = supabase.auth.user();
      if (!user) {
        console.warn('No authenticated user for fetching payouts');
        return [];
      }
      const { data, error } = await supabase
        .from('payouts')
        .select(`
          *,
          referral:referrals(
            *,
            job:jobs(
              *,
              company:companies(*)
            )
          )
        `)
        .eq('referral.referrer', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Error fetching payouts:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.warn('Error in getPayouts:', error);
      return [];
    }
  },

  async createPayout(payout: Database['public']['Tables']['payouts']['Insert']) {
    const { data, error } = await supabase
      .from('payouts')
      .insert(payout)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to create payout');
    return data[0];
  },

  async updatePayout(id: string, updates: Database['public']['Tables']['payouts']['Update']) {
    const { data, error } = await supabase
      .from('payouts')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to update payout');
    return data[0];
  },

  // Applications
  async getApplications() {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(
            *,
            company:companies(*)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Error fetching applications:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.warn('Error in getApplications:', error);
      return [];
    }
  },

  async createApplication(application: Database['public']['Tables']['applications']['Insert']) {
    const { data, error } = await supabase
      .from('applications')
      .insert(application)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to create application');
    return data[0];
  },

  async updateApplication(id: string, updates: Database['public']['Tables']['applications']['Update']) {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to update application');
    return data[0];
  },

  // Jobs
  async getJobs() {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Error fetching jobs:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.warn('Error in getJobs:', error);
      return [];
    }
  },

  async createJob(job: Database['public']['Tables']['jobs']['Insert']) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select(`
        *,
        company:companies(*)
      `);
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to create job');
    return data[0];
  },

  async updateJob(id: string, updates: Database['public']['Tables']['jobs']['Update']) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        company:companies(*)
      `);
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to update job');
    return data[0];
  },

  async deleteJob(id: string) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async getJobById(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('id', id);
    
    if (error) throw error;
    return data?.[0] || null;
  },

  // Companies
  async getCompanies() {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async createCompany(company: Database['public']['Tables']['companies']['Insert']) {
    const { data, error } = await supabase
      .from('companies')
      .insert(company)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCompany(id: string, updates: Database['public']['Tables']['companies']['Update']) {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getCompanyById(id: string) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Candidates
  async getCandidates() {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getCandidatesByReferrer(referrerId: string) {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('referrer', referrerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createCandidate(candidate: Database['public']['Tables']['candidates']['Insert']) {
    const { data, error } = await supabase
      .from('candidates')
      .insert(candidate)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to create candidate');
    return data[0];
  },

  async updateCandidate(id: string, updates: Database['public']['Tables']['candidates']['Update']) {
    const { data, error } = await supabase
      .from('candidates')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to update candidate');
    return data[0];
  },

  async getCandidateById(id: string) {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id);
    
    if (error) throw error;
    return data?.[0] || null;
  },

  // Referrer Profiles
  async getReferrerProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('referrer_profiles')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        // If table doesn't exist, return null instead of throwing
        if (error.message.includes('does not exist') || error.code === '42P01') {
          console.warn('referrer_profiles table does not exist yet');
          return null;
        }
        throw error;
      }
      return data?.[0] || null;
    } catch (error) {
      console.warn('Error getting referrer profile:', error);
      return null;
    }
  },

  async getReferrerProfileByUsername(username: string) {
    try {
      const { data, error } = await supabase
        .from('referrer_profiles')
        .select('*')
        .eq('username', username);
      
      if (error) {
        // If table doesn't exist, return null instead of throwing
        if (error.message.includes('does not exist') || error.code === '42P01') {
          console.warn('referrer_profiles table does not exist yet');
          return null;
        }
        throw error;
      }
      return data?.[0] || null;
    } catch (error) {
      console.warn('Error getting referrer profile by username:', error);
      return null;
    }
  },

  async createReferrerProfile(profile: Database['public']['Tables']['referrer_profiles']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('referrer_profiles')
        .insert(profile)
        .select();
      
      if (error) {
        // If table doesn't exist, throw a more specific error
        if (error.message.includes('does not exist') || error.code === '42P01') {
          throw new Error('Referrer profiles feature is not yet available. Please contact support.');
        }
        throw error;
      }
      if (!data || data.length === 0) throw new Error('Failed to create referrer profile');
      return data[0];
    } catch (error) {
      console.error('Error creating referrer profile:', error);
      throw error;
    }
  },

  async updateReferrerProfile(userId: string, updates: Database['public']['Tables']['referrer_profiles']['Update']) {
    try {
      const { data, error } = await supabase
        .from('referrer_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select();
      
      if (error) {
        // If table doesn't exist, throw a more specific error
        if (error.message.includes('does not exist') || error.code === '42P01') {
          throw new Error('Referrer profiles feature is not yet available. Please contact support.');
        }
        throw error;
      }
      if (!data || data.length === 0) throw new Error('Failed to update referrer profile');
      return data[0];
    } catch (error) {
      console.error('Error updating referrer profile:', error);
      throw error;
    }
  },

  // Job suggestions based on candidate profile
  async suggestJobsForCandidate(candidateId: string) {
    const candidate = await this.getCandidateById(candidateId);
    if (!candidate) return [];

    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('status', 'Open')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (error) throw error;
    
    // Simple keyword matching based on role interest
    const roleKeywords = {
      'Engineering': ['engineer', 'developer', 'software', 'technical', 'backend', 'frontend', 'fullstack'],
      'Product': ['product', 'manager', 'pm', 'strategy', 'roadmap'],
      'Growth': ['growth', 'marketing', 'acquisition', 'retention', 'analytics'],
      'Design': ['design', 'ui', 'ux', 'visual', 'creative'],
      'Sales': ['sales', 'business development', 'account', 'revenue'],
      'Marketing': ['marketing', 'content', 'social', 'brand', 'campaign'],
      'Operations': ['operations', 'ops', 'process', 'logistics', 'supply'],
    };

    if (candidate.role_interest && roleKeywords[candidate.role_interest]) {
      const keywords = roleKeywords[candidate.role_interest];
      const filtered = data?.filter(job => {
        const searchText = `${job.title} ${job.description} ${job.requirements}`.toLowerCase();
        return keywords.some(keyword => searchText.includes(keyword));
      }) || [];
      
      return filtered.slice(0, 3);
    }

    return data?.slice(0, 3) || [];
  },

  // Scout Applications
  async getScoutApplications() {
    try {
      const { data, error } = await supabase
        .from('scout_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Error fetching scout applications:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.warn('Error in getScoutApplications:', error);
      return [];
    }
  },

  async createScoutApplication(application: {
    full_name: string;
    email: string;
    linkedin_url: string;
    role: 'Founder' | 'Operator' | 'Investor' | 'Other';
    trust_agreement: boolean;
    status?: 'pending' | 'approved' | 'declined';
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
  }) {
    const { data, error } = await supabase
      .from('scout_applications')
      .insert({
        ...application,
        status: application.status || 'pending'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateScoutApplication(id: string, updates: {
    full_name?: string;
    email?: string;
    linkedin_url?: string;
    role?: 'Founder' | 'Operator' | 'Investor' | 'Other';
    trust_agreement?: boolean;
    status?: 'pending' | 'approved' | 'declined';
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
  }) {
    const { data, error } = await supabase
      .from('scout_applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getScoutApplicationById(id: string) {
    try {
      const { data, error } = await supabase
        .from('scout_applications')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.warn('Error fetching scout application:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.warn('Error in getScoutApplicationById:', error);
      return null;
    }
  },

  // Scout Referral Profiles
  async getScoutReferralProfiles() {
    try {
      const { data, error } = await supabase
        .from('scout_referral_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Error fetching scout referral profiles:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.warn('Error in getScoutReferralProfiles:', error);
      return [];
    }
  },

  async getScoutReferralProfilesByApplication(applicationId: string) {
    try {
      const { data, error } = await supabase
        .from('scout_referral_profiles')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Error fetching scout referral profiles by application:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.warn('Error in getScoutReferralProfilesByApplication:', error);
      return [];
    }
  },

  async createScoutReferralProfile(profile: {
    linkedin_url: string;
    relationship: string;
    suggested_role: string;
    why_great: string;
    application_id: string;
  }) {
    const { data, error } = await supabase
      .from('scout_referral_profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createScoutReferralProfiles(profiles: {
    linkedin_url: string;
    relationship: string;
    suggested_role: string;
    why_great: string;
    application_id: string;
  }[]) {
    const { data, error } = await supabase
      .from('scout_referral_profiles')
      .insert(profiles)
      .select();
    
    if (error) throw error;
    return data;
  },

  async updateScoutReferralProfile(id: string, updates: {
    linkedin_url?: string;
    relationship?: string;
    suggested_role?: string;
    why_great?: string;
  }) {
    const { data, error } = await supabase
      .from('scout_referral_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteScoutReferralProfile(id: string) {
    const { error } = await supabase
      .from('scout_referral_profiles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};