import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, Mail, MessageCircle, HelpCircle } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Back to Home */}
      <div className="sticky top-4 z-10 flex justify-start px-4 pt-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border rounded-lg shadow-sm hover:bg-white/90 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We'd love to hear from you. Get in touch with our team for any questions, 
                feedback, or support needs.
              </p>
            </div>

            {/* Main Contact */}
            <div className="mb-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  General Inquiries
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  For general questions, partnership opportunities, or any other inquiries, 
                  reach out to our main contact email.
                </p>
                <a 
                  href="mailto:contact@refery.io"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-lg"
                >
                  <Mail className="h-5 w-5" />
                  contact@refery.io
                </a>
              </div>
            </div>

            {/* Specialized Contact Options */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Support */}
              <Card className="border border-border/50 bg-white/30">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                    <HelpCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Technical Support
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Having trouble with the platform? Need help with your account?
                  </p>
                  <a 
                    href="mailto:support@refery.io"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    support@refery.io
                  </a>
                </CardContent>
              </Card>

              {/* Business */}
              <Card className="border border-border/50 bg-white/30">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Business Partnerships
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Interested in partnering with us or enterprise solutions?
                  </p>
                  <a 
                    href="mailto:business@refery.io"
                    className="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    business@refery.io
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Response Time */}
            <div className="bg-muted/30 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Response Times
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-foreground">General Inquiries:</span>
                  <span className="text-muted-foreground ml-2">Within 24 hours</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Technical Support:</span>
                  <span className="text-muted-foreground ml-2">Within 12 hours</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Business Partnerships:</span>
                  <span className="text-muted-foreground ml-2">Within 48 hours</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Urgent Issues:</span>
                  <span className="text-muted-foreground ml-2">Within 4 hours</span>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                    <span className="font-medium text-foreground">How do referral rewards work?</span>
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 text-muted-foreground text-sm">
                    Referral rewards are paid when a candidate you refer gets hired. The reward amount 
                    is set by the job poster and paid within 30 days of hire confirmation.
                  </div>
                </details>
                
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                    <span className="font-medium text-foreground">How do I track my referrals?</span>
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 text-muted-foreground text-sm">
                    You can track all your referrals in the "My Referrals" section of your dashboard. 
                    You'll see the status of each referral and any pending rewards.
                  </div>
                </details>
                
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                    <span className="font-medium text-foreground">Can I refer multiple candidates to the same job?</span>
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 text-muted-foreground text-sm">
                    Yes, you can refer multiple qualified candidates to the same job opportunity. 
                    Each successful hire will earn you the referral reward.
                  </div>
                </details>
              </div>
            </div>

            {/* Office Hours */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Support Hours
              </h3>
              <p className="text-muted-foreground text-sm">
                Monday - Friday: 9:00 AM - 6:00 PM (EST)
              </p>
              <p className="text-muted-foreground text-sm">
                Weekend: Limited support for urgent issues
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}