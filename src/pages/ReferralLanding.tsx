import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/ui/FileUpload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { dbHelpers } from '@/lib/supabase';
import { 
  Heart, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Users, 
  Sparkles, 
  CheckCircle,
  Loader2,
  ArrowRight,
  Building,
  Star
} from 'lucide-react';

const candidateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  role_interest: z.enum(['Engineering', 'Product', 'Growth', 'Design', 'Sales', 'Marketing', 'Operations', 'Other']),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

export default function ReferralLanding() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [referrerProfile, setReferrerProfile] = useState<any>(null);
  const [suggestedJobs, setSuggestedJobs] = useState<any[]>([]);
  const [cv, setCv] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
  });

  const roleInterest = watch('role_interest');

  useEffect(() => {
    if (username) {
      loadReferrerProfile();
    }
  }, [username]);

  useEffect(() => {
    if (roleInterest) {
      loadSuggestedJobs();
    }
  }, [roleInterest]);

  const loadReferrerProfile = async () => {
    try {
      setLoading(true);
      const profile = await dbHelpers.getReferrerProfileByUsername(username!);
      if (!profile) {
        setError('Referrer not found');
        return;
      }
      setReferrerProfile(profile);
    } catch (err) {
      console.error('Error loading referrer profile:', err);
      setError('Failed to load referrer profile');
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestedJobs = async () => {
    try {
      const jobs = await dbHelpers.getJobs();
      const openJobs = jobs?.filter(job => job.status === 'Open') || [];
      
      // Simple keyword matching based on role interest
      const roleKeywords = {
        'Engineering': ['engineer', 'developer', 'software', 'technical', 'backend', 'frontend', 'fullstack'],
        'Product': ['product', 'manager', 'pm', 'strategy', 'roadmap'],
        'Growth': ['growth', 'marketing', 'acquisition', 'retention', 'analytics'],
        'Design': ['design', 'ui', 'ux', 'visual', 'creative'],
        'Sales': ['sales', 'business development', 'account', 'revenue'],
        'Marketing': ['marketing', 'content', 'social', 'brand', 'campaign'],
        'Operations': ['operations', 'ops', 'process', 'logistics', 'supply'],
        'Other': []
      };

      if (roleInterest && roleKeywords[roleInterest]) {
        const keywords = roleKeywords[roleInterest];
        const filtered = openJobs.filter(job => {
          const searchText = `${job.title} ${job.description} ${job.requirements}`.toLowerCase();
          return keywords.some(keyword => searchText.includes(keyword));
        });
        setSuggestedJobs(filtered.slice(0, 3));
      } else {
        setSuggestedJobs(openJobs.slice(0, 3));
      }
    } catch (err) {
      console.error('Error loading suggested jobs:', err);
    }
  };

  const onSubmit = async (data: CandidateFormData) => {
    if (!referrerProfile) return;

    setSubmitting(true);
    setError('');

    try {
      // Create candidate profile
      await dbHelpers.createCandidate({
        name: data.name,
        email: data.email,
        linkedin_url: data.linkedin || undefined,
        whatsapp: data.whatsapp || undefined,
        role_interest: data.role_interest,
        referrer: referrerProfile.id, 
        status: 'Not Submitted',
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error('Error creating candidate:', err);
      setError(err.message || 'Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <span className="text-xl font-medium text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && !referrerProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Referrer Not Found</h3>
            <p className="text-gray-600 mb-6">
              The referral link you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/')} className="bg-emerald-500 hover:bg-emerald-600">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="text-center shadow-xl border-0">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Thank you! 
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Your profile has been submitted successfully. {referrerProfile?.username} will review your information and may reach out about relevant opportunities.
              </p>

              <div className="bg-emerald-50 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  Know someone else hiring? 
                </h3>
                <p className="text-emerald-700 mb-4">
                  Tell them about Refery and help them find amazing talent through referrals.
                </p>
                <Button 
                  onClick={() => window.open('https://refery.io', '_blank')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Share Refery.io
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                Explore More Opportunities
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-4 border-white/20">
              <AvatarImage src={referrerProfile?.profile_image} alt={referrerProfile?.username} />
              <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                {referrerProfile?.username?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                Hi! I'm {referrerProfile?.username} 
              </h1>
              <p className="text-emerald-100 text-lg">
                {referrerProfile?.intro_message || "I'd love to help you find your dream job!"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardTitle className="flex items-center text-2xl text-gray-900">
                  <Briefcase className="h-6 w-6 mr-3 text-emerald-500" />
                  You're just one intro away from helping a friend land a dream job 
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          placeholder="Jane Smith"
                          className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-600">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jane@example.com"
                          className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="text-sm font-medium text-gray-700">
                        LinkedIn Profile
                      </Label>
                      <Input
                        id="linkedin"
                        type="url"
                        placeholder="https://linkedin.com/in/janesmith"
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        {...register('linkedin')}
                      />
                      {errors.linkedin && (
                        <p className="text-sm text-red-600">{errors.linkedin.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">
                        WhatsApp (Optional)
                      </Label>
                      <Input
                        id="whatsapp"
                        placeholder="+1 (555) 123-4567"
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        {...register('whatsapp')}
                      />
                    </div>
                  </div>

                  {/* Role Interest */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Career Interest
                    </h3>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        What type of role are you interested in? *
                      </Label>
                      <Select onValueChange={(value) => setValue('role_interest', value as any)}>
                        <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                          <SelectValue placeholder="Select your area of interest" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Product">Product</SelectItem>
                          <SelectItem value="Growth">Growth</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.role_interest && (
                        <p className="text-sm text-red-600">{errors.role_interest.message}</p>
                      )}
                    </div>
                  </div>

                  {/* CV Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Resume/CV
                    </h3>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Upload your resume (Optional)
                      </Label>
                      <FileUpload
                        onFileSelect={setCv}
                        accept=".pdf,.doc,.docx"
                        maxSize={5}
                        placeholder="Upload your CV/Resume"
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 text-lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit My Profile
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why This Works */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-emerald-50">
                <CardTitle className="flex items-center text-lg text-gray-900">
                  <Star className="h-5 w-5 mr-2 text-emerald-500" />
                  Why referrals work
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">5x higher chance</p>
                      <p className="text-sm text-gray-600">of getting an interview</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Personal advocate</p>
                      <p className="text-sm text-gray-600">Someone vouching for you</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Hidden opportunities</p>
                      <p className="text-sm text-gray-600">Access to unlisted positions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Jobs */}
            {suggestedJobs.length > 0 && (
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-emerald-50">
                  <CardTitle className="flex items-center text-lg text-gray-900">
                    <Briefcase className="h-5 w-5 mr-2 text-emerald-500" />
                    Opportunities for you
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {suggestedJobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{job.title}</h4>
                          <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                            ${job.reward_amount?.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-gray-600 space-x-2">
                          <Building className="h-3 w-3" />
                          <span>{job.company?.name}</span>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}