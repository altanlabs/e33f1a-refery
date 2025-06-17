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
  Info
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
      <div className="min-h-screen bg-white">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              You're one step away from joining the Refery Scout Network.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're reviewing your application. If accepted, you'll unlock access to refer trusted talent and earn up to $15,000 per hire.
            </p>
          </div>

          <Card className="backdrop-blur-sm bg-white/90 border border-gray-200 shadow-xl rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">Share the Opportunity</CardTitle>
              <CardDescription className="text-gray-600">
                Invite another operator or founder to apply
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={shareOnTwitter}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 rounded-xl"
                >
                  <Twitter className="w-4 h-4" />
                  Share on Twitter
                </Button>
                <Button
                  onClick={shareOnLinkedIn}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 rounded-xl"
                >
                  <Linkedin className="w-4 h-4" />
                  Share on LinkedIn
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-gray-50 hover:border-gray-200 rounded-xl"
                >
                  <Copy className="w-4 h-4" />
                  Copy referral link
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <p className="text-gray-500">
              Questions? Email us at{' '}
              <a href="mailto:scouts@refery.io" className="text-emerald-600 hover:text-emerald-700 font-medium">
                scouts@refery.io
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Top 1% become Vetted Scouts — get featured and earn faster.
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Become a Vetted<br />
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Refery Scout
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Refer trusted talent. Earn rewards up to $15,000. Be seen by top startups.
            </p>

            <Button 
              onClick={scrollToForm}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Apply Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-6 mx-auto">
                <DollarSign className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 text-center">$15,000</div>
              <div className="text-gray-600 text-center">Maximum reward per hire</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 mx-auto">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 text-center">500+</div>
              <div className="text-gray-600 text-center">Active scouts in network</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6 mx-auto">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 text-center">95%</div>
              <div className="text-gray-600 text-center">Hire success rate</div>
            </div>
          </div>
        </section>

        {/* Why Become a Scout - Trust Panel */}
        <section className="mx-auto max-w-7xl px-4 py-16 bg-gradient-to-r from-gray-50 to-emerald-50/30">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Vetted Scout Advantage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join an exclusive network where quality matters and trust drives results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-6">
                  <Eye className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Highlighted to Hiring Managers</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your profile gets premium placement and visibility when companies are looking for talent referrers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Top Referrals Get Priority</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your referrals are fast-tracked through the hiring process with dedicated support and attention.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Better Conversion = Better Payouts</h3>
                <p className="text-gray-600 leading-relaxed">
                  Higher success rates unlock premium reward tiers and exclusive high-value opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Application Form */}
        <section id="application-form" className="mx-auto max-w-4xl px-4 py-16">
          <Card className="bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-gray-900">Scout Application</CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    Step {currentStep} of 2 - {currentStep === 1 ? 'About You' : 'Who Would You Refer?'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-600">Premium Application</span>
                </div>
              </div>
              <Progress value={(currentStep / 2) * 100} className="mt-4" />
            </CardHeader>

            <CardContent className="p-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        id="full_name"
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        required
                        className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url" className="text-sm font-medium text-gray-700">
                      LinkedIn URL *
                    </Label>
                    <Input
                      id="linkedin_url"
                      type="url"
                      value={formData.linkedin_url}
                      onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                      required
                      className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Your Role *</Label>
                    <RadioGroup
                      value={formData.role}
                      onValueChange={(value) => handleInputChange('role', value as any)}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                      {['Founder', 'Operator', 'Investor', 'Other'].map((role) => (
                        <div key={role} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-xl hover:border-emerald-300 transition-colors">
                          <RadioGroupItem value={role} id={role} />
                          <Label htmlFor={role} className="text-sm font-medium cursor-pointer">
                            {role}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Who Would You Refer?</h3>
                    <p className="text-gray-600 mb-4">
                      Add up to 5 profiles of people you'd recommend for great opportunities
                    </p>
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      <Info className="w-3 h-3" />
                      You can add up to 5 people. The more detailed, the better your chances of getting accepted.
                    </div>
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium mt-2">
                      <Shield className="w-3 h-3" />
                      You don't need to tell them yet — we only contact them if you're accepted.
                    </div>
                  </div>

                  {formData.referral_profiles.map((profile, index) => (
                    <Card key={profile.id} className="border border-gray-200 rounded-xl">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Referral {index + 1} of 5</CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeReferralProfile(profile.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">LinkedIn URL</Label>
                          <Input
                            value={profile.linkedin_url}
                            onChange={(e) => updateReferralProfile(profile.id, 'linkedin_url', e.target.value)}
                            placeholder="https://linkedin.com/in/theirprofile"
                            className="h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">How do you know them?</Label>
                          <Input
                            value={profile.relationship}
                            onChange={(e) => updateReferralProfile(profile.id, 'relationship', e.target.value)}
                            placeholder="Former colleague, friend, mentee..."
                            className="h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">What role do you think they'd thrive in?</Label>
                          <Input
                            value={profile.suggested_role}
                            onChange={(e) => updateReferralProfile(profile.id, 'suggested_role', e.target.value)}
                            placeholder="Software Engineer, Product Manager, Designer..."
                            className="h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Why are they a great hire?</Label>
                          <Textarea
                            value={profile.why_great}
                            onChange={(e) => updateReferralProfile(profile.id, 'why_great', e.target.value)}
                            placeholder="What makes them special? Their skills, achievements, work ethic..."
                            rows={3}
                            className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg resize-none"
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
                      className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-emerald-400 text-gray-600 hover:text-emerald-600 rounded-xl"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Referral ({formData.referral_profiles.length}/5)
                    </Button>
                  )}

                  <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <input
                      type="checkbox"
                      id="trust_agreement"
                      checked={formData.trust_agreement}
                      onChange={(e) => handleInputChange('trust_agreement', e.target.checked)}
                      required
                      className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 rounded"
                    />
                    <Label htmlFor="trust_agreement" className="text-sm text-gray-700 cursor-pointer">
                      I agree to only refer people I genuinely trust and believe would be excellent hires. *
                    </Label>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-8 border-t border-gray-200">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 h-12 rounded-xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
                
                {currentStep < 2 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.trust_agreement}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Sticky Apply Button for mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 md:hidden z-50">
        <Button
          onClick={scrollToForm}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl"
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default ScoutApplication;