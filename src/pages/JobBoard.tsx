import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters, JobFiltersState } from '@/components/jobs/JobFilters';
import { useAuth } from 'altan-auth';
import { dbHelpers } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

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
      <div className="mx-auto max-w-7xl py-6 px-4">
        <Alert>
          <AlertDescription>
            Please log in to view jobs.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const userRole = (session.user.user_metadata?.role || 'referrer') as 'referrer' | 'candidate';

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl py-6 px-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading jobs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {userRole === 'referrer' ? 'Job Board' : 'Job Opportunities'}
        </h1>
        <p className="text-muted-foreground">
          {userRole === 'referrer' 
            ? 'Find great opportunities to refer talented candidates and earn rewards.'
            : 'Discover your next career opportunity through trusted referrals.'
          }
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadData}
              className="ml-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <JobFilters
        filters={filters}
        onFiltersChange={setFilters}
        userRole={userRole}
        companies={companies.map(c => ({ id: c.id, name: c.name }))}
      />

      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedJobs.length} of {jobs.length} jobs
          </p>
          <Button variant="outline" onClick={loadData} size="sm">
            Refresh
          </Button>
        </div>

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
            <p className="text-lg font-medium">No jobs found</p>
            <p className="text-muted-foreground">
              {jobs.length === 0 
                ? 'No jobs are currently available.' 
                : 'Try adjusting your filters to see more results.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}