import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  Save
} from 'lucide-react';
import { useAuth } from 'altan-auth';
import { dbHelpers } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

export default function NewJob() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    f_type: '',
    reward_amount: '',
    requirements: '',
    closing_date: ''
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await dbHelpers.getCompanies();
      setCompanies(data || []);
    } catch (err) {
      console.error('Error loading companies:', err);
      setError('Failed to load companies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.company || !formData.description || !formData.location || !formData.f_type) {
      setError('Please fill in all required fields');
      return;
    }

    if (!session?.user) {
      setError('You must be logged in to create a job');
      return;
    }

    const userRole = session.user.user_metadata?.role || 'referrer';
    if (userRole !== 'poster') {
      setError('You must be a poster to create jobs');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const jobData = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        location: formData.location,
        f_type: formData.f_type as 'Full-time' | 'Part-time' | 'Contract' | 'Remote',
        status: 'Open' as const,
        reward_amount: formData.reward_amount ? parseInt(formData.reward_amount) : 0,
        requirements: formData.requirements,
        closing_date: formData.closing_date || undefined
      };

      await dbHelpers.createJob(jobData);
      
      toast.success('Job posted successfully!');
      navigate('/jobs', {
        state: { message: 'Job posted successfully!' }
      });
    } catch (err: any) {
      console.error('Error creating job:', err);
      setError(err.message || 'Failed to create job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const userRole = session?.user?.user_metadata?.role || 'referrer';

  if (!session?.user || userRole !== 'poster') {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You must be logged in as a poster to create jobs.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/jobs')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Post a New Job
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create a job posting to find candidates through referrals
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  required
                />
              </div>

              <div>
                <Label htmlFor="company">Company *</Label>
                <Select value={formData.company} onValueChange={(value) => handleInputChange('company', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {companies.length === 0 && !loading && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    No companies found. Please add a company first.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="f_type">Job Type *</Label>
                  <Select value={formData.f_type} onValueChange={(value) => handleInputChange('f_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reward_amount">Referral Reward ($)</Label>
                  <Input
                    id="reward_amount"
                    type="number"
                    value={formData.reward_amount}
                    onChange={(e) => handleInputChange('reward_amount', e.target.value)}
                    placeholder="5000"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="closing_date">Closing Date</Label>
                  <Input
                    id="closing_date"
                    type="date"
                    value={formData.closing_date}
                    onChange={(e) => handleInputChange('closing_date', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="List the required skills, experience, and qualifications..."
                  rows={4}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Separate requirements with commas for better display
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/jobs')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving || loading}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Post Job
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}