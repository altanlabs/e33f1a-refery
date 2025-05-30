import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppStore } from '@/store';
import { jobApi, companyApi } from '@/lib/api';
import { ArrowLeft, Loader2 } from 'lucide-react';

const jobSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  company: z.string().min(1, 'Please select a company'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Remote'], {
    required_error: 'Please select a job type',
  }),
  rewardAmount: z.number().min(0, 'Reward amount must be positive'),
  requirements: z.string().min(10, 'Requirements must be at least 10 characters'),
  closingDate: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function NewJob() {
  const navigate = useNavigate();
  const { auth } = useAppStore();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
  });

  const selectedType = watch('type');
  const selectedCompany = watch('company');

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companyApi.getAll();
      setCompanies(data);
    } catch (err) {
      console.error('Error loading companies:', err);
      setError('Failed to load companies. Please try again.');
    }
  };

  const onSubmit = async (data: JobFormData) => {
    if (!auth.user) return;

    setLoading(true);
    setError('');

    try {
      await jobApi.create({
        title: data.title,
        company: data.company,
        description: data.description,
        location: data.location,
        f_type: data.type,
        status: 'Open',
        reward_amount: data.rewardAmount,
        requirements: data.requirements,
        closing_date: data.closingDate || undefined,
      });

      navigate('/jobs', {
        state: { message: 'Job posted successfully!' }
      });
    } catch (err: any) {
      console.error('Error creating job:', err);
      setError(err.message || 'Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!auth.user || auth.user.role !== 'poster') {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertDescription>
            You must be logged in as a poster to create jobs.
          </AlertDescription>
        </Alert>
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
        <h1 className="text-3xl font-bold">Post a New Job</h1>
        <p className="text-muted-foreground">
          Create a job posting to find candidates through referrals
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Fill in the information about the position you're hiring for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Frontend Developer"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Select value={selectedCompany} onValueChange={(value) => setValue('company', value)}>
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
                {errors.company && (
                  <p className="text-sm text-destructive">{errors.company.message}</p>
                )}
                {companies.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No companies found. Please add a company first.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g. San Francisco, CA"
                    {...register('location')}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Job Type *</Label>
                  <Select value={selectedType} onValueChange={(value) => setValue('type', value as any)}>
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
                  {errors.type && (
                    <p className="text-sm text-destructive">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rewardAmount">Referral Reward ($) *</Label>
                  <Input
                    id="rewardAmount"
                    type="number"
                    placeholder="5000"
                    {...register('rewardAmount', { valueAsNumber: true })}
                  />
                  {errors.rewardAmount && (
                    <p className="text-sm text-destructive">{errors.rewardAmount.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="closingDate">Closing Date</Label>
                  <Input
                    id="closingDate"
                    type="date"
                    {...register('closingDate')}
                  />
                  {errors.closingDate && (
                    <p className="text-sm text-destructive">{errors.closingDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  rows={4}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements *</Label>
                <Textarea
                  id="requirements"
                  placeholder="List the required skills, experience, and qualifications. Use line breaks to separate requirements."
                  rows={4}
                  {...register('requirements')}
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Use line breaks to separate different requirements
                </p>
                {errors.requirements && (
                  <p className="text-sm text-destructive">{errors.requirements.message}</p>
                )}
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/jobs')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Job
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}