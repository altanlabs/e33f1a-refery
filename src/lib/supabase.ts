import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://database.altan.ai';
const supabaseKey = 'tenant_da5b0993_a4a7_497e_bdec_1237e9439761';

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
          candidate_linkedin?: string;
          job: string;
          recommendation?: string;
          status?: 'Pending' | 'Reviewing' | 'Interviewing' | 'Hired' | 'Rejected';
          cv?: string;
          reward_status?: 'Pending' | 'In Escrow' | 'Released';
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
          recommendation?: string;
          status?: 'Pending' | 'Reviewing' | 'Interviewing' | 'Hired' | 'Rejected';
          cv?: string;
          reward_status?: 'Pending' | 'In Escrow' | 'Released';
        };
        Update: {
          candidate_name?: string;
          candidate_email?: string;
          candidate_linkedin?: string;
          job?: string;
          recommendation?: string;
          status?: 'Pending' | 'Reviewing' | 'Interviewing' | 'Hired' | 'Rejected';
          cv?: string;
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
          linkedin?: string;
          whatsapp?: string;
          cv?: string;
          role_interest?: 'Engineering' | 'Product' | 'Growth' | 'Design' | 'Sales' | 'Marketing' | 'Operations' | 'Other';
          status?: 'Not Submitted' | 'Submitted' | 'Interviewing' | 'Hired' | 'Rejected';
          referrer_id: string;
          recommendation?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          email: string;
          linkedin?: string;
          whatsapp?: string;
          cv?: string;
          role_interest?: 'Engineering' | 'Product' | 'Growth' | 'Design' | 'Sales' | 'Marketing' | 'Operations' | 'Other';
          status?: 'Not Submitted' | 'Submitted' | 'Interviewing' | 'Hired' | 'Rejected';
          referrer_id: string;
          recommendation?: string;
        };
        Update: {
          name?: string;
          email?: string;
          linkedin?: string;
          whatsapp?: string;
          cv?: string;
          role_interest?: 'Engineering' | 'Product' | 'Growth' | 'Design' | 'Sales' | 'Marketing' | 'Operations' | 'Other';
          status?: 'Not Submitted' | 'Submitted' | 'Interviewing' | 'Hired' | 'Rejected';
          referrer_id?: string;
          recommendation?: string;
        };
      };
      referrer_profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          intro_message?: string;
          profile_image?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          username: string;
          intro_message?: string;
          profile_image?: string;
        };
        Update: {
          username?: string;
          intro_message?: string;
          profile_image?: string;
        };
      };
    };
  };
}

// Helper functions for database operations
export const dbHelpers = {
  // Referrals
  async getReferrals() {
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
    
    if (error) throw error;
    return data;
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
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
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
    
    if (error) throw error;
    return data;
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
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
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
      .eq('referrer_id', referrerId)
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
    const { data, error } = await supabase
      .from('referrer_profiles')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data?.[0] || null;
  },

  async getReferrerProfileByUsername(username: string) {
    const { data, error } = await supabase
      .from('referrer_profiles')
      .select('*')
      .eq('username', username);
    
    if (error) throw error;
    return data?.[0] || null;
  },

  async createReferrerProfile(profile: Database['public']['Tables']['referrer_profiles']['Insert']) {
    const { data, error } = await supabase
      .from('referrer_profiles')
      .insert(profile)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to create referrer profile');
    return data[0];
  },

  async updateReferrerProfile(userId: string, updates: Database['public']['Tables']['referrer_profiles']['Update']) {
    const { data, error } = await supabase
      .from('referrer_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to update referrer profile');
    return data[0];
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
  }
};