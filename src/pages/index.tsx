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
  Star,
  Sparkles,
  Zap,
  Target,
  Award,
  Globe,
  Rocket
} from 'lucide-react';

export default function App() {
  const features = [
    {
      icon: Target,
      title: 'Precision Matching',
      description: 'AI-powered algorithms match candidates with perfect-fit opportunities through verified networks.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Reduce time-to-hire by 70% with our streamlined referral process.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Bank-grade security with verified referrer networks and candidate screening.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      title: 'Premium Rewards',
      description: 'Industry-leading referral rewards up to $15,000 per successful placement.',
      gradient: 'from-purple-500 to-pink-500'
    },
  ];

  const userTypes = [
    {
      title: 'Enterprise Companies',
      description: 'Scale your hiring with premium talent from verified networks',
      benefits: [
        'Access to top 1% talent pool',
        '90% faster hiring process',
        '95% candidate retention rate',
        'Dedicated success manager',
      ],
      cta: 'Start Hiring Elite Talent',
      role: 'poster',
      icon: Briefcase,
      gradient: 'from-indigo-500 via-purple-500 to-pink-500'
    },
    {
      title: 'Elite Referrers',
      description: 'Monetize your network with premium referral opportunities',
      benefits: [
        'Earn up to $15,000 per referral',
        'Exclusive high-value positions',
        'Real-time earnings dashboard',
        'VIP referrer status & perks',
      ],
      cta: 'Join Elite Network',
      role: 'referrer',
      icon: Users,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500'
    },
    {
      title: 'Top Candidates',
      description: 'Get referred to dream roles by industry leaders',
      benefits: [
        'Hidden job market access',
        'Personal advocate support',
        '5x higher interview rates',
        'Career acceleration program',
      ],
      cta: 'Access Premium Jobs',
      role: 'candidate',
      icon: Rocket,
      gradient: 'from-orange-500 via-red-500 to-pink-500'
    },
  ];

  const stats = [
    { label: 'Active Premium Jobs', value: '2,500+', icon: Briefcase },
    { label: 'Successful Placements', value: '15,000+', icon: CheckCircle },
    { label: 'Total Rewards Paid', value: '$50M+', icon: DollarSign },
    { label: 'Average Reward', value: '$12,500', icon: Award },
  ];

  const testimonials = [
    {
      quote: "Refery transformed our hiring. We found our CTO through a referral in just 3 weeks. The quality is unmatched.",
      author: "Sarah Chen",
      role: "CEO, TechUnicorn",
      avatar: "SC"
    },
    {
      quote: "I've earned over $75,000 in referral rewards this year. It's become my most profitable side business.",
      author: "Marcus Rodriguez",
      role: "Senior Engineer, Meta",
      avatar: "MR"
    },
    {
      quote: "Got referred to my dream job at a unicorn startup. The personal touch made all the difference.",
      author: "Emily Zhang",
      role: "Product Manager, Stripe",
      avatar: "EZ"
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Hero Section */}
      <section className="relative py-32 px-4 text-center">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex justify-center">
            <Badge variant="outline" className="px-6 py-2 text-sm font-medium bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-purple-200 dark:border-purple-800">
              <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
              Trusted by 2,500+ elite companies
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              The Future
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">of Hiring is</span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Referrals
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Connect with <span className="font-semibold text-purple-600 dark:text-purple-400">elite talent</span> through verified networks of 
            founders, operators, and investors. Experience <span className="font-semibold text-cyan-600 dark:text-cyan-400">10x faster hiring</span> with 
            <span className="font-semibold text-pink-600 dark:text-pink-400"> premium rewards</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button size="lg" className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-2xl shadow-purple-500/25 transform hover:scale-105 transition-all duration-300" asChild>
              <Link to="/auth/signup">
                <Rocket className="mr-2 h-5 w-5" />
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-2 hover:bg-white/80 dark:hover:bg-gray-800/80 transform hover:scale-105 transition-all duration-300" asChild>
              <Link to="/auth/login">
                <Globe className="mr-2 h-5 w-5" />
                Explore Platform
              </Link>
            </Button>
          </div>

          {/* Floating Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:-translate-y-2">
                  <CardContent className="p-6 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                    <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-4 py-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              Revolutionary Platform
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              Why <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Refery</span> Dominates
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform revolutionizes hiring by leveraging AI, verified networks, and premium incentives 
              to create the ultimate talent marketplace.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:-translate-y-4 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <CardHeader className="relative">
                    <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-center text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-center text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-indigo-50/50 dark:from-gray-900/50 dark:to-indigo-950/50" />
        <div className="container mx-auto max-w-7xl relative">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-4 py-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              Complete Ecosystem
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              Built for <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Everyone</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Whether you're scaling your team, monetizing your network, or advancing your career, 
              we have premium tools designed for your success.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {userTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} className="group relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-700 hover:-translate-y-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${type.gradient}`} />
                  
                  <CardHeader className="relative pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${type.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {type.title}
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                      {type.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative space-y-6">
                    <ul className="space-y-4">
                      {type.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button className={`w-full py-3 text-lg font-semibold bg-gradient-to-r ${type.gradient} hover:shadow-xl transform hover:scale-105 transition-all duration-300`} asChild>
                      <Link to="/auth/signup">
                        {type.cta}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-4 py-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              Loved by <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Thousands</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-5xl text-center relative">
          <Badge variant="outline" className="mb-8 px-6 py-3 bg-white/20 backdrop-blur-sm border-white/30 text-white">
            <Sparkles className="w-5 h-5 mr-2" />
            Join the Revolution
          </Badge>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 text-white leading-tight">
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Your Future?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join over <span className="font-bold">50,000+ professionals</span> already using Refery to 
            accelerate their careers and maximize their earning potential.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="px-10 py-4 text-xl font-bold bg-white text-purple-600 hover:bg-gray-100 shadow-2xl transform hover:scale-110 transition-all duration-300" asChild>
              <Link to="/auth/signup">
                <Rocket className="mr-3 h-6 w-6" />
                Start Your Success Story
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-10 py-4 text-xl font-bold bg-transparent text-white border-2 border-white/50 hover:bg-white/10 backdrop-blur-sm transform hover:scale-110 transition-all duration-300" asChild>
              <Link to="/opportunities">
                <Globe className="mr-3 h-6 w-6" />
                Explore Opportunities
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}