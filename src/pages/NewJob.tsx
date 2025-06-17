import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  Save,
  Sparkles,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  Globe
} from 'lucide-react';
import { useAuth } from 'altan-auth';
import { dbHelpers } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

export default function NewJob() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    companyWebsite: '',
    description: '',
    location: '',
    f_type: '',
    reward_amount: '',
    requirements: '',
    closing_date: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title) {
      setError('Job title is required');
      return false;
    }
    if (!formData.companyName) {
      setError('Company name is required');
      return false;
    }
    if (!formData.companyWebsite) {
      setError('Company website is required');
      return false;
    }
    if (!formData.companyWebsite.startsWith('http://') && !formData.companyWebsite.startsWith('https://')) {
      setError('Company website must be a valid URL (starting with http:// or https://)');
      return false;
    }
    if (!formData.description) {
      setError('Job description is required');
      return false;
    }
    if (!formData.location) {
      setError('Location is required');
      return false;
    }
    if (!formData.f_type) {
      setError('Job type is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!session?.user) {
      setError('You must be logged in to create a job');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // First, create or find the company
      const companyData = {
        name: formData.companyName.trim(),
        website: formData.companyWebsite.trim()
      };

      const company = await dbHelpers.createCompany(companyData);
      
      if (!company) {
        throw new Error('Failed to create company');
      }

      // Then create the job with the company reference
      const jobData = {
        title: formData.title.trim(),
        company: company.id,
        description: formData.description.trim(),
        location: formData.location.trim(),
        f_type: formData.f_type as 'Full-time' | 'Part-time' | 'Contract' | 'Remote',
        status: 'Open' as const,
        reward_amount: formData.reward_amount ? parseInt(formData.reward_amount) : 0,
        requirements: formData.requirements.trim(),
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

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="container mx-auto py-16 px-4 max-w-2xl">
          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Authentication Required
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                You must be logged in to create jobs.
              </p>
              <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <a href="/auth">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/jobs')} 
            className="mb-6 hover:bg-white/50 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
          
          <div className="text-center mb-8">
            <Badge variant="outline" className="px-4 py-2 bg-white/50 backdrop-blur-sm border-purple-200 mb-4">
              <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
              Premium Job Posting
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Post a New Job
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create a job posting to find candidates through our premium referral network
            </p>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                    <span className="text-red-700 font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title" className="text-lg font-semibold text-gray-900 mb-3 block">
                    <Briefcase className="w-5 h-5 inline mr-2 text-purple-500" />
                    Job Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    className="h-12 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="companyName" className="text-lg font-semibold text-gray-900 mb-3 block">
                    <Building className="w-5 h-5 inline mr-2 text-blue-500" />
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    className="h-12 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="companyWebsite" className="text-lg font-semibold text-gray-900 mb-3 block">
                    <Globe className="w-5 h-5 inline mr-2 text-cyan-500" />
                    Company Website *
                  </Label>
                  <Input
                    id="companyWebsite"
                    type="url"
                    value={formData.companyWebsite}
                    onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                    placeholder="https://www.company.com"
                    className="h-12 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-lg font-semibold text-gray-900 mb-3 block">
                    <MapPin className="w-5 h-5 inline mr-2 text-green-500" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="h-12 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="f_type" className="text-lg font-semibold text-gray-900 mb-3 block">
                    Job Type *
                  </Label>
                  <Select value={formData.f_type} onValueChange={(value) => handleInputChange('f_type', value)}>
                    <SelectTrigger className="h-12 text-lg border-gray-200 focus:border-purple-500 bg-white/50 backdrop-blur-sm">
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

                <div>
                  <Label htmlFor="reward_amount" className="text-lg font-semibold text-gray-900 mb-3 block">
                    <DollarSign className="w-5 h-5 inline mr-2 text-yellow-500" />
                    Referral Reward ($)
                  </Label>
                  <Input
                    id="reward_amount"
                    type="number"
                    value={formData.reward_amount}
                    onChange={(e) => handleInputChange('reward_amount', e.target.value)}
                    placeholder="5000"
                    className="h-12 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="closing_date" className="text-lg font-semibold text-gray-900 mb-3 block">
                    <Calendar className="w-5 h-5 inline mr-2 text-orange-500" />
                    Closing Date
                  </Label>
                  <Input
                    id="closing_date"
                    type="date"
                    value={formData.closing_date}
                    onChange={(e) => handleInputChange('closing_date', e.target.value)}
                    className="h-12 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Detailed Information */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="description" className="text-lg font-semibold text-gray-900 mb-3 block">
                    Job Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                    rows={6}
                    className="text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="requirements" className="text-lg font-semibold text-gray-900 mb-3 block">
                    Requirements
                  </Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="List the required skills, experience, and qualifications..."
                    rows={4}
                    className="text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Separate requirements with commas for better display
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/jobs')}
                  className="px-6 py-3 text-lg bg-white/50 backdrop-blur-sm hover:bg-white/80"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving || loading}
                  className="px-8 py-3 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Post Job
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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