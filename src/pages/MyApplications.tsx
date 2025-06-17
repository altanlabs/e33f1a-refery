import React, { useState, useMemo, useEffect } from 'react';
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
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useAuth } from 'altan-auth';
import { dbHelpers } from '@/lib/supabase';
import { format } from 'date-fns';

const statusConfig = {
  'Applied': { label: 'Applied', color: 'bg-gray-100 text-gray-800', icon: Clock },
  'Reviewing': { label: 'Reviewing', color: 'bg-blue-100 text-blue-800', icon: Eye },
  'Interviewing': { label: 'Interviewing', color: 'bg-yellow-100 text-yellow-800', icon: Users },
  'Rejected': { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
  'Hired': { label: 'Hired', color: 'bg-green-100 text-green-800', icon: CheckCircle }
};

export default function MyApplications() {
  const { session } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await dbHelpers.getApplications();
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(application => {
      const matchesSearch = 
        application.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.job?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.job?.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = applications.length;
    const interviewing = applications.filter(a => a.status === 'Interviewing').length;
    const reviewing = applications.filter(a => a.status === 'Reviewing').length;
    const pending = applications.filter(a => a.status === 'Applied').length;
    
    return { total, interviewing, reviewing, pending };
  }, [applications]);

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Applied'];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
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
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl py-8 px-4">
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
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Reviewing</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.reviewing}</p>
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
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Reviewing">Reviewing</SelectItem>
                <SelectItem value="Interviewing">Interviewing</SelectItem>
                <SelectItem value="Hired">Hired</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Briefcase className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {searchTerm || statusFilter !== 'all'
                  ? 'No applications match your filters'
                  : 'You haven\'t applied to any jobs yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters to see more results, or browse jobs to submit your first application.'
                  : 'Discover amazing opportunities and take the next step in your career. Browse jobs and start applying today!'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/opportunities">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Link>
                </Button>
                {(searchTerm || statusFilter !== 'all') && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
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
                            {application.job?.title || 'Unknown Job'}
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
                          <span className="font-medium">{application.job?.company?.name || 'Unknown Company'}</span>
                          <span>•</span>
                          <MapPin className="h-4 w-4" />
                          <span>{application.job?.location || 'Unknown Location'}</span>
                          <span>•</span>
                          <span className="capitalize">{application.job?.f_type || 'Unknown Type'}</span>
                        </div>
                        
                        {application.cover_letter && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {application.cover_letter}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Status & Date */}
                  <div className="flex flex-col lg:items-end gap-3">
                    <StatusBadge status={application.status || 'Applied'} />
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>Applied {format(new Date(application.created_at), 'MMM d, yyyy')}</span>
                      </div>
                      {application.updated_at !== application.created_at && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Updated {format(new Date(application.updated_at), 'MMM d, yyyy')}
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