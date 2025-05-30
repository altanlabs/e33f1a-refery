import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters, JobFiltersState } from '@/components/jobs/JobFilters';
import { useAppStore } from '@/store';
import { jobApi, companyApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Loader2 } from 'lucide-react';

export default function JobsManagement() {
  const { auth } = useAppStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filters, setFilters] = useState<JobFiltersState>({
    search: '',
    location: '',
    type: '',
    rewardMin: '',
    rewardMax: '',
    company: '',
    status: '',
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
        jobApi.getAll(),
        companyApi.getAll()
      ]);
      
      setJobs(jobsData);
      setCompanies(companiesData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedJobs = React.useMemo(() => {
    let filtered = jobs.filter(job => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (
          !job.title?.toLowerCase().includes(searchTerm) &&
          !job.description?.toLowerCase().includes(searchTerm) &&
          !job.company_data?.name?.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }

      // Location filter
      if (filters.location) {
        if (!job.location?.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Type filter
      if (filters.type && job.f_type !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status) {
        const statusMap: { [key: string]: string } = {
          'active': 'Open',
          'closed': 'Closed',
          'paused': 'On Hold'
        };
        if (job.status !== statusMap[filters.status]) {
          return false;
        }
      }

      // Company filter
      if (filters.company && job.company !== filters.company) {
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

  if (!auth.user) {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertDescription>
            Please log in to view jobs.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading jobs...</span>
        </div>
      </div>
    );
  }

  const userRole = auth.user.role as 'poster' | 'referrer' | 'candidate';

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {userRole === 'poster' ? 'Manage Jobs' : 'Job Board'}
          </h1>
          <p className="text-muted-foreground">
            {userRole === 'poster' 
              ? 'Create and manage your job postings'
              : userRole === 'referrer'
              ? 'Find great opportunities to refer talented candidates and earn rewards.'
              : 'Discover your next career opportunity through trusted referrals.'
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

      {/* Filters */}
      <JobFilters
        filters={filters}
        onFiltersChange={setFilters}
        userRole={userRole}
        companies={companies.map(c => ({ id: c.id, name: c.name }))}
      />

      {/* Results */}
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
                  status: job.status === 'Open' ? 'active' : job.status === 'Closed' ? 'closed' : 'paused',
                  requirements: job.requirements ? job.requirements.split('\n').filter(Boolean) : [],
                  benefits: [],
                  createdAt: job.created_at,
                  closingDate: job.closing_date,
                  companyId: job.company,
                  company: job.company_data ? {
                    id: job.company_data.id,
                    name: job.company_data.name,
                    logo: job.company_data.logo,
                    website: job.company_data.website,
                    description: job.company_data.description,
                    createdAt: job.company_data.created_at
                  } : undefined
                }}
                userRole={userRole}
                onAction={(action, jobId) => {
                  if (action === 'refer') {
                    // Navigate to referral form
                    window.location.href = `/refer/${jobId}`;
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-medium">No jobs found</p>
            <p className="text-muted-foreground mb-4">
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
          </div>
        )}
      </div>
    </div>
  );
}