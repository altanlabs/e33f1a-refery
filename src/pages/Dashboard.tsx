import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { dbHelpers } from '@/lib/supabase';
import { 
  Briefcase, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Eye,
  Calendar,
  Award,
  Loader2,
  Search,
  FileText,
  Building,
  Rocket
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { session } = useAuth();
  const [stats, setStats] = useState<any>({});
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (session?.user) {
      loadDashboardData();
    }
  }, [session?.user]);

  const loadDashboardData = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      setError('');

      const [jobs, referrals, applications] = await Promise.all([
        dbHelpers.getJobs(),
        dbHelpers.getReferrals(),
        dbHelpers.getApplications()
      ]);

      const totalEarnings = referrals
        .filter(r => r.reward_status === 'Released')
        .reduce((sum, r) => sum + (r.job?.reward_amount || 0), 0);

      const calculatedStats = {
        activeJobs: jobs.filter(j => j.status === 'Open').length,
        totalJobs: jobs.length,
        
        totalReferrals: referrals.length,
        pendingRewards: referrals.filter(r => r.reward_status === 'Pending').length,
        totalEarnings,
        successfulHires: referrals.filter(r => r.status === 'Hired').length,
        
        totalApplications: applications.length,
        inProgress: applications.filter(a => a.status === 'Interviewing').length,
        offers: applications.filter(a => a.status === 'Hired').length,
      };

      const allActivity = [
        ...referrals.slice(0, 3).map(referral => ({
          type: 'referral',
          title: `New referral for ${referral.job?.title || 'Unknown Job'}`,
          description: `${referral.candidate_name} - ${referral.status}`,
          time: referral.created_at,
          status: referral.status,
        })),
        ...applications.slice(0, 3).map(application => ({
          type: 'application',
          title: `Application status updated`,
          description: `${application.job?.title || 'Unknown Job'} - ${application.status}`,
          time: application.updated_at,
          status: application.status,
        })),
        ...jobs.slice(0, 2).map(job => ({
          type: 'job',
          title: `Job posted`,
          description: `${job.title} - ${job.status}`,
          time: job.created_at,
          status: job.status,
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

      setStats(calculatedStats);
      setRecentActivity(allActivity);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-7xl py-6 px-4">
        <Alert>
          <AlertDescription>
            Please log in to view your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl py-6 px-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const userName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User';

  const statsCards = [
    {
      title: 'My Jobs',
      value: stats.totalJobs || 0,
      description: `${stats.activeJobs || 0} currently open`,
      icon: Briefcase,
      color: 'text-blue-600',
      href: '/jobs'
    },
    {
      title: 'My Referrals',
      value: stats.totalReferrals || 0,
      description: `${stats.successfulHires || 0} successful hires`,
      icon: Users,
      color: 'text-green-600',
      href: '/my-referrals'
    },
    {
      title: 'My Applications',
      value: stats.totalApplications || 0,
      description: `${stats.inProgress || 0} in progress`,
      icon: FileText,
      color: 'text-purple-600',
      href: '/my-applications'
    },
    {
      title: 'Total Earnings',
      value: `$${(stats.totalEarnings || 0).toLocaleString()}`,
      description: `${stats.pendingRewards || 0} pending rewards`,
      icon: DollarSign,
      color: 'text-yellow-600',
      href: '/payouts'
    },
  ];

  const quickActions = [
    { label: 'Browse Jobs', href: '/opportunities', icon: Search, description: 'Find opportunities to refer or apply' },
    { label: 'Post a Job', href: '/jobs/new', icon: Plus, description: 'Hire talent through referrals' },
    { label: 'View My Referrals', href: '/my-referrals', icon: Users, description: 'Track your referral progress' },
    { label: 'View My Applications', href: '/my-applications', icon: FileText, description: 'Check application status' },
  ];

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {userName.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here's your complete Refery overview - jobs, referrals, and applications all in one place.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadDashboardData}
              className="ml-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
              <Link to={stat.href}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Everything you need to succeed on Refery
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-4"
                  asChild
                >
                  <Link to={action.href}>
                    <div className="flex items-start space-x-3">
                      <Icon className="h-5 w-5 mt-0.5 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">{action.label}</div>
                        <div className="text-sm text-muted-foreground">{action.description}</div>
                      </div>
                    </div>
                  </Link>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across all your activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'referral' ? 'bg-green-500' :
                      activity.type === 'application' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  No recent activity yet. Get started by browsing jobs or posting your first position!
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button size="sm" asChild>
                    <Link to="/opportunities">
                      <Search className="h-4 w-4 mr-2" />
                      Browse Jobs
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/jobs/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Post a Job
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {stats.totalJobs === 0 && stats.totalReferrals === 0 && stats.totalApplications === 0 && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Rocket className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Welcome to Refery!</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You're all set up! Start by browsing jobs to refer candidates, applying to positions, or posting your own job openings.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link to="/opportunities">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Jobs
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/jobs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Job
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}