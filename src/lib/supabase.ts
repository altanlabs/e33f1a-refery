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
    };
  };
}