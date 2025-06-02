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
  Briefcase
} from 'lucide-react';
import { useAppStore } from '@/store';
import { dbHelpers } from '@/lib/supabase';
import { format } from 'date-fns';

const statusConfig = {
  'Open': { label: 'Active', color: 'bg-green-100 text-green-800', icon: Clock },
  'Closed': { label: 'Closed', color: 'bg-red-100 text-red-800', icon: AlertCircle },
  'On Hold': { label: 'Paused', color: 'bg-yellow-100 text-yellow-800', icon: Clock }
};

export default function JobsManagement() {
  const { auth } = useAppStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      setError('');
      
      const [jobsData, companiesData] = await Promise.all([
        dbHelpers.getJobs(),
        dbHelpers.getCompanies()
      ]);
      
      setJobs(jobsData || []);
      setCompanies(companiesData || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
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
        // TODO: Implement job deletion
        console.log('Delete job:', jobId);
        await loadData(); // Refresh the list
      } catch (err) {
        console.error('Error deleting job:', err);
      }
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Open'];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (!auth.user) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please log in to view jobs.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading jobs...</span>
        </div>
      </div>
    );
  }

  const userRole = auth.user.role as 'poster' | 'referrer' | 'candidate';

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {userRole === 'poster' ? 'Manage Jobs' : 'Job Board'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {userRole === 'poster' 
              ? 'Create and manage your job postings'
              : userRole === 'referrer'
              ? 'Find great opportunities to refer talented candidates and earn rewards'
              : 'Discover your next career opportunity through trusted referrals'
            }
          </p>
        </div>
        {userRole === 'poster' && (
          <Button asChild>
            <Link to="/jobs/new">
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Link>
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={loadData}>
            Retry
          </Button>
        </div>
      </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs, companies..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value === 'all' ? '' : value }))}>
              <SelectTrigger>
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
              <SelectTrigger>
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
              <SelectTrigger>
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
              <SelectTrigger>
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

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredAndSortedJobs.length} of {jobs.length} jobs
        </p>
        <Button variant="outline" onClick={loadData} size="sm">
          Refresh
        </Button>
      </div>

      {/* Jobs Grid */}
      {filteredAndSortedJobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={job.company?.logo} alt={job.company?.name} />
                      <AvatarFallback>
                        {job.company?.name?.charAt(0) || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg leading-none truncate">{job.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {job.company?.name}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={job.status || 'Open'} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {job.description}
                </p>
                
                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="h-3 w-3 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-3 w-3 mr-1" />
                    ${job.reward_amount?.toLocaleString()} reward
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(job.created_at), 'MMM d')}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    {job.f_type}
                  </Badge>
                  {job.requirements && job.requirements.split(',').slice(0, 2).map((req: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {req.trim()}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2">
                    {userRole === 'poster' ? (
                      <>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/jobs/${job.id}/edit`}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </>
                    ) : userRole === 'referrer' ? (
                      <Button size="sm" asChild>
                        <Link to={`/refer/${job.id}`}>
                          Refer Someone
                        </Link>
                      </Button>
                    ) : (
                      <Button size="sm" asChild>
                        <Link to={`/apply/${job.id}`}>
                          Apply Now
                        </Link>
                      </Button>
                    )}
                  </div>
                  
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/jobs/${job.id}`}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {jobs.length === 0 
                ? userRole === 'poster' 
                  ? 'Get started by posting your first job.'
                  : 'No jobs are currently available.' 
                : 'Try adjusting your filters to see more results.'
              }
            </p>
            {userRole === 'poster' && jobs.length === 0 && (
              <Button asChild>
                <Link to="/jobs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Job
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}