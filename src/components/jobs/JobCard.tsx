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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={job.company?.logo} alt={job.company?.name} />
              <AvatarFallback>
                {job.company?.name?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg leading-none">{job.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {job.company?.name}
              </p>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-1" />
            ${job.rewardAmount.toLocaleString()} reward
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </div>
          {userRole === 'poster' && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              {candidateCount} candidates
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            {job.type}
          </Badge>
          {job.requirements.slice(0, 2).map((req, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {req}
            </Badge>
          ))}
          {job.requirements.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{job.requirements.length - 2} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          {job.closingDate && (
            <p className="text-xs text-muted-foreground">
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