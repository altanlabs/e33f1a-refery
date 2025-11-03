import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Building, 
  Clock,
  Calendar,
  AlertCircle,
  Loader2,
  ExternalLink,
  Share2,
  Bookmark,
  Users,
  Briefcase
} from 'lucide-react';
import { dbHelpers } from '@/lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

export default function PublicJobDetails() {
  const { jobId } = useParams();
  const { session } = useAuth();
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadJobDetails();
    }
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      
      const foundJob = await dbHelpers.getJobById(jobId!);
      
      if (foundJob) {
        setJob(foundJob);
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

  const handleShareJob = async () => {
    try {
      setSharing(true);
      
      const jobUrl = `${window.location.origin}/jobs/${job.id}`;
      
      const shareData = {
        title: `${job.title} at ${job.company?.name}`,
        text: `Check out this job opportunity: ${job.title} at ${job.company?.name}. Referral reward: $${job.reward_amount?.toLocaleString()}`,
        url: jobUrl
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(jobUrl);
        alert('Job link copied to clipboard!');
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error sharing job:', err);
        try {
          const jobUrl = `${window.location.origin}/jobs/${job.id}`;
          await navigator.clipboard.writeText(jobUrl);
          alert('Job link copied to clipboard!');
        } catch (clipboardErr) {
          console.error('Error copying to clipboard:', clipboardErr);
          alert('Unable to copy link. Please copy the URL manually.');
        }
      }
    } finally {
      setSharing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="mx-auto max-w-6xl py-32 px-4 flex items-center justify-center">
          <div className="flex items-center space-x-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl px-8 py-6 shadow-xl">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">Loading job details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="mx-auto max-w-6xl py-32 px-4">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {error || 'Job not found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                The job you're looking for might have been removed or doesn't exist.
              </p>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Link to="/opportunities">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Browse All Jobs
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const userRole = session?.user?.user_metadata?.role || 'referrer';

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="mx-auto max-w-6xl py-8 px-4 relative">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-6 bg-white/50 hover:bg-white/80 backdrop-blur-sm">
            <Link to="/opportunities">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20 ring-4 ring-white/50 shadow-xl">
                <AvatarImage src={job.company?.logo} alt={job.company?.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                  {job.company?.name?.charAt(0) || 'C'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-black mb-3">
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    {job.title}
                  </span>
                </h1>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Building className="h-5 w-5" />
                  <span className="font-semibold text-lg">{job.company?.name}</span>
                  {job.company?.website && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                      <a href={job.company.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleShareJob} 
                disabled={sharing}
                className="bg-white/50 hover:bg-white/80 backdrop-blur-sm"
              >
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
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Key Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Location</p>
                      <p className="font-bold text-gray-900 dark:text-white">{job.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Type</p>
                      <p className="font-bold text-gray-900 dark:text-white capitalize">{job.f_type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Reward</p>
                      <p className="font-bold text-gray-900 dark:text-white">${job.reward_amount?.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Posted</p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {format(new Date(job.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Description</h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                      {job.description}
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                {job.requirements && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Requirements</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.split(',').map((req: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 px-3 py-1">
                          {req.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Closing Date */}
                {job.closing_date && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Application Deadline</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {format(new Date(job.closing_date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Take Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {session?.user ? (
                  <>
                    {userRole === 'candidate' && (
                      <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3">
                        <Link to={`/apply/${job.id}`}>
                          <Users className="h-5 w-5 mr-2" />
                          Apply Now
                        </Link>
                      </Button>
                    )}
                    
                    {userRole === 'referrer' && (
                      <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3">
                        <Link to={`/refer/${job.id}`}>
                          <Users className="h-5 w-5 mr-2" />
                          Refer Someone
                        </Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Sign in to apply or refer candidates
                    </p>
                    <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3">
                      <Link to="/auth">
                        Sign In
                      </Link>
                    </Button>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full bg-white/50 hover:bg-white/80 backdrop-blur-sm" 
                  onClick={handleShareJob} 
                  disabled={sharing}
                >
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

            {/* Company Info */}
            {job.company && (
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">About {job.company.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 ring-2 ring-white/50">
                      <AvatarImage src={job.company.logo} alt={job.company.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-lg">
                        {job.company.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">{job.company.name}</h4>
                      {job.company.website && (
                        <Button variant="ghost" size="sm" className="p-0 h-auto" asChild>
                          <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                            Visit Website
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {job.company.description && (
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {job.company.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}