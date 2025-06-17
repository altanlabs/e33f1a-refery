import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
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
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Privacy Policy
                </h1>
                <span className="text-sm text-muted-foreground">
                  Last updated: December 2024
                </span>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">
                We respect your data. Here's what we collect and how we use it.
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-gray max-w-none space-y-8">
              
              {/* What Data We Collect */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  What Data We Collect
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We collect information you provide directly to us, such as when you create an account, 
                    post a job, make a referral, or contact us for support.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Information:</strong> Email address, name, professional profile details</li>
                    <li><strong>LinkedIn Data:</strong> Profile information when you connect your LinkedIn account</li>
                    <li><strong>Referral Metadata:</strong> Job applications, candidate information, referral relationships</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, device information, usage patterns</li>
                    <li><strong>Communication Data:</strong> Messages, support requests, feedback</li>
                  </ul>
                </div>
              </section>

              {/* How We Use Your Data */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  How We Use Your Data
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We use the information we collect to provide, maintain, and improve our services:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Matching:</strong> Connect candidates with relevant job opportunities</li>
                    <li><strong>Compliance:</strong> Verify identities and prevent fraud</li>
                    <li><strong>Notifications:</strong> Send updates about referrals, applications, and payouts</li>
                    <li><strong>Analytics:</strong> Understand how our platform is used to improve features</li>
                    <li><strong>Support:</strong> Respond to your questions and provide customer service</li>
                  </ul>
                </div>
              </section>

              {/* Third-Party Services */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Third-Party Services
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We work with trusted third-party services to provide our platform:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Stripe:</strong> Payment processing for referral rewards and payouts</li>
                    <li><strong>Supabase:</strong> Database hosting and authentication services</li>
                    <li><strong>Analytics Services:</strong> Usage analytics to improve our platform</li>
                    <li><strong>LinkedIn API:</strong> Professional profile integration</li>
                  </ul>
                  <p>
                    These services have their own privacy policies and we encourage you to review them.
                  </p>
                </div>
              </section>

              {/* Cookie Policy */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Cookie Policy
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We use cookies and similar technologies to enhance your experience:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  </ul>
                  <p>
                    You can control cookie settings through your browser preferences.
                  </p>
                </div>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Your Rights
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    You have several rights regarding your personal data:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                    <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  </ul>
                  <p>
                    To exercise these rights, please contact us at privacy@refery.io.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Contact Us
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    If you have any questions about this Privacy Policy or our data practices, 
                    please contact us at:
                  </p>
                  <p className="font-medium">
                    <a href="mailto:privacy@refery.io" className="text-primary hover:underline">
                      privacy@refery.io
                    </a>
                  </p>
                </div>
              </section>
            </div>

            {/* Footer CTA */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Still have questions about our privacy practices?
                </p>
                <a 
                  href="mailto:privacy@refery.io"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Contact us at privacy@refery.io
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}