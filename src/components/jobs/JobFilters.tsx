import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

export interface JobFiltersState {
  search: string;
  location: string;
  type: string;
  rewardMin: string;
  rewardMax: string;
  company: string;
  status: string;
  sortBy: string;
}

interface JobFiltersProps {
  filters: JobFiltersState;
  onFiltersChange: (filters: JobFiltersState) => void;
  userRole: 'poster' | 'referrer' | 'candidate';
  companies?: Array<{ id: string; name: string }>;
}

export function JobFilters({ filters, onFiltersChange, userRole, companies = [] }: JobFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof JobFiltersState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      location: '',
      type: '',
      rewardMin: '',
      rewardMax: '',
      company: '',
      status: '',
      sortBy: 'newest',
    });
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => 
      key !== 'sortBy' && value !== ''
    ).length;
  };

  const getSortOptions = () => {
    const baseOptions = [
      { value: 'newest', label: 'Newest First' },
      { value: 'oldest', label: 'Oldest First' },
    ];

    if (userRole === 'referrer' || userRole === 'candidate') {
      baseOptions.push(
        { value: 'reward-high', label: 'Highest Reward' },
        { value: 'reward-low', label: 'Lowest Reward' }
      );
    }

    if (userRole === 'poster') {
      baseOptions.push(
        { value: 'candidates', label: 'Most Candidates' }
      );
    }

    return baseOptions;
  };

  const getStatusOptions = () => {
    if (userRole === 'poster') {
      return [
        { value: 'active', label: 'Active' },
        { value: 'paused', label: 'Paused' },
        { value: 'closed', label: 'Closed' },
      ];
    }
    return [
      { value: 'active', label: 'Active' },
      { value: 'closed', label: 'Closed' },
    ];
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex items-center space-x-2">
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFiltersCount()} active
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="h-4 w-4 mr-1" />
              {showAdvanced ? 'Less' : 'More'}
            </Button>
            {getActiveFiltersCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. San Francisco"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="type">Job Type</Label>
            <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sortBy">Sort by</Label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getSortOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(userRole === 'referrer' || userRole === 'candidate') && (
                <>
                  <div>
                    <Label htmlFor="rewardMin">Min Reward ($)</Label>
                    <Input
                      id="rewardMin"
                      type="number"
                      placeholder="0"
                      value={filters.rewardMin}
                      onChange={(e) => updateFilter('rewardMin', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rewardMax">Max Reward ($)</Label>
                    <Input
                      id="rewardMax"
                      type="number"
                      placeholder="No limit"
                      value={filters.rewardMax}
                      onChange={(e) => updateFilter('rewardMax', e.target.value)}
                    />
                  </div>
                </>
              )}
              {companies.length > 0 && (
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Select value={filters.company} onValueChange={(value) => updateFilter('company', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All companies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All companies</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    {getStatusOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}