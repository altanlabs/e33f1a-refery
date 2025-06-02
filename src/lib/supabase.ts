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
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateReferral(id: string, updates: Database['public']['Tables']['referrals']['Update']) {
    const { data, error } = await supabase
      .from('referrals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updatePayout(id: string, updates: Database['public']['Tables']['payouts']['Update']) {
    const { data, error } = await supabase
      .from('payouts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateApplication(id: string, updates: Database['public']['Tables']['applications']['Update']) {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateJob(id: string, updates: Database['public']['Tables']['jobs']['Update']) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        company:companies(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
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
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Companies
  async getCompanies() {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }
};