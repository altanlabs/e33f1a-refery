import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

export default function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    f_type: '',
    status: '',
    reward_amount: '',
    requirements: '',
    closing_date: ''
  });

  useEffect(() => {
    if (jobId) {
      loadJobAndCompanies();
    }
  }, [jobId]);

  const loadJobAndCompanies = async () => {
    try {
      setLoading(true);
      
      const [jobData, companiesData] = await Promise.all([
        dbHelpers.getJobById(jobId!),
        dbHelpers.getCompanies()
      ]);
      
      if (jobData) {
        setJob(jobData);
        setFormData({
          title: jobData.title || '',
          company: jobData.company || '',
          description: jobData.description || '',
          location: jobData.location || '',
          f_type: jobData.f_type || '',
          status: jobData.status || 'Open',
          reward_amount: jobData.reward_amount?.toString() || '',
          requirements: jobData.requirements || '',
          closing_date: jobData.closing_date ? jobData.closing_date.split('T')[0] : ''
        });
      } else {
        setError('Job not found');
      }
      
      setCompanies(companiesData || []);
    } catch (err) {
      console.error('Error loading job:', err);
      setError('Failed to load job details');
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
      setError('You must be logged in to edit a job');
      return;
    }

    if (job?.created_by && job.created_by !== session.user.id) {
      setError('You can only edit jobs that you created');
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
        status: formData.status as 'Open' | 'Closed' | 'On Hold',
        reward_amount: formData.reward_amount ? parseInt(formData.reward_amount) : 0,
        requirements: formData.requirements,
        closing_date: formData.closing_date || undefined
      };

      await dbHelpers.updateJob(jobId!, jobData);
      toast.success('Job updated successfully!');
      navigate(`/jobs/${jobId}`);
    } catch (err: any) {
      console.error('Error updating job:', err);
      setError(err.message || 'Failed to update job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You must be logged in to edit jobs.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading job details...</span>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {error}
            </h3>
            <Button onClick={() => navigate('/jobs')}>
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (job?.created_by && job.created_by !== session.user.id) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You can only edit jobs that you created.
            </p>
            <Button onClick={() => navigate(`/jobs/${jobId}`)} className="mt-4">
              View Job Details
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate(`/jobs/${jobId}`)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Job Details
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Job
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update your job posting details
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                onClick={() => navigate(`/jobs/${jobId}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Job
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