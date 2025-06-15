import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Eye, Check, X, Download, ExternalLink, Calendar, User, Mail, Linkedin } from 'lucide-react';

interface ScoutApplication {
  id: string;
  full_name: string;
  email: string;
  linkedin_url: string;
  role: 'Founder' | 'Operator' | 'Investor' | 'Other';
  cv_upload?: string;
  referral_example: string;
  trust_agreement: boolean;
  status: 'pending' | 'approved' | 'declined';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at: string;
  updated_at: string;
}

const ScoutApplicationsAdmin: React.FC = () => {
  const [applications, setApplications] = useState<ScoutApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ScoutApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<ScoutApplication | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter, roleFilter]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('scout_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch scout applications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.referral_example.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(app => app.role === roleFilter);
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: 'approved' | 'declined') => {
    try {
      const { error } = await supabase
        .from('scout_applications')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? { ...app, status: newStatus, updated_at: new Date().toISOString() }
            : app
        )
      );

      toast({
        title: "Status Updated",
        description: `Application ${newStatus} successfully.`,
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'declined':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Declined</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      'Founder': 'bg-purple-100 text-purple-800',
      'Operator': 'bg-blue-100 text-blue-800',
      'Investor': 'bg-green-100 text-green-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return <Badge variant="secondary" className={colors[role as keyof typeof colors] || colors.Other}>{role}</Badge>;
  };

  const exportApplications = () => {
    const csvContent = [
      ['Name', 'Email', 'LinkedIn', 'Role', 'Status', 'Applied Date', 'UTM Source', 'UTM Medium', 'UTM Campaign'].join(','),
      ...filteredApplications.map(app => [
        app.full_name,
        app.email,
        app.linkedin_url,
        app.role,
        app.status,
        new Date(app.created_at).toLocaleDateString(),
        app.utm_source || '',
        app.utm_medium || '',
        app.utm_campaign || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scout-applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scout Applications</h1>
        <p className="text-gray-600">Manage and review applications to become Refery Scouts.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
              <User className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {applications.filter(app => app.status === 'pending').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {applications.filter(app => app.status === 'approved').length}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Declined</p>
                <p className="text-2xl font-bold text-red-600">
                  {applications.filter(app => app.status === 'declined').length}
                </p>
              </div>
              <X className="w-8 h-8 text-red-400" />
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or referral example..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Founder">Founder</SelectItem>
                <SelectItem value="Operator">Operator</SelectItem>
                <SelectItem value="Investor">Investor</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportApplications} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({filteredApplications.length})</CardTitle>
          <CardDescription>
            Review and manage scout applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>UTM Source</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{application.full_name}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(application.role)}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(application.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {application.utm_source || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedApplication(application)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{application.full_name}</DialogTitle>
                              <DialogDescription>Scout Application Details</DialogDescription>
                            </DialogHeader>
                            {selectedApplication && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Mail className="w-4 h-4 text-gray-400" />
                                      <a href={`mailto:${selectedApplication.email}`} className="text-blue-600 hover:underline">
                                        {selectedApplication.email}
                                      </a>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">LinkedIn</label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Linkedin className="w-4 h-4 text-gray-400" />
                                      <a href={selectedApplication.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                        View Profile <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Role</label>
                                    <div className="mt-1">{getRoleBadge(selectedApplication.role)}</div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Status</label>
                                    <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                                  </div>
                                </div>

                                {selectedApplication.cv_upload && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">CV/Track Record</label>
                                    <div className="mt-1">
                                      <a href={selectedApplication.cv_upload} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                        View Document <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <label className="text-sm font-medium text-gray-700">Referral Example</label>
                                  <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                                    {selectedApplication.referral_example}
                                  </div>
                                </div>

                                {(selectedApplication.utm_source || selectedApplication.utm_medium || selectedApplication.utm_campaign) && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">UTM Tracking</label>
                                    <div className="mt-1 grid grid-cols-3 gap-2 text-sm">
                                      <div>Source: {selectedApplication.utm_source || '-'}</div>
                                      <div>Medium: {selectedApplication.utm_medium || '-'}</div>
                                      <div>Campaign: {selectedApplication.utm_campaign || '-'}</div>
                                    </div>
                                  </div>
                                )}

                                <div className="flex gap-2 pt-4 border-t">
                                  {selectedApplication.status === 'pending' && (
                                    <>
                                      <Button
                                        onClick={() => updateApplicationStatus(selectedApplication.id, 'approved')}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                      >
                                        <Check className="w-4 h-4" />
                                        Approve
                                      </Button>
                                      <Button
                                        onClick={() => updateApplicationStatus(selectedApplication.id, 'declined')}
                                        variant="destructive"
                                        className="flex items-center gap-2"
                                      >
                                        <X className="w-4 h-4" />
                                        Decline
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {application.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => updateApplicationStatus(application.id, 'approved')}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => updateApplicationStatus(application.id, 'declined')}
                              size="sm"
                              variant="destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No applications found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoutApplicationsAdmin;