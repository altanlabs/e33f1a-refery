import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from './StatusBadge';
import { Job } from '@/types';
import { MapPin, DollarSign, Clock, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job & { company?: any };
  userRole: 'poster' | 'referrer' | 'candidate';
  candidateCount?: number;
  onAction?: (action: string, jobId: string) => void;
}

export function JobCard({ job, userRole, candidateCount = 0, onAction }: JobCardProps) {
  const handleAction = (action: string) => {
    onAction?.(action, job.id);
  };

  const getActionButton = () => {
    switch (userRole) {
      case 'poster':
        return (
          <Button asChild size="sm">
            <Link to={`/jobs/${job.id}`}>View Details</Link>
          </Button>
        );
      case 'referrer':
        return (
          <Button onClick={() => handleAction('refer')} size="sm">
            Refer Someone
          </Button>
        );
      case 'candidate':
        return (
          <Button asChild size="sm">
            <Link to={`/apply/${job.id}`}>Apply Now</Link>
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 rounded-2xl overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 ring-2 ring-white/50">
              <AvatarImage src={job.company?.logo} alt={job.company?.name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                {job.company?.name?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg leading-none text-gray-900 dark:text-white">{job.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {job.company?.name}
              </p>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 mr-1" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <DollarSign className="h-4 w-4 mr-1" />
            ${job.rewardAmount.toLocaleString()} reward
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </div>
          {userRole === 'poster' && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4 mr-1" />
              {candidateCount} candidates
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
            {job.type}
          </Badge>
          {job.requirements.slice(0, 2).map((req, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {req}
            </Badge>
          ))}
          {job.requirements.length > 2 && (
            <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              +{job.requirements.length - 2} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          {job.closingDate && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Closes {formatDistanceToNow(new Date(job.closingDate), { addSuffix: true })}
            </p>
          )}
          <div className="ml-auto">
            {getActionButton()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}