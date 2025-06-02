import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Filter,
  MapPin, 
  DollarSign, 
  Building, 
  Clock,
  Users,
  Eye,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Briefcase,
  TrendingUp,
  Star,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useAuth } from 'altan-auth';
import { dbHelpers } from '@/lib/supabase';
import { format, formatDistanceToNow } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

const statusConfig = {
  'Open': { 
    label: 'Active', 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800', 
    icon: TrendingUp,
    dot: 'bg-emerald-500'
  },
  'Closed': { 
    label: 'Closed', 
    color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800', 
    icon: AlertCircle,
    dot: 'bg-red-500'
  },
  'On Hold': { 
    label: 'Paused', 
    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800', 
    icon: Clock,
    dot: 'bg-amber-500'
  }
};

export default function JobsManagement() {
  const { session } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  
  const [filters, setFilters] = useState({
    search: '',
    location: 'all',
    type: 'all',
    company: 'all',
    status: 'all',
    sortBy: 'newest'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsData, companiesData] = await Promise.all([
        dbHelpers.getJobs(),
        dbHelpers.getCompanies()
      ]);
      
      setJobs(jobsData || []);
      setCompanies(companiesData || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load jobs. Please try again.');
      toast.error('Failed to load jobs. Please try again.');
    }
  };

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (
          !job.title?.toLowerCase().includes(searchTerm) &&
          !job.description?.toLowerCase().includes(searchTerm) &&
          !job.company?.name?.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }

      // Location filter
      if (filters.location && filters.location !== 'all' && !job.location?.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Type filter
      if (filters.type && filters.type !== 'all' && job.f_type !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status && filters.status !== 'all' && job.status !== filters.status) {
        return false;
      }

      // Company filter
      if (filters.company && filters.company !== 'all' && job.company?.id !== filters.company) {
        return false;
      }

      return true;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'reward-high':
          return (b.reward_amount || 0) - (a.reward_amount || 0);
        case 'reward-low':
          return (a.reward_amount || 0) - (b.reward_amount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [jobs, filters]);

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await dbHelpers.deleteJob(jobId);
        
        // Remove job from UI state
        setJobs(jobs.filter(job => job.id !== jobId));
        
        toast.success('Job deleted successfully!');
      } catch (err) {
        console.error('Error deleting job:', err);
        toast.error('Failed to delete job. Please try again.');
      }
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Open'];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} font-medium px-3 py-1 text-xs`}>
        <div className={`w-2 h-2 rounded-full ${config.dot} mr-2`} />
        {config.label}
      </Badge>
    );
  };

  const getJobStats = () => {
    const total = jobs.length;
    const active = jobs.filter(j => j.status === 'Open').length;
    const closed = jobs.filter(j => j.status === 'Closed').length;
    const paused = jobs.filter(j => j.status === 'On Hold').length;
    
    return { total, active, closed, paused };
  };

  const stats = getJobStats();

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto py-16 px-4 max-w-2xl">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Authentication Required
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Please log in to view and manage jobs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto py-16 px-4 max-w-2xl">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Jobs
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we fetch your job listings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const userRole = (session.user.user_metadata?.role || 'referrer') as 'poster' | 'referrer' | 'candidate';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
                {userRole === 'poster' ? 'Job Management' : 'Job Board'}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                {userRole === 'poster' 
                  ? 'Create, manage, and track your job postings with powerful analytics'
                  : userRole === 'referrer'
                  ? 'Discover amazing opportunities to refer talented candidates and earn substantial rewards'
                  : 'Find your next career opportunity through trusted referrals and connections'
                }
              </p>
            </div>
            {userRole === 'poster' && (
              <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white border-0 shadow-lg">
                <Link to="/jobs/new">
                  <Plus className="h-5 w-5 mr-2" />
                  Post New Job
                </Link>
              </Button>
            )}
          </div>

          {/* Stats Cards */}
          {userRole === 'poster' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-xl transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total Jobs</p>
                      <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 hover:shadow-xl transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">Active</p>
                      <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{stats.active}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 hover:shadow-xl transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">Paused</p>
                      <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{stats.paused}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 hover:shadow-xl transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Closed</p>
                      <p className="text-3xl font-bold text-red-900 dark:text-red-100">{stats.closed}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-sm font-medium text-red-700 dark:text-red-400">{error}</span>
              </div>
              <Button variant="outline" size="sm" onClick={loadData} className="border-red-200 text-red-700 hover:bg-red-50">
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Filters */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters & Search</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search jobs, companies, skills..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-11 h-11 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>
              
              <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value === 'all' ? '' : value }))}>
                <SelectTrigger className="h-11 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="san francisco">San Francisco</SelectItem>
                  <SelectItem value="new york">New York</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value === 'all' ? '' : value }))}>
                <SelectTrigger className="h-11 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === 'all' ? '' : value }))}>
                <SelectTrigger className="h-11 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Active</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="On Hold">Paused</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                <SelectTrigger className="h-11 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="reward-high">Highest Reward</SelectItem>
                  <SelectItem value="reward-low">Lowest Reward</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {filteredAndSortedJobs.length} {filteredAndSortedJobs.length === 1 ? 'Job' : 'Jobs'}
            </p>
            {filteredAndSortedJobs.length !== jobs.length && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                Filtered from {jobs.length} total
              </Badge>
            )}
          </div>
          <Button variant="outline" onClick={loadData} size="sm" className="border-gray-200 hover:bg-gray-50">
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Enhanced Jobs Grid */}
        {filteredAndSortedJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredAndSortedJobs.map((job) => (
              <Card key={job.id} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 hover:scale-[1.02] overflow-hidden">
                <CardHeader className="pb-4 relative">
                  <div className="absolute top-4 right-4">
                    <StatusBadge status={job.status || 'Open'} />
                  </div>
                  
                  <div className="flex items-start space-x-4 pr-20">
                    <div className="relative">
                      <Avatar className="h-14 w-14 border-2 border-white shadow-lg">
                        <AvatarImage src={job.company?.logo} alt={job.company?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-600 text-white font-semibold text-lg">
                          {job.company?.name?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      {job.company?.website && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <ExternalLink className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">{job.company?.name}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                  
                  {/* Key Info Grid */}
                  <div className="grid grid-cols-2 gap-3 py-3 px-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        ${job.reward_amount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDistanceToNow(new Date(job.created_at), { addSuffix: true }}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{job.f_type}</span>
                    </div>
                  </div>

                  {/* Skills/Requirements */}
                  {job.requirements && (
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.split(',').slice(0, 3).map((req: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                          {req.trim()}
                        </Badge>
                      ))}
                      {job.requirements.split(',').length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                          +{job.requirements.split(',').length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex gap-2">
                      {userRole === 'poster' ? (
                        <>
                          <Button variant="outline" size="sm" asChild className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                            <Link to={`/jobs/${job.id}/edit`}>
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteJob(job.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </>
                      ) : userRole === 'referrer' ? (
                        <Button size="sm" asChild className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white border-0">
                          <Link to={`/refer/${job.id}`}>
                            <Users className="h-3 w-3 mr-1" />
                            Refer Someone
                          </Link>
                        </Button>
                      ) : (
                        <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                          <Link to={`/apply/${job.id}`}>
                            Apply Now
                          </Link>
                        </Button>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50">
                      <Link to={`/jobs/${job.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
            <CardContent className="p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No jobs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
                {jobs.length === 0 
                  ? userRole === 'poster' 
                    ? 'Ready to get started? Create your first job posting and start finding amazing candidates.'
                    : 'No jobs are currently available. Check back soon for new opportunities!' 
                  : 'No jobs match your current filters. Try adjusting your search criteria to see more results.'
                }
              </p>
              {userRole === 'poster' && jobs.length === 0 && (
                <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white border-0 shadow-lg">
                  <Link to="/jobs/new">
                    <Plus className="h-5 w-5 mr-2" />
                    Post Your First Job
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
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