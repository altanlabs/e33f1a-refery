import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  Users,
  Mail,
  Linkedin,
  FileText,
  DollarSign,
  Calendar,
  User,
  MessageSquare,
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { format, formatDistanceToNow } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusConfig = {
  'Pending': { 
    label: 'Pending Review', 
    color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800', 
    icon: Clock,
    dot: 'bg-blue-500'
  },
  'Reviewing': { 
    label: 'Under Review', 
    color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800', 
    icon: FileText,
    dot: 'bg-purple-500'
  },
  'Interviewing': { 
    label: 'Interviewing', 
    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800', 
    icon: TrendingUp,
    dot: 'bg-amber-500'
  },
  'Hired': { 
    label: 'Hired', 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800', 
    icon: CheckCircle,
    dot: 'bg-emerald-500'
  },
  'Rejected': { 
    label: 'Rejected', 
    color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800', 
    icon: XCircle,
    dot: 'bg-red-500'
  }
};

const rewardStatusConfig = {
  'Pending': {
    label: 'Reward Pending',
    color: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
  },
  'In Escrow': {
    label: 'In Escrow',
    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
  },
  'Released': {
    label: 'Paid',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
  }
};

export default function JobCandidates() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (jobId) {
      loadJobAndReferrals();
    }
  }, [jobId]);

  const loadJobAndReferrals = async () => {
    try {
      setLoading(true);
      
      // Get job details
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies(*)
        `)
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;

      // Check if user is the job creator
      if (jobData.created_by !== session?.user?.id) {
        setError('You can only view candidates for jobs you created');
        setLoading(false);
        return;
      }

      setJob(jobData);

      // Get all referrals for this job
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('job', jobId)
        .order('created_at', { ascending: false });

      if (referralsError) throw referralsError;

      setReferrals(referralsData || []);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (referralId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('referrals')
        .update({ status: newStatus })
        .eq('id', referralId);

      if (error) throw error;

      // Update local state
      setReferrals(referrals.map(ref => 
        ref.id === referralId ? { ...ref, status: newStatus } : ref
      ));

      toast.success('Candidate status updated successfully!');
    } catch (err: any) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    }
  };

  const handleRewardStatusChange = async (referralId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('referrals')
        .update({ reward_status: newStatus })
        .eq('id', referralId);

      if (error) throw error;

      // Update local state
      setReferrals(referrals.map(ref => 
        ref.id === referralId ? { ...ref, reward_status: newStatus } : ref
      ));

      toast.success('Reward status updated successfully!');
    } catch (err: any) {
      console.error('Error updating reward status:', err);
      toast.error('Failed to update reward status');
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending'];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} font-medium px-3 py-1 text-xs`}>
        <div className={`w-2 h-2 rounded-full ${config.dot} mr-2`} />
        {config.label}
      </Badge>
    );
  };

  const RewardBadge = ({ status }: { status: string }) => {
    const config = rewardStatusConfig[status as keyof typeof rewardStatusConfig] || rewardStatusConfig['Pending'];
    
    return (
      <Badge className={`${config.color} font-medium px-3 py-1 text-xs`}>
        {config.label}
      </Badge>
    );
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="mx-auto max-w-2xl py-16 px-4">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Authentication Required
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Please log in to view job candidates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="mx-auto max-w-7xl py-16 px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading candidates...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="mx-auto max-w-2xl py-16 px-4">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {error}
              </h3>
              <Button onClick={() => navigate('/jobs')}>
                Back to My Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const stats = {
    total: referrals.length,
    pending: referrals.filter(r => r.status === 'Pending').length,
    reviewing: referrals.filter(r => r.status === 'Reviewing').length,
    interviewing: referrals.filter(r => r.status === 'Interviewing').length,
    hired: referrals.filter(r => r.status === 'Hired').length,
    rejected: referrals.filter(r => r.status === 'Rejected').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="mx-auto max-w-7xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/jobs')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Jobs
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
                Referred Candidates
              </h1>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{job?.title}</span>
                  <span>•</span>
                  <span>{job?.company?.name}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link to={`/jobs/${jobId}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Job Details
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Total</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-gray-500 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Reviewing</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.reviewing}</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-500 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">Interviewing</p>
                    <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.interviewing}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-amber-500 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">Hired</p>
                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{stats.hired}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-emerald-500 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Rejected</p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.rejected}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500 opacity-60" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Candidates List */}
        {referrals.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
            <CardContent className="p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No candidates yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
                Once people start referring candidates for this job, they'll appear here.
              </p>
              <Button asChild>
                <Link to={`/jobs/${jobId}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share Job Posting
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <Card key={referral.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    {/* Candidate Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-600 text-white font-semibold text-xl">
                            {referral.candidate_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                              {referral.candidate_name}
                            </h3>
                            <StatusBadge status={referral.status || 'Pending'} />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Mail className="h-4 w-4 mr-2 text-blue-500" />
                              <a href={`mailto:${referral.candidate_email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                {referral.candidate_email}
                              </a>
                            </div>
                            
                            {referral.candidate_linkedin && (
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                                <a href={referral.candidate_linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">
                                  LinkedIn Profile
                                </a>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <Calendar className="h-4 w-4 mr-2" />
                            Referred {formatDistanceToNow(new Date(referral.created_at), { addSuffix: true })}
                          </div>

                          {referral.recommendation && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <div className="flex items-start gap-2">
                                <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div>
                                  <p className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">Referrer's Recommendation</p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{referral.recommendation}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-80 space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                            Candidate Status
                          </Label>
                          <Select 
                            value={referral.status || 'Pending'} 
                            onValueChange={(value) => handleStatusChange(referral.id, value)}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending Review</SelectItem>
                              <SelectItem value="Reviewing">Under Review</SelectItem>
                              <SelectItem value="Interviewing">Interviewing</SelectItem>
                              <SelectItem value="Hired">Hired</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                            Reward Status
                          </Label>
                          <Select 
                            value={referral.reward_status || 'Pending'} 
                            onValueChange={(value) => handleRewardStatusChange(referral.id, value)}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="In Escrow">In Escrow</SelectItem>
                              <SelectItem value="Released">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {referral.cv && (
                        <Button variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download CV
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
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

const Label = ({ children, className, ...props }: any) => (
  <label className={className} {...props}>
    {children}
  </label>
);
