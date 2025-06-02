import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Building, 
  Clock,
  Users,
  Calendar,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Share2,
  Bookmark
} from 'lucide-react';
import { dbHelpers } from '@/lib/supabase';
import { useAppStore } from '@/store';
import { format } from 'date-fns';

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAppStore();
  
  const [job, setJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);

  useEffect(() => {
    if (jobId) {
      loadJobDetails();
      loadSavedJobs();
    }
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      
      // Load job details
      const jobs = await dbHelpers.getJobs();
      const foundJob = jobs?.find(j => j.id === jobId);
      
      if (foundJob) {
        setJob(foundJob);
        
        // Load applications and referrals for this job
        const [applicationsData, referralsData] = await Promise.all([
          dbHelpers.getApplications(),
          dbHelpers.getReferrals()
        ]);
        
        setApplications(applicationsData?.filter(app => app.job === jobId) || []);
        setReferrals(referralsData?.filter(ref => ref.job === jobId) || []);
      } else {
        setError('Job not found');
      }
    } catch (err) {
      console.error('Error loading job details:', err);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const savedJobsData = await dbHelpers.getSavedJobs();
      setSavedJobs(savedJobsData || []);
    } catch (err) {
      console.error('Error loading saved jobs:', err);
    }
  };

  const handleEdit = () => {
    navigate(`/jobs/${jobId}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      // Handle job deletion
      console.log('Delete job:', jobId);
      navigate('/jobs');
    }
  };

  const handleSaveJob = async () => {
    try {
      // Toggle saved state
      setSaved(!saved);
      
      // Here you would typically save to a user's saved jobs list
      // For now, we'll just show a temporary notification
      if (!saved) {
        // Show success message
        console.log('Job saved successfully');
      } else {
        console.log('Job removed from saved');
      }
    } catch (err) {
      console.error('Error saving job:', err);
    }
  };

  const handleShareJob = async () => {
    try {
      setSharing(true);
      
      const shareData = {
        title: `${job.title} at ${job.company?.name}`,
        text: `Check out this job opportunity: ${job.title} at ${job.company?.name}. Referral reward: $${job.reward_amount?.toLocaleString()}`,
        url: window.location.href
      };

      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        alert('Job details copied to clipboard!');
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error sharing job:', err);
        // Fallback: Copy to clipboard
        try {
          const shareText = `${job.title} at ${job.company?.name}\n${window.location.href}`;
          await navigator.clipboard.writeText(shareText);
          alert('Job link copied to clipboard!');
        } catch (clipboardErr) {
          console.error('Error copying to clipboard:', clipboardErr);
        }
      }
    } finally {
      setSharing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Applied':
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Reviewing':
      case 'Viewed':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'Interviewing':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'Hired':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Reviewing':
      case 'Viewed':
        return 'bg-blue-100 text-blue-800';
      case 'Interviewing':
        return 'bg-purple-100 text-purple-800';
      case 'Hired':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading job details...</span>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {error || 'Job not found'}
            </h3>
            <Button asChild>
              <Link to="/jobs">
                Back to Jobs
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/jobs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={job.company?.logo} alt={job.company?.name} />
              <AvatarFallback className="text-lg">
                {job.company?.name?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {job.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Building className="h-4 w-4" />
                <span className="font-medium">{job.company?.name}</span>
                {job.company?.website && (
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                    <a href={job.company.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {auth.user?.role === 'poster' && (
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                    <p className="font-medium capitalize">{job.f_type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Reward</p>
                    <p className="font-medium">${job.reward_amount?.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Posted</p>
                    <p className="font-medium">
                      {format(new Date(job.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.split(',').map((req: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {req.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Closing Date */}
              {job.closing_date && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Application Deadline</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {format(new Date(job.closing_date), 'MMMM d, yyyy')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Applications</span>
                <span className="font-semibold">{applications.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Referrals</span>
                <span className="font-semibold">{referrals.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <Badge variant="outline" className="capitalize">
                  {getStatusIcon(job.status)}
                  <span className="ml-1">{job.status}</span>
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {auth.user?.role === 'candidate' && (
                <Button asChild className="w-full">
                  <Link to={`/apply/${job.id}`}>
                    Apply Now
                  </Link>
                </Button>
              )}
              
              {auth.user?.role === 'referrer' && (
                <Button asChild className="w-full">
                  <Link to={`/refer/${job.id}`}>
                    Refer Someone
                  </Link>
                </Button>
              )}
              
              <Button variant="outline" className="w-full" onClick={handleSaveJob}>
                <Bookmark className={`h-4 w-4 mr-2 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Saved' : 'Save Job'}
              </Button>
              
              <Button variant="outline" className="w-full" onClick={handleShareJob} disabled={sharing}>
                {sharing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Job
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Applications & Referrals Tabs */}
      {auth.user?.role === 'poster' && (
        <div className="mt-8">
          <Tabs defaultValue="applications" className="space-y-6">
            <TabsList>
              <TabsTrigger value="applications">
                Applications ({applications.length})
              </TabsTrigger>
              <TabsTrigger value="referrals">
                Referrals ({referrals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="space-y-4">
              {applications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No applications yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Applications will appear here once candidates start applying.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                applications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {application.candidate_name?.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{application.candidate_name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {application.candidate_email}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Applied {format(new Date(application.created_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(application.status)} border-0`}>
                            {getStatusIcon(application.status)}
                            <span className="ml-1">{application.status}</span>
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Application
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="referrals" className="space-y-4">
              {referrals.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No referrals yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Referrals will appear here once people start referring candidates.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                referrals.map((referral) => (
                  <Card key={referral.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {referral.candidate_name?.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{referral.candidate_name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {referral.candidate_email}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Referred {format(new Date(referral.created_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(referral.status)} border-0`}>
                            {getStatusIcon(referral.status)}
                            <span className="ml-1">{referral.status}</span>
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Referral
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}