import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight,
  Loader2,
  AlertCircle,
  Save,
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  Eye,
  CheckCircle,
  Sparkles,
  MessageCircle,
  Mic,
  MicOff,
  Send,
  Building,
  Users,
  Star,
  Zap
} from 'lucide-react';
import { useAuth } from 'altan-auth';
import { dbHelpers } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

const STEPS = [
  { id: 1, title: 'Job Details', icon: Briefcase },
  { id: 2, title: 'Role & Requirements', icon: FileText },
  { id: 3, title: 'Reward & Location', icon: DollarSign },
  { id: 4, title: 'Preview & Publish', icon: Eye }
];

export default function NewJob() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [showAI, setShowAI] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [jobPosted, setJobPosted] = useState(false);
  
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

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.company;
      case 2:
        return formData.description;
      case 3:
        return formData.location && formData.f_type;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setError('');
    } else {
      setError('Please fill in all required fields for this step');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async () => {
    if (!session?.user) {
      setError('You must be logged in to create a job');
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
      
      setJobPosted(true);
      setTimeout(() => {
        toast.success('Job posted successfully!');
        navigate('/jobs', {
          state: { message: 'Job posted successfully!' }
        });
      }, 2000);
    } catch (err: any) {
      console.error('Error creating job:', err);
      setError(err.message || 'Failed to create job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAIAssist = () => {
    // Simulate AI assistance
    if (currentStep === 1 && !formData.title) {
      setFormData(prev => ({ ...prev, title: 'Senior Frontend Developer' }));
    } else if (currentStep === 2 && !formData.description) {
      setFormData(prev => ({ 
        ...prev, 
        description: 'We are looking for a talented Senior Frontend Developer to join our growing team. You will be responsible for building user-facing features, optimizing performance, and collaborating with our design and backend teams to deliver exceptional user experiences.'
      }));
    } else if (currentStep === 3 && !formData.reward_amount) {
      setFormData(prev => ({ ...prev, reward_amount: '8000' }));
    }
    toast.success('AI suggestions applied!');
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.success('Voice recording started...');
    } else {
      toast.success('Voice recording stopped');
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

  if (jobPosted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Job Posted Successfully! 🎉</h2>
          <p className="text-xl text-gray-600">Your job is now live and visible to our premium referrer network.</p>
        </div>
      </div>
    );
  }

  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Button variant="ghost" onClick={() => navigate('/jobs')} className="mb-6 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
          
          <div className="mb-6">
            <Badge variant="outline" className="px-4 py-2 bg-white/50 backdrop-blur-sm border-purple-200">
              <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
              Premium Job Posting
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Post a Role,
            </span>
            <br />
            <span className="text-gray-900">Unlock Premium Referrals</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect with <span className="font-semibold text-purple-600">trusted operators</span>, founders, and scouts who refer only 
            <span className="font-semibold text-cyan-600"> top-tier talent</span>.
          </p>
          
          <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
            Experience faster hiring, lower churn, and premium-quality candidates — all through trust-based referrals.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                        : isActive 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                        isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of 4</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>
        </div>

        <div className="flex gap-8 max-w-6xl mx-auto">
          {/* Main Form */}
          <div className="flex-1">
            <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {STEPS[currentStep - 1].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                      <span className="text-red-700 font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {/* Step 1: Job Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-lg font-semibold text-gray-900 mb-3 block">
                        Job Title *
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g. Senior Frontend Developer"
                        className="h-12 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="company" className="text-lg font-semibold text-gray-900 mb-3 block">
                        Company *
                      </Label>
                      <Select value={formData.company} onValueChange={(value) => handleInputChange('company', value)}>
                        <SelectTrigger className="h-12 text-lg border-gray-200 focus:border-purple-500">
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
                        <p className="text-sm text-gray-500 mt-2">
                          No companies found. Please add a company first.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Role & Requirements */}
                {currentStep === 2 && (
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
                        className="text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
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
                        className="text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Separate requirements with commas for better display
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Reward & Location */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="location" className="text-lg font-semibold text-gray-900 mb-3 block">
                          Location *
                        </Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="e.g. San Francisco, CA"
                          className="h-12 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="f_type" className="text-lg font-semibold text-gray-900 mb-3 block">
                          Job Type *
                        </Label>
                        <Select value={formData.f_type} onValueChange={(value) => handleInputChange('f_type', value)}>
                          <SelectTrigger className="h-12 text-lg border-gray-200 focus:border-purple-500">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="reward_amount" className="text-lg font-semibold text-gray-900 mb-3 block">
                          Referral Reward ($)
                        </Label>
                        <Input
                          id="reward_amount"
                          type="number"
                          value={formData.reward_amount}
                          onChange={(e) => handleInputChange('reward_amount', e.target.value)}
                          placeholder="8000"
                          className="h-12 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          min="0"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Higher rewards attract premium referrers
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="closing_date" className="text-lg font-semibold text-gray-900 mb-3 block">
                          Closing Date
                        </Label>
                        <Input
                          id="closing_date"
                          type="date"
                          value={formData.closing_date}
                          onChange={(e) => handleInputChange('closing_date', e.target.value)}
                          className="h-12 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Preview */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-50 to-indigo-50 p-6 rounded-xl border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Job Preview</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-2xl font-bold text-gray-900">{formData.title}</h4>
                          <p className="text-lg text-gray-600">{companies.find(c => c.id === formData.company)?.name}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                          <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {formData.location}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800 px-3 py-1">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {formData.f_type}
                          </Badge>
                          {formData.reward_amount && (
                            <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                              <DollarSign className="w-4 h-4 mr-1" />
                              ${parseInt(formData.reward_amount).toLocaleString()} Reward
                            </Badge>
                          )}
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
                          <p className="text-gray-700">{formData.description}</p>
                        </div>
                        
                        {formData.requirements && (
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2">Requirements</h5>
                            <p className="text-gray-700">{formData.requirements}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6 py-3 text-lg"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Previous
                  </Button>
                  
                  {currentStep < 4 ? (
                    <Button
                      onClick={nextStep}
                      className="px-6 py-3 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="px-8 py-3 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
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
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Panel */}
          <div className="w-80">
            <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl sticky top-8">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    AI Assistant
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleListening}
                    className={`${isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Need help?</strong> Ask our AI to draft your job post for you.
                  </p>
                  <Button
                    onClick={handleAIAssist}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Get AI Suggestions
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Ask me anything..."
                      value={aiMessage}
                      onChange={(e) => setAiMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>💡 "Help me write a job description for a senior developer"</p>
                    <p>💰 "What's a good referral reward for this role?"</p>
                    <p>📍 "Should this be remote or on-site?"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trusted Companies */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-6">Trusted by 2,500+ companies</p>
          <div className="flex justify-center items-center space-x-8 opacity-40">
            {['Google', 'Meta', 'Apple', 'Netflix', 'Uber'].map((company) => (
              <div key={company} className="text-2xl font-bold text-gray-400">
                {company}
              </div>
            ))}
          </div>
        </div>
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