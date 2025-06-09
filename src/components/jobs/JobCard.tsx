import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Job } from '@/types';
import { MapPin, DollarSign, Clock, Eye } from 'lucide-react';
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

  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-red-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="relative">
              <Avatar className={`h-12 w-12 ${getAvatarColor(job.company?.name || 'Company')}`}>
                <AvatarImage src={job.company?.logo} alt={job.company?.name} />
                <AvatarFallback className="text-white font-semibold">
                  {getCompanyInitials(job.company?.name || 'C')}
                </AvatarFallback>
              </Avatar>
              {job.status === 'active' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 leading-tight">{job.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{job.company?.name}</p>
            </div>
          </div>
          <Badge 
            variant={job.status === 'active' ? 'default' : 'secondary'} 
            className={job.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : ''}
          >
            {job.status === 'active' ? 'Active' : 'Closed'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {job.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            {job.location || 'Remote'}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
            ${job.rewardAmount?.toLocaleString() || '0'}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            {job.type}
          </div>
        </div>

        {/* Requirements/Skills */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {job.requirements.slice(0, 3).map((req, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {req}
                </Badge>
              ))}
              {job.requirements.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{job.requirements.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 space-x-2">
          {userRole === 'referrer' && (
            <Button 
              onClick={() => handleAction('refer')} 
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
            >
              Refer Someone
            </Button>
          )}
          {userRole === 'candidate' && (
            <Button 
              asChild 
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
            >
              <Link to={`/apply/${job.id}`}>Apply Now</Link>
            </Button>
          )}
          {userRole === 'poster' && (
            <Button 
              asChild 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
            >
              <Link to={`/jobs/${job.id}`}>Manage Job</Link>
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            asChild
            className="flex items-center"
          >
            <Link to={`/jobs/${job.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Link>
          </Button>
        </div>

        {/* Additional Info */}
        {job.closingDate && (
          <p className="text-xs text-gray-500 pt-2 border-t">
            Looking for a {job.type.toLowerCase()} {job.title.toLowerCase()} to help us find top talent.
          </p>
        )}
      </CardContent>
    </Card>
  );
}