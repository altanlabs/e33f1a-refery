import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Search, 
  Download,
  CreditCard,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Banknote,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Plus,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { dbHelpers } from '@/lib/supabase';
import { format } from 'date-fns';

const statusConfig = {
  'Pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'Processing': { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: ArrowUpRight },
  'Completed': { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'Failed': { label: 'Failed', color: 'bg-red-100 text-red-800', icon: XCircle }
};

const methodConfig = {
  'Bank Transfer': { label: 'Bank Transfer', icon: Building2 },
  'PayPal': { label: 'PayPal', icon: CreditCard }
};

export default function Payouts() {
  const { session } = useAuth();
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      setLoading(true);
      const data = await dbHelpers.getPayouts();
      setPayouts(data || []);
    } catch (error) {
      console.error('Error loading payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayouts = useMemo(() => {
    return payouts.filter(payout => {
      const matchesSearch = 
        payout.referral?.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payout.referral?.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payout.referral?.job?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
      const matchesMethod = methodFilter === 'all' || payout.payment_method === methodFilter;
      
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payouts, searchTerm, statusFilter, methodFilter]);

  const stats = useMemo(() => {
    const totalEarned = payouts
      .filter(p => p.status === 'Completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    const pending = payouts
      .filter(p => p.status === 'Pending' || p.status === 'Processing')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    const thisMonth = payouts
      .filter(p => {
        const payoutDate = new Date(p.created_at);
        const now = new Date();
        return payoutDate.getMonth() === now.getMonth() && 
               payoutDate.getFullYear() === now.getFullYear() &&
               p.status === 'Completed';
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    const completedCount = payouts.filter(p => p.status === 'Completed').length;
    
    return { totalEarned, pending, thisMonth, completedCount };
  }, [payouts]);

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending'];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const MethodBadge = ({ method }: { method: string }) => {
    const config = methodConfig[method as keyof typeof methodConfig] || methodConfig['Bank Transfer'];
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className="border-gray-200 dark:border-gray-700">
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading payouts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payouts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your earnings and manage payout methods
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Payout Settings
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Earned</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  ${stats.totalEarned.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</p>
                <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                  ${stats.pending.toLocaleString()}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">This Month</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  ${stats.thisMonth.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Completed</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {stats.completedCount}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payouts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="payouts" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by candidate, job, or company..."
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
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payouts List */}
          <div className="space-y-4">
            {filteredPayouts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No payouts found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {searchTerm || statusFilter !== 'all' || methodFilter !== 'all'
                      ? 'Try adjusting your filters to see more results.'
                      : 'Start referring candidates to earn your first payout.'}
                  </p>
                  <Button asChild>
                    <Link to="/my-referrals">
                      View My Referrals
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredPayouts.map((payout) => (
                <Card key={payout.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Left Section - Referral Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {payout.referral?.candidate_name || 'Unknown Candidate'}
                              </h3>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {payout.referral?.job?.title || 'Unknown Job'}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <Building2 className="h-4 w-4" />
                              <span>{payout.referral?.job?.company?.name || 'Unknown Company'}</span>
                              <span>•</span>
                              <span>Payout ID: {payout.id}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Created {format(new Date(payout.created_at), 'MMM d, yyyy')}
                                {payout.payout_date && (
                                  <span> • Processed {format(new Date(payout.payout_date), 'MMM d, yyyy')}</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Amount & Status */}
                      <div className="flex flex-col lg:items-end gap-3">
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                          <StatusBadge status={payout.status || 'Pending'} />
                          <MethodBadge method={payout.payment_method || 'Bank Transfer'} />
                        </div>
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ${payout.amount?.toLocaleString() || '0'}
                          </p>
                          {payout.status === 'Processing' && (
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Processing...
                            </p>
                          )}
                          {payout.status === 'Pending' && (
                            <p className="text-xs text-yellow-600 dark:text-yellow-400">
                              Awaiting processing
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          {/* Payment Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-green-600" />
                  Bank Transfer
                  <Badge className="bg-green-100 text-green-800 border-0">Primary</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Account</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">****1234</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Bank</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Chase Bank</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Remove</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  PayPal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">user@example.com</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</p>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Verified
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Set as Primary</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
            <CardContent className="p-8 text-center">
              <Plus className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Add Payment Method
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add a new bank account or PayPal to receive your payouts
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="mt-8 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Need help with payouts?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Contact our support team or check our FAQ for payout-related questions.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/my-referrals">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  View Referrals
                </Link>
              </Button>
              <Button asChild>
                <Link to="/opportunities">
                  <Banknote className="h-4 w-4 mr-2" />
                  Earn More
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}