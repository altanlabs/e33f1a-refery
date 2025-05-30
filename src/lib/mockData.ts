import { User, Company, Job, Referral, Application, Candidate } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@techcorp.com',
    name: 'John Smith',
    role: 'poster',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'sarah@venture.com',
    name: 'Sarah Johnson',
    role: 'referrer',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '3',
    email: 'mike@developer.com',
    name: 'Mike Chen',
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-20T10:00:00Z',
  },
];

// Mock Companies
export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp',
    website: 'https://techcorp.com',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    description: 'Leading technology company building the future',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'StartupXYZ',
    website: 'https://startupxyz.com',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop',
    description: 'Fast-growing startup in the fintech space',
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    id: '3',
    name: 'InnovateLabs',
    website: 'https://innovatelabs.com',
    logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop',
    description: 'AI and machine learning research company',
    createdAt: '2024-01-10T10:00:00Z',
  },
];

// Mock Jobs
export const mockJobs: Job[] = [
  {
    id: '1',
    companyId: '1',
    title: 'Senior Frontend Developer',
    description: 'We are looking for an experienced frontend developer to join our team and help build amazing user experiences.',
    location: 'San Francisco, CA',
    type: 'full-time',
    rewardAmount: 5000,
    status: 'active',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'UI/UX design skills'],
    benefits: ['Health insurance', 'Stock options', 'Remote work'],
    createdAt: '2024-01-15T10:00:00Z',
    closingDate: '2024-03-15T23:59:59Z',
  },
  {
    id: '2',
    companyId: '2',
    title: 'Product Manager',
    description: 'Join our product team to drive strategy and execution for our core fintech products.',
    location: 'New York, NY',
    type: 'full-time',
    rewardAmount: 7500,
    status: 'active',
    requirements: ['3+ years PM experience', 'Fintech background', 'Data-driven mindset'],
    benefits: ['Competitive salary', 'Equity', 'Flexible hours'],
    createdAt: '2024-01-20T10:00:00Z',
    closingDate: '2024-04-01T23:59:59Z',
  },
  {
    id: '3',
    companyId: '3',
    title: 'ML Engineer',
    description: 'Help us build cutting-edge AI models and deploy them at scale.',
    location: 'Remote',
    type: 'full-time',
    rewardAmount: 10000,
    status: 'active',
    requirements: ['PhD in ML/AI', 'Python expertise', 'MLOps experience'],
    benefits: ['Top-tier compensation', 'Research budget', 'Conference travel'],
    createdAt: '2024-01-25T10:00:00Z',
    closingDate: '2024-05-01T23:59:59Z',
  },
];

// Mock Candidates
export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Alice Rodriguez',
    email: 'alice@email.com',
    linkedin: 'https://linkedin.com/in/alicerodriguez',
    cv: 'alice_rodriguez_cv.pdf',
    bio: 'Experienced frontend developer with 6 years in React and TypeScript',
    createdAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '2',
    name: 'David Kim',
    email: 'david@email.com',
    linkedin: 'https://linkedin.com/in/davidkim',
    cv: 'david_kim_cv.pdf',
    bio: 'Product manager with fintech experience at major banks',
    createdAt: '2024-01-21T10:00:00Z',
  },
  {
    id: '3',
    name: 'Emma Thompson',
    email: 'emma@email.com',
    linkedin: 'https://linkedin.com/in/emmathompson',
    cv: 'emma_thompson_cv.pdf',
    bio: 'PhD in Machine Learning from Stanford, 4 years industry experience',
    createdAt: '2024-01-26T10:00:00Z',
  },
];

// Mock Referrals
export const mockReferrals: Referral[] = [
  {
    id: '1',
    jobId: '1',
    candidateId: '1',
    referrerId: '2',
    status: 'viewed',
    introNote: 'Alice is an exceptional frontend developer I worked with at my previous company. She has deep React expertise and great attention to detail.',
    rewardStatus: 'pending',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: '2',
    jobId: '2',
    candidateId: '2',
    referrerId: '2',
    status: 'interviewing',
    introNote: 'David has excellent product sense and deep fintech knowledge. He would be a great fit for this role.',
    rewardStatus: 'in-escrow',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
  },
  {
    id: '3',
    jobId: '3',
    candidateId: '3',
    referrerId: '2',
    status: 'hired',
    introNote: 'Emma is brilliant - PhD from Stanford and has shipped ML models at scale. Perfect for this role.',
    rewardStatus: 'released',
    createdAt: '2024-01-26T10:00:00Z',
    updatedAt: '2024-01-28T10:00:00Z',
  },
];

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    candidateId: '1',
    referrerId: '2',
    status: 'viewed',
    coverLetter: 'I am excited to apply for this frontend developer position...',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: '2',
    jobId: '2',
    candidateId: '2',
    referrerId: '2',
    status: 'interviewing',
    coverLetter: 'With my fintech background, I believe I can contribute significantly...',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
  },
];

// Helper function to get enriched data with relationships
export const getJobsWithCompanies = () => {
  return mockJobs.map(job => ({
    ...job,
    company: mockCompanies.find(c => c.id === job.companyId),
  }));
};

export const getReferralsWithRelations = () => {
  return mockReferrals.map(referral => ({
    ...referral,
    job: mockJobs.find(j => j.id === referral.jobId),
    candidate: mockCandidates.find(c => c.id === referral.candidateId),
    referrer: mockUsers.find(u => u.id === referral.referrerId),
  }));
};

export const getApplicationsWithRelations = () => {
  return mockApplications.map(application => ({
    ...application,
    job: mockJobs.find(j => j.id === application.jobId),
    candidate: mockCandidates.find(c => c.id === application.candidateId),
    referrer: application.referrerId ? mockUsers.find(u => u.id === application.referrerId) : undefined,
  }));
};