import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Briefcase, 
  Building,
  MapPin,
  Search, 
  Calendar,
  Eye,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useAppStore } from '@/store';
import { Application } from '@/types';
import { format } from 'date-fns';

// Mock data for demonstration
const mockApplications: Application[] = [
  {
    id: '1',
    jobId: 'job-1',
    job: {
      id: 'job-1',
      companyId: 'comp-1',
      company: { id: 'comp-1', name: 'TechCorp', logo: '', website: 'techcorp.com', createdAt: '2024-01-01' },
      title: 'Senior Frontend Developer',
      description: 'React, TypeScript, Next.js',
      location: 'San Francisco, CA',
      type: 'full-time',
      rewardAmount: 8500,
      status: 'active',
      requirements: [],
      benefits: [],
      createdAt: '2024-01-01'
    },
    candidateId: 'cand-1',
    status: 'interviewing',
    coverLetter: 'I am excited to apply for this position...',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    jobId: 'job-2',
    job: {
      id: 'job-2',
      companyId: 'comp-2',
      company: { id: 'comp-2', name: 'StartupXYZ', logo: '', website: 'startupxyz.com', createdAt: '2024-01-01' },
      title: 'Product Manager',
      description: 'B2B SaaS, Growth',
      location: 'Remote',
      type: 'full-time',
      rewardAmount: 12000,
      status: 'active',
      requirements: [],
      benefits: [],
      createdAt: '2024-01-01'
    },
    candidateId: 'cand-1',
    status: 'viewed',
    coverLetter: 'With my background in product management...',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: '3',
    jobId: 'job-3',
    job: {
      id: 'job-3',
      companyId: 'comp-3',
      company: { id: 'comp-3', name: 'FinanceFlow', logo: '', website: 'financeflow.com', createdAt: '2024-01-01' },
      title: 'Data Scientist',
      description: 'Python, ML, Analytics',
      location: 'New York, NY',
      type: 'full-time',
      rewardAmount: 10000,
      status: 'active',
      requirements: [],
      benefits: [],
      createdAt: '2024-01-01'
    },
    candidateId: 'cand-1',
    status: 'rejected',
    coverLetter: 'I have extensive experience in data science...',
    createdAt: '2024-01-05T11:30:00Z',
    updatedAt: '2024-01-08T09:15:00Z'
  }
];

const statusConfig = {
  'not-reviewed': { label: 'Not Reviewed', color: 'bg-gray-100 text-gray-800', icon: Clock },
  'viewed': { label: 'Viewed', color: 'bg-blue-100 text-blue-800', icon: Eye },
  'interviewing': { label: 'Interviewing', color: 'bg-yellow-100 text-yellow-800', icon: Users },
  'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
  'offered': { label: 'Offered', color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
  'hired': { label: 'Hired', color: 'bg-green-100 text-green-800', icon: CheckCircle }
};

export default function MyApplications() {
  const { applications } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Use mock data for demonstration
  const allApplications = mockApplications;

  const filteredApplications = useMemo(() => {
    return allApplications.filter(application => {
      const matchesSearch = 
        application.job?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.job?.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.job?.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allApplications, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = allApplications.length;
    const interviewing = allApplications.filter(a => a.status === 'interviewing').length;
    const viewed = allApplications.filter(a => a.status === 'viewed').length;
    const pending = allApplications.filter(a => a.status === 'not-reviewed').length;
    
    return { total, interviewing, viewed, pending };
  }, [allApplications]);

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Applications
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your job applications and monitor their progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Applications</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-500" />
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
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Viewed</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.viewed}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-500" />
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
                  placeholder="Search by job title, company, or location..."
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
                <SelectItem value="not-reviewed">Not Reviewed</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="offered">Offered</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No applications found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Start applying to jobs to see them here.'}
              </p>
              <Button asChild>
                <Link to="/opportunities">
                  Browse Job Opportunities
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Section - Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {application.job?.title}
                          </h3>
                          {application.job?.company?.website && (
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                              <a href={application.job.company.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <Building className="h-4 w-4" />
                          <span className="font-medium">{application.job?.company?.name}</span>
                          <span>•</span>
                          <MapPin className="h-4 w-4" />
                          <span>{application.job?.location}</span>
                          <span>•</span>
                          <span className="capitalize">{application.job?.type}</span>
                        </div>
                        
                        {application.coverLetter && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {application.coverLetter}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Status & Date */}
                  <div className="flex flex-col lg:items-end gap-3">
                    <StatusBadge status={application.status} />
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>Applied {format(new Date(application.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                      {application.updatedAt !== application.createdAt && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Updated {format(new Date(application.updatedAt), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <Card className="mt-8 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Ready to apply to more jobs?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse our latest job opportunities and find your next career move.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/dashboard">
                  <FileText className="h-4 w-4 mr-2" />
                  View Dashboard
                </Link>
              </Button>
              <Button asChild>
                <Link to="/opportunities">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Browse Jobs
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}