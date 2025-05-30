import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUpload } from '@/components/ui/FileUpload';
import { useAppStore } from '@/store';
import { referralApi, jobApi } from '@/lib/api';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

const referralSchema = z.object({
  candidateName: z.string().min(2, 'Name must be at least 2 characters'),
  candidateEmail: z.string().email('Please enter a valid email address'),
  candidateLinkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  recommendation: z.string().min(50, 'Recommendation must be at least 50 characters'),
});

type ReferralFormData = z.infer<typeof referralSchema>;

export default function ReferralForm() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { auth } = useAppStore();
  const [step, setStep] = useState(1);
  const [job, setJob] = useState<any>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
  });

  // Load job data
  React.useEffect(() => {
    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  const loadJob = async () => {
    try {
      if (!jobId) return;
      const jobData = await jobApi.getById(jobId);
      setJob(jobData);
    } catch (err) {
      console.error('Error loading job:', err);
      setError('Failed to load job details');
    }
  };

  const onSubmit = async (data: ReferralFormData) => {
    if (!jobId || !auth.user) return;

    setLoading(true);
    setError('');

    try {
      // Create referral
      await referralApi.create({
        candidate_name: data.candidateName,
        candidate_email: data.candidateEmail,
        candidate_linkedin: data.candidateLinkedin || undefined,
        job: jobId,
        recommendation: data.recommendation,
        status: 'Pending',
        reward_status: 'Pending',
      });

      // Navigate to success page or referrals list
      navigate('/my-referrals', {
        state: { message: 'Referral submitted successfully!' }
      });
    } catch (err: any) {
      console.error('Error creating referral:', err);
      setError(err.message || 'Failed to submit referral. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (!auth.user) {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertDescription>
            Please log in to make a referral.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading job details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/jobs')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
        <h1 className="text-3xl font-bold">Make a Referral</h1>
        <p className="text-muted-foreground">
          Refer a candidate for {job.title} at {job.company_data?.name}
        </p>
      </div>

      {/* Job Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {job.title}
            <span className="text-lg font-normal text-green-600">
              ${job.reward_amount?.toLocaleString()} reward
            </span>
          </CardTitle>
          <CardDescription>
            {job.company_data?.name} • {job.location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            1
          </div>
          <div className={`h-1 w-16 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            2
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Candidate Information</CardTitle>
              <CardDescription>
                Tell us about the candidate you'd like to refer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="candidateName">Full Name *</Label>
                <Input
                  id="candidateName"
                  placeholder="Jane Smith"
                  {...register('candidateName')}
                />
                {errors.candidateName && (
                  <p className="text-sm text-destructive">{errors.candidateName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="candidateEmail">Email Address *</Label>
                <Input
                  id="candidateEmail"
                  type="email"
                  placeholder="jane@example.com"
                  {...register('candidateEmail')}
                />
                {errors.candidateEmail && (
                  <p className="text-sm text-destructive">{errors.candidateEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="candidateLinkedin">LinkedIn Profile</Label>
                <Input
                  id="candidateLinkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/janesmith"
                  {...register('candidateLinkedin')}
                />
                {errors.candidateLinkedin && (
                  <p className="text-sm text-destructive">{errors.candidateLinkedin.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>CV/Resume</Label>
                <FileUpload
                  onFileSelect={setCv}
                  accept=".pdf,.doc,.docx"
                  maxSize={5}
                  placeholder="Upload candidate's CV (optional)"
                />
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={nextStep}>
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Your Recommendation</CardTitle>
              <CardDescription>
                Why do you think this candidate would be a great fit?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recommendation">Recommendation *</Label>
                <Textarea
                  id="recommendation"
                  placeholder="Tell us why this candidate would be perfect for this role. Include their relevant experience, skills, and what makes them stand out..."
                  rows={6}
                  {...register('recommendation')}
                />
                <p className="text-xs text-muted-foreground">
                  {watch('recommendation')?.length || 0} characters (minimum 50)
                </p>
                {errors.recommendation && (
                  <p className="text-sm text-destructive">{errors.recommendation.message}</p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Referral
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>

      {/* Info Card */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <h3 className="font-medium mb-2">What happens next?</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• We'll review your referral and contact the candidate</li>
            <li>• The hiring team will evaluate the candidate</li>
            <li>• You'll be notified of any status updates</li>
            <li>• If hired, you'll receive your ${job.reward_amount?.toLocaleString()} reward!</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}