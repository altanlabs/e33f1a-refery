import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Filter,
  Eye,
  Calendar,
  Building,
  User,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useAppStore } from '@/store';
import { Referral } from '@/types';
import { format } from 'date-fns';

// Mock data for demonstration
const mockReferrals: Referral[] = [
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
    candidate: {
      id: 'cand-1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      linkedin: 'linkedin.com/in/sarahjohnson',
      createdAt: '2024-01-01'
    },
    referrerId: 'ref-1',
    status: 'interviewing',
    introNote: 'Sarah is an exceptional developer with 5+ years of React experience.',
    rewardStatus: 'in-escrow',
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
    candidateId: 'cand-2',
    candidate: {
      id: 'cand-2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      linkedin: 'linkedin.com/in/michaelchen',
      createdAt: '2024-01-01'
    },
    referrerId: 'ref-1',
    status: 'hired',
    introNote: 'Michael has led product teams at 3 successful startups.',
    rewardStatus: 'released',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-25T16:45:00Z'
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
    candidateId: 'cand-3',
    candidate: {
      id: 'cand-3',
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      linkedin: 'linkedin.com/in/emilyrodriguez',
      createdAt: '2024-01-01'
    },
    referrerId: 'ref-1',
    status: 'viewed',
    introNote: 'Emily has a PhD in Statistics and 4 years of industry experience.',
    rewardStatus: 'pending',
    createdAt: '2024-01-20T11:30:00Z',
    updatedAt: '2024-01-22T09:15:00Z'
  },
  {
    id: '4',
    jobId: 'job-4',
    job: {
      id: 'job-4',
      companyId: 'comp-4',
      company: { id: 'comp-4', name: 'HealthTech', logo: '', website: 'healthtech.com', createdAt: '2024-01-01' },
      title: 'UX Designer',
      description: 'Figma, User Research',
      location: 'Austin, TX',
      type: 'full-time',
      rewardAmount: 6500,
      status: 'active',
      requirements: [],
      benefits: [],
      createdAt: '2024-01-01'
    },
    candidateId: 'cand-4',
    candidate: {
      id: 'cand-4',
      name: 'David Kim',
      email: 'david@example.com',
      linkedin: 'linkedin.com/in/davidkim',
      createdAt: '2024-01-01'
    },
    referrerId: 'ref-1',
    status: 'rejected',
    introNote: 'David is a creative designer with strong user research skills.',
    rewardStatus: 'pending',
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-01-18T10:30:00Z'
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

const rewardStatusConfig = {
  'pending': { label: 'Pending', color: 'bg-gray-100 text-gray-800', icon: Clock },
  'in-escrow': { label: 'In Escrow', color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
  'released': { label: 'Released', color: 'bg-green-100 text-green-800', icon: CheckCircle }
};

export default function MyReferrals() {
  const { referrals } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rewardFilter, setRewardFilter] = useState<string>('all');

  // Use mock data for demonstration
  const allReferrals = mockReferrals;

  const filteredReferrals = useMemo(() => {
    return allReferrals.filter(referral => {
      const matchesSearch = 
        referral.candidate?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.job?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.job?.company?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
      const matchesReward = rewardFilter === 'all' || referral.rewardStatus === rewardFilter;
      
      return matchesSearch && matchesStatus && matchesReward;
    });
  }, [allReferrals, searchTerm, statusFilter, rewardFilter]);

  const stats = useMemo(() => {
    const total = allReferrals.length;
    const hired = allReferrals.filter(r => r.status === 'hired').length;
    const interviewing = allReferrals.filter(r => r.status === 'interviewing').length;
    const totalEarnings = allReferrals
      .filter(r => r.rewardStatus === 'released')
      .reduce((sum, r) => sum + (r.job?.rewardAmount || 0), 0);
    
    return { total, hired, interviewing, totalEarnings };
  }, [allReferrals]);

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

  const RewardBadge = ({ status }: { status: string }) => {
    const config = rewardStatusConfig[status as keyof typeof rewardStatusConfig];
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={`${config.color} border-0`}>
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
          My Referrals
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your referrals and monitor their progress through the hiring process
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Referrals</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Successful Hires</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.hired}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">In Progress</p>
                <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.interviewing}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Earned</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  ${stats.totalEarnings.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
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
                  placeholder="Search by candidate name, job title, or company..."
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

            <Select value={rewardFilter} onValueChange={setRewardFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by reward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rewards</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-escrow">In Escrow</SelectItem>
                <SelectItem value="released">Released</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Referrals List */}
      <div className="space-y-4">
        {filteredReferrals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No referrals found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all' || rewardFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Start referring candidates to see them here.'}
              </p>
              <Button asChild>
                <Link to="/opportunities">
                  Browse Job Opportunities
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredReferrals.map((referral) => (
            <Card key={referral.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Section - Candidate & Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 border-2 border-gray-200 dark:border-gray-700">
                        <AvatarImage src={referral.candidate?.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {referral.candidate?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {referral.candidate?.name}
                          </h3>
                          {referral.candidate?.linkedin && (
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                              <a href={referral.candidate.linkedin} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <Building className="h-4 w-4" />
                          <span className="font-medium">{referral.job?.company?.name}</span>
                          <span>•</span>
                          <span>{referral.job?.title}</span>
                          <span>•</span>
                          <span>{referral.job?.location}</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {referral.introNote}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Status & Reward */}
                  <div className="flex flex-col lg:items-end gap-3">
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                      <StatusBadge status={referral.status} />
                      <RewardBadge status={referral.rewardStatus} />
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${referral.job?.rewardAmount?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Referred {format(new Date(referral.createdAt), 'MMM d, yyyy')}
                      </p>
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
                Ready to make more referrals?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse our latest job opportunities and start earning rewards.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/payouts">
                  <DollarSign className="h-4 w-4 mr-2" />
                  View Payouts
                </Link>
              </Button>
              <Button asChild>
                <Link to="/opportunities">
                  <Users className="h-4 w-4 mr-2" />
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