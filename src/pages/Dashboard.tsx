import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppStore } from '@/store';
import { jobApi, referralApi, applicationApi, companyApi } from '@/lib/api';
import { 
  Briefcase, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Eye,
  Calendar,
  Award,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { auth } = useAppStore();
  const [stats, setStats] = useState<any>({});
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (auth.user) {
      loadDashboardData();
    }
  }, [auth.user]);

  const loadDashboardData = async () => {
    if (!auth.user) return;

    try {
      setLoading(true);
      setError('');

      const userRole = auth.user.role;
      let calculatedStats = {};
      let activity: any[] = [];

      switch (userRole) {
        case 'poster':
          const [jobs, referrals, applications] = await Promise.all([
            jobApi.getAll(),
            referralApi.getAll(),
            applicationApi.getAll()
          ]);

          const userJobs = jobs; 
          const totalCandidates = referrals.length + applications.length;
          const interviewingCount = referrals.filter(r => r.status === 'Interviewing').length;
          
          calculatedStats = {
            activeJobs: userJobs.filter(j => j.status === 'Open').length,
            totalCandidates,
            interviewsScheduled: interviewingCount,
            hiredCandidates: referrals.filter(r => r.status === 'Hired').length,
          };

          activity = referrals
            .slice(0, 5)
            .map(referral => ({
              type: 'referral',
              title: `New referral for ${referral.job_data?.title || 'Unknown Job'}`,
              description: `${referral.candidate_name} - ${referral.status}`,
              time: referral.created_at,
              status: referral.status,
            }));
          break;

        case 'referrer':
          const userReferrals = await referralApi.getAll();
          const totalEarnings = userReferrals
            .filter(r => r.reward_status === 'Released')
            .reduce((sum, r) => {
              return sum + (r.job_data?.reward_amount || 0);
            }, 0);
          
          calculatedStats = {
            totalReferrals: userReferrals.length,
            pendingRewards: userReferrals.filter(r => r.reward_status === 'Pending').length,
            totalEarnings,
            successfulHires: userReferrals.filter(r => r.status === 'Hired').length,
          };

          activity = userReferrals
            .slice(0, 5)
            .map(referral => ({
              type: 'status_update',
              title: `Referral status updated`,
              description: `${referral.candidate_name} for ${referral.job_data?.title || 'Unknown Job'} - ${referral.status}`,
              time: referral.updated_at,
              status: referral.status,
            }));
          break;

        case 'candidate':
          const userApplications = await applicationApi.getAll();
          
          calculatedStats = {
            totalApplications: userApplications.length,
            inProgress: userApplications.filter(a => a.status === 'Interviewing').length,
            offers: userApplications.filter(a => a.status === 'Hired').length,
            rejections: userApplications.filter(a => a.status === 'Rejected').length,
          };

          activity = userApplications
            .slice(0, 5)
            .map(application => ({
              type: 'application',
              title: `Application status updated`,
              description: `${application.job_data?.title || 'Unknown Job'} - ${application.status}`,
              time: application.updated_at,
              status: application.status,
            }));
          break;
      }

      setStats(calculatedStats);
      setRecentActivity(activity);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!auth.user) {
    return (
      <div className="container mx-auto py-6">
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
      <div className="container mx-auto py-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const getStatsCards = () => {
    switch (auth.user.role) {
      case 'poster':
        return [
          {
            title: 'Active Jobs',
            value: stats.activeJobs || 0,
            description: 'Currently open positions',
            icon: Briefcase,
            color: 'text-blue-600',
          },
          {
            title: 'Total Candidates',
            value: stats.totalCandidates || 0,
            description: 'Applications & referrals',
            icon: Users,
            color: 'text-green-600',
          },
          {
            title: 'Interviews Scheduled',
            value: stats.interviewsScheduled || 0,
            description: 'Candidates in interview process',
            icon: Calendar,
            color: 'text-yellow-600',
          },
          {
            title: 'Hired Candidates',
            value: stats.hiredCandidates || 0,
            description: 'Successful placements',
            icon: Award,
            color: 'text-purple-600',
          },
        ];

      case 'referrer':
        return [
          {
            title: 'Total Referrals',
            value: stats.totalReferrals || 0,
            description: 'Candidates you\'ve referred',
            icon: Users,
            color: 'text-blue-600',
          },
          {
            title: 'Pending Rewards',
            value: stats.pendingRewards || 0,
            description: 'Awaiting completion',
            icon: DollarSign,
            color: 'text-yellow-600',
          },
          {
            title: 'Total Earnings',
            value: `$${(stats.totalEarnings || 0).toLocaleString()}`,
            description: 'From successful referrals',
            icon: TrendingUp,
            color: 'text-green-600',
          },
          {
            title: 'Successful Hires',
            value: stats.successfulHires || 0,
            description: 'Referrals that got hired',
            icon: Award,
            color: 'text-purple-600',
          },
        ];

      case 'candidate':
        return [
          {
            title: 'Applications',
            value: stats.totalApplications || 0,
            description: 'Jobs you\'ve applied to',
            icon: Briefcase,
            color: 'text-blue-600',
          },
          {
            title: 'In Progress',
            value: stats.inProgress || 0,
            description: 'Currently interviewing',
            icon: Calendar,
            color: 'text-yellow-600',
          },
          {
            title: 'Offers Received',
            value: stats.offers || 0,
            description: 'Job offers pending',
            icon: Award,
            color: 'text-green-600',
          },
          {
            title: 'Profile Views',
            value: Math.floor(Math.random() * 50) + 10,
            description: 'This month',
            icon: Eye,
            color: 'text-purple-600',
          },
        ];

      default:
        return [];
    }
  };

  const getQuickActions = () => {
    switch (auth.user.role) {
      case 'poster':
        return [
          { label: 'Post New Job', href: '/jobs/new', icon: Plus },
          { label: 'View Companies', href: '/companies', icon: Briefcase },
          { label: 'Manage Jobs', href: '/jobs', icon: Users },
        ];

      case 'referrer':
        return [
          { label: 'Browse Jobs', href: '/jobs', icon: Briefcase },
          { label: 'My Referrals', href: '/my-referrals', icon: Users },
          { label: 'View Payouts', href: '/payouts', icon: DollarSign },
        ];

      case 'candidate':
        return [
          { label: 'Find Jobs', href: '/opportunities', icon: Briefcase },
          { label: 'My Applications', href: '/my-applications', icon: Users },
          { label: 'Update Profile', href: '/profile', icon: Eye },
        ];

      default:
        return [];
    }
  };

  const statsCards = getStatsCards();
  const quickActions = getQuickActions();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {auth.user.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your {auth.user.role === 'poster' ? 'hiring' : auth.user.role === 'referrer' ? 'referrals' : 'job search'}.
          </p>
        </div>
        <Badge variant="outline" className="capitalize">
          {auth.user.role}
        </Badge>
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
            <Card key={index}>
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
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for your role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={action.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {action.label}
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
              Latest updates and changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
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
              <p className="text-sm text-muted-foreground">
                No recent activity to show.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}