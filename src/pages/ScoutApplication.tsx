import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';
import { 
  CheckCircle, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Share2, 
  Twitter, 
  Linkedin, 
  Copy,
  Star,
  Award,
  Eye,
  Zap,
  Plus,
  X,
  ArrowRight,
  ArrowLeft,
  Shield,
  Target,
  Sparkles,
  Info,
  Crown,
  Rocket,
  Lightning,
  Globe,
  ChevronRight,
  CheckCircle2,
  UserCheck,
  Briefcase,
  Building2,
  TrendingUp as TrendingUpIcon,
  Flame,
  Diamond
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReferralProfile {
  id: string;
  linkedin_url: string;
  relationship: string;
  suggested_role: string;
  why_great: string;
}

interface ScoutApplicationData {
  full_name: string;
  email: string;
  linkedin_url: string;
  role: 'Founder' | 'Operator' | 'Investor' | 'Other';
  referral_profiles: ReferralProfile[];
  trust_agreement: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

const ScoutApplication: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ScoutApplicationData>({
    full_name: '',
    email: '',
    linkedin_url: '',
    role: 'Founder',
    referral_profiles: [],
    trust_agreement: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const { toast } = useToast();

  // Extract UTM parameters from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setFormData(prev => ({
      ...prev,
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
    }));
  }, []);

  const handleInputChange = (field: keyof ScoutApplicationData, value: string | boolean | ReferralProfile[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addReferralProfile = () => {
    if (formData.referral_profiles.length < 5) {
      const newProfile: ReferralProfile = {
        id: Date.now().toString(),
        linkedin_url: '',
        relationship: '',
        suggested_role: '',
        why_great: ''
      };
      handleInputChange('referral_profiles', [...formData.referral_profiles, newProfile]);
    }
  };

  const updateReferralProfile = (id: string, field: keyof ReferralProfile, value: string) => {
    const updatedProfiles = formData.referral_profiles.map(profile =>
      profile.id === id ? { ...profile, [field]: value } : profile
    );
    handleInputChange('referral_profiles', updatedProfiles);
  };

  const removeReferralProfile = (id: string) => {
    const updatedProfiles = formData.referral_profiles.filter(profile => profile.id !== id);
    handleInputChange('referral_profiles', updatedProfiles);
  };

  const handleSubmit = async () => {
    if (!formData.trust_agreement) {
      toast({
        title: "Agreement Required",
        description: "Please agree to only refer people you genuinely trust.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create scout application
      const applicationData = {
        full_name: formData.full_name,
        email: formData.email,
        linkedin_url: formData.linkedin_url,
        role: formData.role,
        trust_agreement: formData.trust_agreement,
        status: 'pending',
        utm_source: formData.utm_source || null,
        utm_medium: formData.utm_medium || null,
        utm_campaign: formData.utm_campaign || null,
      };

      const { data: applicationResult, error: applicationError } = await supabase
        .from('scout_applications')
        .insert([applicationData])
        .select()
        .single();

      if (applicationError) {
        throw applicationError;
      }

      const createdApplicationId = applicationResult.id;
      setApplicationId(createdApplicationId);

      // Step 2: Create individual referral profiles
      if (formData.referral_profiles.length > 0) {
        const referralProfilesData = formData.referral_profiles.map(profile => ({
          linkedin_url: profile.linkedin_url,
          relationship: profile.relationship,
          suggested_role: profile.suggested_role,
          why_great: profile.why_great,
          application_id: createdApplicationId,
        }));

        const { error: referralError } = await supabase
          .from('scout_referral_profiles')
          .insert(referralProfilesData);

        if (referralError) {
          throw referralError;
        }
      }

      setIsSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "Thank you for applying to become a Refery Scout. We'll review your application and get back to you soon.",
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      if (!formData.full_name || !formData.email || !formData.linkedin_url) {
        toast({
          title: "Required Fields",
          description: "Please fill in all required fields before continuing.",
          variant: "destructive",
        });
        return;
      }

      // Create the scout application record when moving to step 2
      try {
        const applicationData = {
          full_name: formData.full_name,
          email: formData.email,
          linkedin_url: formData.linkedin_url,
          role: formData.role,
          trust_agreement: false, // Will be updated in final submission
          status: 'pending',
          utm_source: formData.utm_source || null,
          utm_medium: formData.utm_medium || null,
          utm_campaign: formData.utm_campaign || null,
        };

        const { data: applicationResult, error: applicationError } = await supabase
          .from('scout_applications')
          .insert([applicationData])
          .select()
          .single();

        if (applicationError) {
          throw applicationError;
        }

        setApplicationId(applicationResult.id);
      } catch (error) {
        console.error('Error creating application:', error);
        toast({
          title: "Error",
          description: "There was an error saving your information. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const scrollToForm = () => {
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const shareUrl = `${window.location.origin}/apply`;
  const shareText = "Join Refery's trusted network of Scouts! Refer great talent and get paid. Apply now:";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied!",
      description: "Share link copied to clipboard.",
    });
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mb-8 shadow-2xl shadow-emerald-500/25">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Crown className="w-4 h-4" />
              Elite Scout Application Received
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent mb-6 leading-tight">
              Welcome to the<br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Refery Elite Network
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your application is under review by our elite team. If accepted, you'll unlock access to refer trusted talent and earn up to <span className="text-emerald-400 font-semibold">$15,000 per hire</span>.
            </p>
          </div>

          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Share2 className="w-6 h-6 text-emerald-400" />
                Spread the Elite Opportunity
              </CardTitle>
              <CardDescription className="text-gray-300">
                Invite another elite operator or founder to join the network
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={shareOnTwitter}
                  variant="outline"
                  className="flex items-center gap-3 bg-blue-500/10 border-blue-500/20 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/40 rounded-xl h-12 backdrop-blur-sm transition-all duration-300"
                >
                  <Twitter className="w-5 h-5" />
                  Share on Twitter
                </Button>
                <Button
                  onClick={shareOnLinkedIn}
                  variant="outline"
                  className="flex items-center gap-3 bg-blue-600/10 border-blue-600/20 text-blue-300 hover:bg-blue-600/20 hover:border-blue-500/40 rounded-xl h-12 backdrop-blur-sm transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                  Share on LinkedIn
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex items-center gap-3 bg-gray-500/10 border-gray-500/20 text-gray-300 hover:bg-gray-500/20 hover:border-gray-400/40 rounded-xl h-12 backdrop-blur-sm transition-all duration-300"
                >
                  <Copy className="w-5 h-5" />
                  Copy Elite Link
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <p className="text-gray-400">
              Elite Support:{' '}
              <a href="mailto:scouts@refery.io" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                scouts@refery.io
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-['Inter',sans-serif] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 text-emerald-300 px-6 py-3 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
              <Crown className="w-4 h-4" />
              Elite 1% Network — Premium Rewards & Recognition
              <Sparkles className="w-4 h-4" />
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                Become an
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Elite Scout
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join the most exclusive talent network. Refer elite professionals. 
              <br />
              <span className="text-emerald-400 font-semibold">Earn up to $15,000 per hire.</span> 
              <span className="text-blue-400 font-semibold"> Get featured by top startups.</span>
            </p>

            <Button 
              onClick={scrollToForm}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-105"
            >
              <Rocket className="w-6 h-6 mr-3" />
              Join Elite Network
              <ChevronRight className="w-6 h-6 ml-3" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 group">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2 text-center">$15,000</div>
              <div className="text-emerald-300 text-center font-medium">Maximum Elite Reward</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 group">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2 text-center">500+</div>
              <div className="text-blue-300 text-center font-medium">Elite Scouts Active</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 group">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUpIcon className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2 text-center">95%</div>
              <div className="text-purple-300 text-center font-medium">Elite Success Rate</div>
            </div>
          </div>
        </section>

        {/* Elite Advantages */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                The Elite
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Scout Advantage
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join an exclusive network where quality matters and elite performance drives exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-xl border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Premium Visibility</h3>
                <p className="text-gray-300 leading-relaxed">
                  Your elite profile gets featured placement and priority visibility when top companies seek talent referrers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Lightning className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Fast-Track Process</h3>
                <p className="text-gray-300 leading-relaxed">
                  Your elite referrals bypass standard queues with dedicated support and accelerated hiring processes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Diamond className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Elite Tier Rewards</h3>
                <p className="text-gray-300 leading-relaxed">
                  Higher success rates unlock premium reward tiers and exclusive access to high-value opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Application Form */}
        <section id="application-form" className="mx-auto max-w-5xl px-4 py-16">
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 border-b border-white/10 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl text-white flex items-center gap-3">
                    <Crown className="w-8 h-8 text-emerald-400" />
                    Elite Scout Application
                  </CardTitle>
                  <CardDescription className="text-gray-300 mt-3 text-lg">
                    Step {currentStep} of 2 - {currentStep === 1 ? 'Elite Profile' : 'Your Elite Network'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-300">Elite Access</span>
                </div>
              </div>
              <div className="mt-6">
                <Progress 
                  value={(currentStep / 2) * 100} 
                  className="h-3 bg-white/10 rounded-full overflow-hidden"
                />
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-3">Tell us about yourself</h3>
                    <p className="text-gray-300">We're building an elite network of the most trusted talent connectors</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="full_name" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        Full Name *
                      </Label>
                      <Input
                        id="full_name"
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        required
                        className="h-14 bg-white/5 border-white/20 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="h-14 bg-white/5 border-white/20 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="linkedin_url" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-blue-400" />
                      LinkedIn Profile *
                    </Label>
                    <Input
                      id="linkedin_url"
                      type="url"
                      value={formData.linkedin_url}
                      onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                      required
                      className="h-14 bg-white/5 border-white/20 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-purple-400" />
                      Your Role *
                    </Label>
                    <RadioGroup
                      value={formData.role}
                      onValueChange={(value) => handleInputChange('role', value as any)}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                      {[
                        { value: 'Founder', icon: Rocket, color: 'emerald' },
                        { value: 'Operator', icon: Building2, color: 'blue' },
                        { value: 'Investor', icon: TrendingUpIcon, color: 'purple' },
                        { value: 'Other', icon: Star, color: 'gray' }
                      ].map((role) => (
                        <div key={role.value} className="relative">
                          <RadioGroupItem value={role.value} id={role.value} className="sr-only" />
                          <Label 
                            htmlFor={role.value} 
                            className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                              formData.role === role.value 
                                ? `border-${role.color}-400 bg-${role.color}-500/20 shadow-lg shadow-${role.color}-500/25` 
                                : 'border-white/20 bg-white/5 hover:border-white/40'
                            } backdrop-blur-sm`}
                          >
                            <role.icon className={`w-6 h-6 mb-2 ${
                              formData.role === role.value ? `text-${role.color}-400` : 'text-gray-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              formData.role === role.value ? 'text-white' : 'text-gray-300'
                            }`}>
                              {role.value}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-3 flex items-center justify-center gap-2">
                      <Users className="w-7 h-7 text-emerald-400" />
                      Your Elite Network
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Share up to 5 elite professionals you'd recommend for exceptional opportunities
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                        <Info className="w-4 h-4" />
                        Quality over quantity - detailed profiles increase acceptance chances
                      </div>
                      <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                        <Shield className="w-4 h-4" />
                        Confidential - we only contact them if you're accepted
                      </div>
                    </div>
                  </div>

                  {formData.referral_profiles.map((profile, index) => (
                    <Card key={profile.id} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl backdrop-blur-sm overflow-hidden">
                      <CardHeader className="pb-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-b border-white/10">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-white flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full flex items-center justify-center text-sm font-bold text-white">
                              {index + 1}
                            </div>
                            Elite Referral {index + 1} of 5
                          </CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeReferralProfile(profile.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                              <Linkedin className="w-4 h-4 text-blue-400" />
                              LinkedIn Profile
                            </Label>
                            <Input
                              value={profile.linkedin_url}
                              onChange={(e) => updateReferralProfile(profile.id, 'linkedin_url', e.target.value)}
                              placeholder="https://linkedin.com/in/theirprofile"
                              className="h-12 bg-white/5 border-white/20 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-emerald-400" />
                              Your Relationship
                            </Label>
                            <Input
                              value={profile.relationship}
                              onChange={(e) => updateReferralProfile(profile.id, 'relationship', e.target.value)}
                              placeholder="Former colleague, mentee, friend..."
                              className="h-12 bg-white/5 border-white/20 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-purple-400" />
                            Ideal Role for Them
                          </Label>
                          <Input
                            value={profile.suggested_role}
                            onChange={(e) => updateReferralProfile(profile.id, 'suggested_role', e.target.value)}
                            placeholder="Senior Software Engineer, Product Manager, Designer..."
                            className="h-12 bg-white/5 border-white/20 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            Why They're Elite
                          </Label>
                          <Textarea
                            value={profile.why_great}
                            onChange={(e) => updateReferralProfile(profile.id, 'why_great', e.target.value)}
                            placeholder="What makes them exceptional? Their achievements, skills, leadership qualities, unique expertise..."
                            rows={4}
                            className="bg-white/5 border-white/20 focus:border-yellow-400 focus:ring-yellow-400/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-sm resize-none"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {formData.referral_profiles.length < 5 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addReferralProfile}
                      className="w-full h-16 border-2 border-dashed border-white/30 hover:border-emerald-400/50 text-gray-300 hover:text-emerald-300 rounded-2xl bg-white/5 hover:bg-emerald-500/10 backdrop-blur-sm transition-all duration-300"
                    >
                      <Plus className="w-5 h-5 mr-3" />
                      Add Elite Referral ({formData.referral_profiles.length}/5)
                    </Button>
                  )}

                  <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
                    <input
                      type="checkbox"
                      id="trust_agreement"
                      checked={formData.trust_agreement}
                      onChange={(e) => handleInputChange('trust_agreement', e.target.checked)}
                      required
                      className="mt-1 h-5 w-5 text-emerald-500 focus:ring-emerald-400 border-emerald-400 rounded bg-white/10"
                    />
                    <Label htmlFor="trust_agreement" className="text-sm text-gray-200 cursor-pointer leading-relaxed">
                      <span className="font-semibold text-emerald-300">Elite Trust Agreement:</span> I commit to only referring individuals I genuinely trust and believe would be exceptional hires for elite opportunities. *
                    </Label>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-8 border-t border-white/10">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 h-14 bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30 rounded-xl backdrop-blur-sm transition-all duration-300"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Previous
                  </Button>
                )}
                
                {currentStep < 2 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 h-14 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                  >
                    Continue to Network
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.trust_agreement}
                    className="flex-1 h-14 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 mr-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting Elite Application...
                      </>
                    ) : (
                      <>
                        <Crown className="w-5 h-5 mr-3" />
                        Submit Elite Application
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Floating Apply Button for mobile */}
      <div className="fixed bottom-6 left-6 right-6 md:hidden z-50">
        <Button
          onClick={scrollToForm}
          className="w-full h-14 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold rounded-2xl shadow-2xl shadow-emerald-500/25 backdrop-blur-sm border border-white/20"
        >
          <Rocket className="w-5 h-5 mr-2" />
          Join Elite Network
        </Button>
      </div>
    </div>
  );
};

export default ScoutApplication;