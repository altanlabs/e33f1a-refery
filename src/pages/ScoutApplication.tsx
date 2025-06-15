import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/ui/FileUpload';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Users, DollarSign, TrendingUp, Share2, Twitter, Linkedin, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScoutApplicationData {
  full_name: string;
  email: string;
  linkedin_url: string;
  role: 'Founder' | 'Operator' | 'Investor' | 'Other';
  cv_upload?: string;
  referral_example: string;
  trust_agreement: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

const ScoutApplication: React.FC = () => {
  const [formData, setFormData] = useState<ScoutApplicationData>({
    full_name: '',
    email: '',
    linkedin_url: '',
    role: 'Founder',
    referral_example: '',
    trust_agreement: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Extract UTM parameters from URL
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setFormData(prev => ({
      ...prev,
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
    }));
  }, []);

  const handleInputChange = (field: keyof ScoutApplicationData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (file: File) => {
    setCvFile(file);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    // Convert file to base64
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:mime;base64, prefix
      };
      reader.readAsDataURL(file);
    });

    const response = await fetch('https://database.altan.ai/storage/v1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'tenant_da5b0993_a4a7_497e_bdec_1237e9439761',
      },
      body: JSON.stringify({
        file_content: base64,
        mime_type: file.type,
        file_name: fileName,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.media_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      let cvUrl = '';
      if (cvFile) {
        cvUrl = await uploadFile(cvFile);
      }

      const applicationData = {
        full_name: formData.full_name,
        email: formData.email,
        linkedin_url: formData.linkedin_url,
        role: formData.role,
        cv_upload: cvUrl || null,
        referral_example: formData.referral_example,
        trust_agreement: formData.trust_agreement,
        status: 'pending',
        utm_source: formData.utm_source || null,
        utm_medium: formData.utm_medium || null,
        utm_campaign: formData.utm_campaign || null,
      };

      const { error } = await supabase
        .from('scout_applications')
        .insert([applicationData]);

      if (error) {
        throw error;
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Application Submitted!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for applying to become a Refery Scout. We'll review your application and get back to you within 48 hours.
            </p>
          </div>

          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">Share the Opportunity</CardTitle>
              <CardDescription className="text-gray-600">
                Know other founders, operators, or investors who'd be great Scouts? Share this opportunity!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={shareOnTwitter}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
                >
                  <Twitter className="w-4 h-4" />
                  Share on Twitter
                </Button>
                <Button
                  onClick={shareOnLinkedIn}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
                >
                  <Linkedin className="w-4 h-4" />
                  Share on LinkedIn
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-gray-50 hover:border-gray-200"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Join Our Network
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Become a Refery Scout
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Join our trusted network of founders, operators, and investors.{' '}
            <span className="text-emerald-600 font-semibold">Refer talent. Get paid.</span>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-4 mx-auto">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$1,000+</div>
              <div className="text-gray-600">Average Reward</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 mx-auto">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-gray-600">Active Scouts</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Scout Application</CardTitle>
            <CardDescription className="text-gray-600">
              Tell us about yourself and join our exclusive network of talent scouts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
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
                  className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
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
                  className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="your@email.com"
                />
              </div>

              {/* LinkedIn */}
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
                  className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              {/* Role */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Your Role *</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => handleInputChange('role', value as any)}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {['Founder', 'Operator', 'Investor', 'Other'].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <RadioGroupItem value={role} id={role} />
                      <Label htmlFor={role} className="text-sm font-medium cursor-pointer">
                        {role}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* CV Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Upload CV or Proof of Track Record (Optional)
                </Label>
                <FileUpload
                  onFileSelect={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                  maxSize={5 * 1024 * 1024} // 5MB
                  className="border-gray-200 hover:border-emerald-300"
                />
                <p className="text-xs text-gray-500">
                  PDF, DOC, or DOCX files up to 5MB
                </p>
              </div>

              {/* Referral Example */}
              <div className="space-y-2">
                <Label htmlFor="referral_example" className="text-sm font-medium text-gray-700">
                  Who's one person you'd refer right now, and why? *
                </Label>
                <Textarea
                  id="referral_example"
                  value={formData.referral_example}
                  onChange={(e) => handleInputChange('referral_example', e.target.value)}
                  required
                  rows={4}
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                  placeholder="Tell us about someone in your network who would be a great hire, and what makes them special..."
                />
              </div>

              {/* Trust Agreement */}
              <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !formData.trust_agreement}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting Application...' : 'Apply Now'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sticky CTA for mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 md:hidden">
          <Button
            onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScoutApplication;