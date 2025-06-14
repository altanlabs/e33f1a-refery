import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Users, 
  DollarSign, 
  Briefcase, 
  TrendingUp,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

const faqs = [
  {
    question: "How do I refer someone?",
    answer: "Browse our job board, find a suitable position, and click 'Refer Someone'. Provide the candidate's details and your recommendation.",
    category: "Referrals"
  },
  {
    question: "What happens after a candidate is hired?",
    answer: "Once your referred candidate is successfully hired, your reward will be processed within 30 days and added to your account.",
    category: "Rewards"
  },
  {
    question: "How do payouts work?",
    answer: "Payouts are processed monthly via direct deposit or PayPal. Set up your payment method in account settings.",
    category: "Payments"
  },
  {
    question: "Can I track my referral status?",
    answer: "Yes! Visit 'My Referrals' in your dashboard to see real-time status updates for all your referrals.",
    category: "Tracking"
  },
  {
    question: "What's the average referral reward?",
    answer: "Referral rewards range from $1,000 to $15,000 depending on the role level and company. Average reward is $5,500.",
    category: "Rewards"
  },
  {
    question: "How long does the hiring process take?",
    answer: "Our streamlined process typically takes 2-4 weeks from referral to hire, 70% faster than traditional recruiting.",
    category: "Process"
  }
];

const quickStats = [
  { label: "Active Referrals", value: "12", icon: Users, color: "text-blue-600" },
  { label: "Total Earned", value: "$8,500", icon: DollarSign, color: "text-green-600" },
  { label: "Success Rate", value: "85%", icon: TrendingUp, color: "text-purple-600" },
  { label: "Open Jobs", value: "2,500+", icon: Briefcase, color: "text-orange-600" }
];

export function ChatSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-emerald-500" />
            <span>Help & Quick Stats</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Quick Stats */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Your Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4 text-center">
                      <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                        {faq.question}
                      </CardTitle>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {faq.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <div className="space-y-2">
              {[
                { label: "View Dashboard", href: "/dashboard" },
                { label: "Browse Jobs", href: "/opportunities" },
                { label: "My Referrals", href: "/my-referrals" },
                { label: "My Candidates", href: "/my-candidates" },
                { label: "Account Settings", href: "/settings" }
              ].map((link, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-between h-auto p-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  asChild
                >
                  <a href={link.href}>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {link.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}