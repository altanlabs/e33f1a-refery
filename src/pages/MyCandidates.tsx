import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Filter,
  Eye,
  MessageSquare,
  Send,
  ExternalLink,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  Plus,
  Copy,
  Share2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { dbHelpers } from '@/lib/supabase';
import { format } from 'date-fns';

const statusConfig = {
  'Not Submitted': { label: 'Not Submitted', color: 'bg-gray-100 text-gray-800', icon: Clock },
  'Submitted': { label: 'Submitted', color: 'bg-blue-100 text-blue-800', icon: Send },
  'Interviewing': { label: 'Interviewing', color: 'bg-yellow-100 text-yellow-800', icon: Users },
  'Hired': { label: 'Hired', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'Rejected': { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle }
};

export default function MyCandidates() {
  const { session } = useAuth();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [referrerProfile, setReferrerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [recommendation, setRecommendation] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      loadData();
    }
  }, [session?.user?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // First get the referrer profile to get the profile ID
      const profileData = await dbHelpers.getReferrerProfile(session?.user?.id!);
      setReferrerProfile(profileData);
      
      // Load candidates using the referrer profile ID, and jobs
      const [candidatesData, jobsData] = await Promise.all([
        profileData ? dbHelpers.getCandidatesByReferrer(profileData.id) : [],
        dbHelpers.getJobs()
      ]);

      setCandidates(candidatesData || []);
      setJobs(jobsData?.filter(job => job.status === 'Open') || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = 
        candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.role_interest?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = candidates.length;
    const notSubmitted = candidates.filter(c => c.status === 'Not Submitted').length;
    const submitted = candidates.filter(c => c.status === 'Submitted').length;
    const interviewing = candidates.filter(c => c.status === 'Interviewing').length;
    const hired = candidates.filter(c => c.status === 'Hired').length;
    
    return { total, notSubmitted, submitted, interviewing, hired };
  }, [candidates]);

  const handleSubmitToJob = async () => {
    if (!selectedCandidate || !selectedJob || !recommendation.trim()) return;

    setSubmitting(true);
    try {
      // Create referral
      await dbHelpers.createReferral({
        candidate_name: selectedCandidate.name,
        candidate_email: selectedCandidate.email,
        candidate_linkedin: selectedCandidate.linkedin,
        job: selectedJob,
        recommendation: recommendation,
        status: 'Pending',
        reward_status: 'Pending',
      });

      // Update candidate status
      await dbHelpers.updateCandidate(selectedCandidate.id, {
        status: 'Submitted',
        recommendation: recommendation
      });

      // Refresh data
      await loadData();
      
      // Reset form
      setSelectedCandidate(null);
      setRecommendation('');
      setSelectedJob('');
    } catch (error) {
      console.error('Error submitting candidate:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const copyReferralLink = async () => {
    if (!referrerProfile?.username) return;
    
    const link = `${window.location.origin}/r/${referrerProfile.username}`;
    await navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Not Submitted'];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading candidates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Candidates
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage candidates who submitted through your referral link
            </p>
          </div>
          
          {referrerProfile?.username && (
            <div className="flex items-center gap-3">
              <Button
                onClick={copyReferralLink}
                variant="outline"
                className="bg-white/50 hover:bg-white/80 backdrop-blur-sm"
              >
                {linkCopied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy My Link
                  </>
                )}
              </Button>
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
                <Link to="/profile">
                  <Share2 className="h-4 w-4 mr-2" />
                  Manage Link
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Not Submitted</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.notSubmitted}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Submitted</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.submitted}</p>
              </div>
              <Send className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Interviewing</p>
                <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.interviewing}</p>
              </div>
              <Users className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Hired</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.hired}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or role interest..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Not Submitted">Not Submitted</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Interviewing">Interviewing</SelectItem>
                <SelectItem value="Hired">Hired</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Candidates List */}
      <div className="space-y-4">
        {filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No candidates found' : 'No candidates yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Share your referral link to start receiving candidate submissions.'}
              </p>
              {(!searchTerm && statusFilter === 'all') && referrerProfile?.username && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-3">
                    Your referral link:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white dark:bg-gray-800 px-3 py-2 rounded text-sm">
                      refery.io/r/{referrerProfile.username}
                    </code>
                    <Button size="sm" onClick={copyReferralLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Section - Candidate Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 border-2 border-gray-200 dark:border-gray-700">
                        <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                          {candidate.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {candidate.name}
                          </h3>
                          {candidate.linkedin && (
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                              <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{candidate.email}</span>
                          </div>
                          {candidate.whatsapp && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{candidate.whatsapp}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {candidate.role_interest}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Status & Actions */}
                  <div className="flex flex-col lg:items-end gap-3">
                    <StatusBadge status={candidate.status || 'Not Submitted'} />
                    
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Submitted {format(new Date(candidate.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {/* View Details Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Candidate Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Name</Label>
                                <p className="text-gray-900">{candidate.name}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Email</Label>
                                <p className="text-gray-900">{candidate.email}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Role Interest</Label>
                                <p className="text-gray-900">{candidate.role_interest}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Status</Label>
                                <StatusBadge status={candidate.status || 'Not Submitted'} />
                              </div>
                            </div>
                            
                            {candidate.linkedin && (
                              <div>
                                <Label className="text-sm font-medium text-gray-700">LinkedIn</Label>
                                <a 
                                  href={candidate.linkedin} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  {candidate.linkedin}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}

                            {candidate.recommendation && (
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Your Recommendation</Label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{candidate.recommendation}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Submit to Job Dialog */}
                      {candidate.status === 'Not Submitted' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600"
                              onClick={() => setSelectedCandidate(candidate)}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Submit to Job
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Submit {candidate.name} to a Job</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Select Job</Label>
                                <Select value={selectedJob} onValueChange={setSelectedJob}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose a job to submit to" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {jobs.map((job) => (
                                      <SelectItem key={job.id} value={job.id}>
                                        {job.title} at {job.company?.name} - ${job.reward_amount?.toLocaleString()}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-sm font-medium text-gray-700">Your Recommendation</Label>
                                <Textarea
                                  placeholder="Why do you think this candidate would be a great fit for this role?"
                                  value={recommendation}
                                  onChange={(e) => setRecommendation(e.target.value)}
                                  rows={4}
                                />
                              </div>

                              <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setSelectedCandidate(null)}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleSubmitToJob}
                                  disabled={!selectedJob || !recommendation.trim() || submitting}
                                  className="bg-emerald-500 hover:bg-emerald-600"
                                >
                                  {submitting ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Submitting...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-4 w-4 mr-2" />
                                      Submit Referral
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}