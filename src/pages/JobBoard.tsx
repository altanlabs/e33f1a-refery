import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters, JobFiltersState } from '@/components/jobs/JobFilters';
import { useAppStore } from '@/store';
import { mockJobs, mockCompanies, getJobsWithCompanies } from '@/lib/mockData';
import { Job } from '@/types';

export default function JobBoard() {
  const { auth } = useAppStore();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<(Job & { company?: any })[]>([]);
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
    // Load jobs with company data
    const jobsWithCompanies = getJobsWithCompanies();
    setJobs(jobsWithCompanies);
  }, []);

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      // Only show active jobs for referrers and candidates
      if (job.status !== 'active') return false;

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (
          !job.title.toLowerCase().includes(searchTerm) &&
          !job.description.toLowerCase().includes(searchTerm) &&
          !job.company?.name.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }

      // Location filter
      if (filters.location) {
        if (!job.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Type filter
      if (filters.type && job.type !== filters.type) {
        return false;
      }

      // Reward filters
      if (filters.rewardMin && job.rewardAmount < parseInt(filters.rewardMin)) {
        return false;
      }
      if (filters.rewardMax && job.rewardAmount > parseInt(filters.rewardMax)) {
        return false;
      }

      // Company filter
      if (filters.company && job.companyId !== filters.company) {
        return false;
      }

      return true;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'reward-high':
          return b.rewardAmount - a.rewardAmount;
        case 'reward-low':
          return a.rewardAmount - b.rewardAmount;
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

  if (!auth.user) {
    return <div>Please log in to view jobs.</div>;
  }

  const userRole = auth.user.role as 'referrer' | 'candidate';

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
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

      {/* Filters */}
      <JobFilters
        filters={filters}
        onFiltersChange={setFilters}
        userRole={userRole}
        companies={mockCompanies}
      />

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedJobs.length} of {jobs.length} jobs
          </p>
        </div>

        {filteredAndSortedJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                userRole={userRole}
                onAction={handleJobAction}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-medium">No jobs found</p>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}