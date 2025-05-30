import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  Shield, 
  TrendingUp, 
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

export default function App() {
  const features = [
    {
      icon: Users,
      title: 'Trusted Network',
      description: 'Connect with verified founders, operators, and investors for quality referrals.',
    },
    {
      icon: DollarSign,
      title: 'Earn Rewards',
      description: 'Get paid for successful referrals with competitive reward amounts.',
    },
    {
      icon: Shield,
      title: 'Verified Candidates',
      description: 'All candidates are pre-screened through our trusted referral network.',
    },
    {
      icon: TrendingUp,
      title: 'Better Matches',
      description: 'Higher success rates through personal recommendations and insights.',
    },
  ];

  const userTypes = [
    {
      title: 'For Companies',
      description: 'Find quality candidates faster through trusted referrals',
      benefits: [
        'Access to pre-vetted candidates',
        'Faster hiring process',
        'Higher retention rates',
        'Reduced recruitment costs',
      ],
      cta: 'Start Hiring',
      role: 'poster',
    },
    {
      title: 'For Referrers',
      description: 'Monetize your network by referring great candidates',
      benefits: [
        'Earn up to $10,000 per referral',
        'Help your network find opportunities',
        'Build your reputation',
        'Flexible side income',
      ],
      cta: 'Start Referring',
      role: 'referrer',
    },
    {
      title: 'For Candidates',
      description: 'Get referred to your dream job by industry insiders',
      benefits: [
        'Access to hidden job market',
        'Personal recommendations',
        'Higher interview rates',
        'Career guidance',
      ],
      cta: 'Find Jobs',
      role: 'candidate',
    },
  ];

  const stats = [
    { label: 'Active Jobs', value: '500+' },
    { label: 'Successful Hires', value: '1,200+' },
    { label: 'Total Rewards Paid', value: '$2.5M+' },
    { label: 'Average Reward', value: '$7,500' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto max-w-4xl">
          <Badge variant="outline" className="mb-4">
            Trusted by 500+ companies
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            The Future of Hiring is Through Referrals
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect companies with quality candidates through verified referrals from founders, 
            operators, and investors. Better matches, faster hiring, higher rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/auth/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-b">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Refery?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform revolutionizes hiring by leveraging the power of trusted networks 
              and personal recommendations.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Built for Everyone in the Hiring Ecosystem
            </h2>
            <p className="text-lg text-muted-foreground">
              Whether you're hiring, referring, or job searching, we have the tools you need.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" asChild>
                    <Link to="/auth/signup">
                      {type.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-2xl font-medium mb-4">
              "Refery helped us hire 3 amazing engineers in just 2 months. 
              The quality of candidates through referrals is unmatched."
            </blockquote>
            <cite className="text-muted-foreground">
              — Sarah Chen, CTO at TechCorp
            </cite>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of companies, referrers, and candidates already using Refery.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/auth/signup">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}