import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters, JobFiltersState } from '@/components/jobs/JobFilters';
import { useAuth } from '../contexts/AuthContext';
import { dbHelpers } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Briefcase, 
  Users, 
  Sparkles, 
  TrendingUp,
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

  if (!session?.user) {
    return (
      <div className="min-h-screen overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="mx-auto max-w-7xl py-32 px-4 text-center">
          <Alert className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl max-w-md mx-auto">
            <Sparkles className="h-4 w-4" />
            <AlertDescription className="text-lg">
              Please log in to view premium job opportunities.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const userRole = (session.user.user_metadata?.role || 'referrer') as 'referrer' | 'candidate';

  if (loading) {
    return (
      <div className="min-h-screen overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="mx-auto max-w-7xl py-32 px-4 flex items-center justify-center">
          <div className="flex items-center space-x-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl px-8 py-6 shadow-xl">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">Loading premium opportunities...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6 px-6 py-2 text-sm font-medium bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-purple-200 dark:border-purple-800">
              <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
              {userRole === 'referrer' ? 'Premium Referral Opportunities' : 'Exclusive Job Opportunities'}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                {userRole === 'referrer' ? 'Elite Job Board' : 'Dream Opportunities'}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              {userRole === 'referrer' 
                ? 'Discover premium opportunities to refer top talent and earn industry-leading rewards up to $15,000.'
                : 'Get referred to exclusive positions through verified networks of founders, operators, and industry leaders.'
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg">
                <Briefcase className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-gray-900 dark:text-white">{jobs.length} Active Jobs</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg">
                <Users className="h-5 w-5 text-cyan-600" />
                <span className="font-semibold text-gray-900 dark:text-white">{companies.length} Elite Companies</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Up to $15K Rewards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-8 px-4">
        <div className="mx-auto max-w-7xl space-y-8">
          {error && (
            <Alert variant="destructive" className="bg-red-50/80 dark:bg-red-950/80 backdrop-blur-xl border-red-200 dark:border-red-800 shadow-xl">
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadData}
                  className="ml-4 bg-white/50 hover:bg-white/80"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Filters Section */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-0">
            <div className="flex items-center mb-6">
              <Filter className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Find Your Perfect {userRole === 'referrer' ? 'Referral' : 'Opportunity'}
              </h2>
            </div>
            <JobFilters
              filters={filters}
              onFiltersChange={setFilters}
              userRole={userRole}
              companies={companies.map(c => ({ id: c.id, name: c.name }))}
            />
          </div>

          {/* Results Header */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Search className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    Showing {filteredAndSortedJobs.length} of {jobs.length} opportunities
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {userRole === 'referrer' ? 'Premium referral positions' : 'Exclusive job openings'}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={loadData} 
                size="sm"
                className="bg-white/50 hover:bg-white/80 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Jobs Grid */}
          {filteredAndSortedJobs.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedJobs.map((job) => (
                <div key={job.id} className="transform hover:scale-105 transition-all duration-500 hover:-translate-y-2">
                  <JobCard
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border-0 max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  No opportunities found
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  {jobs.length === 0 
                    ? 'No jobs are currently available. Check back soon for new opportunities!' 
                    : 'Try adjusting your filters to discover more premium opportunities.'
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
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}