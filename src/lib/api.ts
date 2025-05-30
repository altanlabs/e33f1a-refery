import { supabase } from './supabase';
import type { Database } from './supabase';

type Company = Database['public']['Tables']['companies']['Row'];
type Job = Database['public']['Tables']['jobs']['Row'];
type Referral = Database['public']['Tables']['referrals']['Row'];
type Application = Database['public']['Tables']['applications']['Row'];

// Company API
export const companyApi = {
  async getAll(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(company: Database['public']['Tables']['companies']['Insert']): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .insert(company)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Database['public']['Tables']['companies']['Update']): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Job API
export const jobApi = {
  async getAll(): Promise<(Job & { company_data?: Company })[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company_data:companies(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<(Job & { company_data?: Company }) | null> {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company_data:companies(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByCompany(companyId: string): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('company', companyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(job: Database['public']['Tables']['jobs']['Insert']): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Database['public']['Tables']['jobs']['Update']): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Referral API
export const referralApi = {
  async getAll(): Promise<(Referral & { job_data?: Job & { company_data?: Company } })[]> {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        job_data:jobs(
          *,
          company_data:companies(*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<(Referral & { job_data?: Job & { company_data?: Company } }) | null> {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        job_data:jobs(
          *,
          company_data:companies(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByJob(jobId: string): Promise<Referral[]> {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('job', jobId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(referral: Database['public']['Tables']['referrals']['Insert']): Promise<Referral> {
    const { data, error } = await supabase
      .from('referrals')
      .insert(referral)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Database['public']['Tables']['referrals']['Update']): Promise<Referral> {
    const { data, error } = await supabase
      .from('referrals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('referrals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Application API
export const applicationApi = {
  async getAll(): Promise<(Application & { job_data?: Job & { company_data?: Company } })[]> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job_data:jobs(
          *,
          company_data:companies(*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<(Application & { job_data?: Job & { company_data?: Company } }) | null> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job_data:jobs(
          *,
          company_data:companies(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByJob(jobId: string): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('job', jobId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(application: Database['public']['Tables']['applications']['Insert']): Promise<Application> {
    const { data, error } = await supabase
      .from('applications')
      .insert(application)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Database['public']['Tables']['applications']['Update']): Promise<Application> {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Auth API
export const authApi = {
  async signUp(email: string, password: string, userData: { name: string; role: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// File upload API
export const fileApi = {
  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return publicUrl;
  },

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
  }
};