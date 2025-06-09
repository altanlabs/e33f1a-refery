import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters, JobFiltersState } from '@/components/jobs/JobFilters';
import { useAuth } from 'altan-auth';
import { dbHelpers } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';

export default function JobBoard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filters, setFilters] = useState<JobFiltersState>({
    search: '',
    location: '',
    type: 'all',
    rewardMin: '',
    rewardMax: '',
    company: 'all',
    status: 'all',
    sortBy: 'newest',
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
      
      const filteredJobs = jobsData.filter(job => job.status === 'Open');
      
      setJobs(filteredJobs);
      setCompanies(companiesData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
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

      if (filters.location) {
        if (!job.location?.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      if (filters.type && filters.type !== 'all' && job.f_type !== filters.type) {
        return false;
      }

      if (filters.rewardMin && job.reward_amount < parseInt(filters.rewardMin)) {
        return false;
      }
      if (filters.rewardMax && job.reward_amount > parseInt(filters.rewardMax)) {
        return false;
      }

      if (filters.company && filters.company !== 'all' && job.company?.id !== filters.company) {
        return false;
      }

      return true;
    });

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

  const handleJobAction = (action: string, jobId: string) => {
    if (action === 'refer') {
      navigate(`/refer/${jobId}`);
    }
  };

  const updateFilter = (key: keyof JobFiltersState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
            Please log in to view job opportunities.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const userRole = (session.user.user_metadata?.role || 'referrer') as 'referrer' | 'candidate';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
          <span className="text-lg text-gray-600">Loading jobs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Board</h1>
          <p className="text-gray-600">
            Discover amazing opportunities to refer talented candidates and earn substantial rewards
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <span className="font-medium text-gray-900">Filters & Search</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs, companies, skills..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Location */}
            <Select value={filters.location || 'all'} onValueChange={(value) => updateFilter('location', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="san francisco">San Francisco</SelectItem>
                <SelectItem value="new york">New York</SelectItem>
                <SelectItem value="london">London</SelectItem>
                <SelectItem value="barcelona">Barcelona</SelectItem>
              </SelectContent>
            </Select>

            {/* Job Type */}
            <Select value={filters.type || 'all'} onValueChange={(value) => updateFilter('type', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>

            {/* Status */}
            <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Newest First" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="reward-high">Highest Reward</SelectItem>
                <SelectItem value="reward-low">Lowest Reward</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={loadData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">
              {filteredAndSortedJobs.length} Jobs
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Jobs Grid */}
        {filteredAndSortedJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={{
                  id: job.id,
                  title: job.title,
                  description: job.description || '',
                  location: job.location || '',
                  type: job.f_type || 'Full-time',
                  rewardAmount: job.reward_amount || 0,
                  status: job.status === 'Open' ? 'active' : 'closed',
                  requirements: job.requirements ? job.requirements.split('\n').filter(Boolean) : [],
                  benefits: [],
                  createdAt: job.created_at,
                  closingDate: job.closing_date,
                  companyId: job.company?.id,
                  company: job.company ? {
                    id: job.company.id,
                    name: job.company.name,
                    logo: job.company.logo,
                    website: job.company.website,
                    description: job.company.description,
                    createdAt: job.company.created_at
                  } : undefined
                }}
                userRole={userRole}
                onAction={handleJobAction}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-4">
                {jobs.length === 0 
                  ? 'No jobs are currently available.' 
                  : 'Try adjusting your filters to see more results.'
                }
              </p>
              {jobs.length > 0 && (
                <Button 
                  onClick={() => setFilters({
                    search: '',
                    location: '',
                    type: 'all',
                    rewardMin: '',
                    rewardMax: '',
                    company: 'all',
                    status: 'all',
                    sortBy: 'newest',
                  })}
                  variant="outline"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}