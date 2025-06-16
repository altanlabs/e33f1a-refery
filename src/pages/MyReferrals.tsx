import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  ExternalLink,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ArrowUpRight,
  Target,
  Award,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/lib/auth-fallback';

interface Referral {
  id: string;
  candidate_name: string;
  candidate_email: string;
  job_title: string;
  company_name: string;
  status: 'pending' | 'interviewing' | 'hired' | 'rejected';
  reward_amount: number;
  submitted_at: string;
  notes?: string;
}

export default function MyReferrals() {
  const { session } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (session?.user?.id) {
      loadReferrals();
    }
  }, [session?.user?.id]);

  const loadReferrals = async () => {
    try {
      setLoading(true);
      const mockReferrals: Referral[] = [
        {
          id: '1',
          candidate_name: 'Sarah Johnson',
          candidate_email: 'sarah.johnson@email.com',
          job_title: 'Senior Frontend Developer',
          company_name: 'TechCorp',
          status: 'interviewing',
          reward_amount: 5000,
          submitted_at: '2024-01-15T10:00:00Z',
          notes: 'Strong React background, perfect fit for the role'
        },
        {
          id: '2',
          candidate_name: 'Michael Chen',
          candidate_email: 'michael.chen@email.com',
          job_title: 'Product Manager',
          company_name: 'StartupXYZ',
          status: 'hired',
          reward_amount: 8000,
          submitted_at: '2024-01-10T14:30:00Z',
          notes: 'Excellent product sense and leadership skills'
        },
        {
          id: '3',
          candidate_name: 'Emily Rodriguez',
          candidate_email: 'emily.rodriguez@email.com',
          job_title: 'Data Scientist',
          company_name: 'DataFlow Inc',
          status: 'pending',
          reward_amount: 6000,
          submitted_at: '2024-01-20T09:15:00Z'
        },
        {
          id: '4',
          candidate_name: 'David Kim',
          candidate_email: 'david.kim@email.com',
          job_title: 'DevOps Engineer',
          company_name: 'CloudTech',
          status: 'rejected',
          reward_amount: 4500,
          submitted_at: '2024-01-05T16:45:00Z',
          notes: 'Great technical skills but not the right cultural fit'
        }
      ];
      setReferrals(mockReferrals);
    } catch (error) {
      console.error('Error loading referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'interviewing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'hired':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'interviewing':
        return <Users className="h-4 w-4" />;
      case 'hired':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = referral.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: referrals.length,
    pending: referrals.filter(r => r.status === 'pending').length,
    interviewing: referrals.filter(r => r.status === 'interviewing').length,
    hired: referrals.filter(r => r.status === 'hired').length,
    totalEarnings: referrals.filter(r => r.status === 'hired').reduce((sum, r) => sum + r.reward_amount, 0)
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Referrals
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your referrals and earnings
          </p>
        </div>
        
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Referral
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Interviewing</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.interviewing}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hired</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.hired}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-emerald-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${stats.totalEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Search referrals</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search by candidate name, job title, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle>Referrals ({filteredReferrals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReferrals.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No referrals found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start referring candidates to earn rewards'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Make Your First Referral
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReferrals.map((referral) => (
                <div
                  key={referral.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {referral.candidate_name}
                        </h3>
                        <Badge className={`${getStatusColor(referral.status)} flex items-center gap-1`}>
                          {getStatusIcon(referral.status)}
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Position</p>
                          <p className="font-medium text-gray-900 dark:text-white">{referral.job_title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Company</p>
                          <p className="font-medium text-gray-900 dark:text-white">{referral.company_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Reward</p>
                          <p className="font-medium text-emerald-600 dark:text-emerald-400">
                            ${referral.reward_amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Submitted {new Date(referral.submitted_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {referral.candidate_email}
                        </div>
                      </div>
                      
                      {referral.notes && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Notes:</strong> {referral.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}