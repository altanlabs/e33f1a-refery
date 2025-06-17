import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
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
                  Terms of Service
                </h1>
                <span className="text-sm text-muted-foreground">
                  Last updated: December 2024
                </span>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">
                By using Refery.io, you agree to the following terms.
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-gray max-w-none space-y-8">
              
              {/* Definitions */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Definitions
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    For the purposes of these Terms of Service:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>User:</strong> Any individual who accesses or uses the Refery.io platform</li>
                    <li><strong>Referrer:</strong> A user who refers candidates to job opportunities</li>
                    <li><strong>Candidate:</strong> An individual seeking employment through referrals</li>
                    <li><strong>Poster:</strong> A company or individual posting job opportunities</li>
                    <li><strong>Rewards:</strong> Monetary compensation paid for successful referrals</li>
                    <li><strong>Platform:</strong> The Refery.io website and associated services</li>
                  </ul>
                </div>
              </section>

              {/* User Conduct */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  What Users Can and Cannot Do
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-medium text-foreground">You May:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Create an account and maintain accurate profile information</li>
                    <li>Post legitimate job opportunities with accurate descriptions</li>
                    <li>Refer qualified candidates to relevant positions</li>
                    <li>Apply to jobs through referrals</li>
                    <li>Communicate professionally with other users</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium text-foreground mt-6">You May Not:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Create fake accounts or provide false information</li>
                    <li>Post fraudulent, discriminatory, or illegal job listings</li>
                    <li>Spam users with irrelevant referrals or communications</li>
                    <li>Attempt to circumvent our referral tracking system</li>
                    <li>Use the platform for any unlawful purposes</li>
                    <li>Violate intellectual property rights</li>
                  </ul>
                </div>
              </section>

              {/* Referrals and Rewards */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  How Referrals, Rewards, and Payouts Work
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-medium text-foreground">Referral Process:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Referrers submit qualified candidates for specific job opportunities</li>
                    <li>Candidates must apply through the referral link to be eligible</li>
                    <li>Companies review applications and make hiring decisions</li>
                    <li>Rewards are paid when referred candidates are successfully hired</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium text-foreground mt-6">Reward Structure:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Reward amounts are set by job posters and clearly displayed</li>
                    <li>Payments are processed through Stripe after successful hires</li>
                    <li>Payouts typically occur within 90 days of hire confirmation</li>
                    <li>Tax responsibilities belong to the reward recipient</li>
                  </ul>
                </div>
              </section>

              {/* Ownership and Duplicates */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Ownership of Referrals and Duplicate Handling
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong>First Referral Priority:</strong> The first user to successfully refer a candidate 
                    to a specific job opportunity will be credited with that referral.
                  </p>
                  <p>
                    <strong>Duplicate Prevention:</strong> Our system tracks referrals to prevent duplicates. 
                    If multiple users refer the same candidate to the same position, only the first 
                    referral will be eligible for rewards.
                  </p>
                  <p>
                    <strong>Self-Referrals:</strong> Users cannot refer themselves to job opportunities. 
                    All referrals must be for third-party candidates.
                  </p>
                  <p>
                    <strong>Dispute Resolution:</strong> In case of referral disputes, Refery.io will 
                    review the situation and make a final determination based on our tracking data.
                  </p>
                </div>
              </section>

              {/* Liability */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Liability Limitations
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong>Platform Availability:</strong> While we strive for 100% uptime, we cannot 
                    guarantee uninterrupted service and are not liable for temporary outages.
                  </p>
                  <p>
                    <strong>User Content:</strong> We are not responsible for the accuracy, legality, 
                    or appropriateness of content posted by users, including job listings and profiles.
                  </p>
                  <p>
                    <strong>Employment Decisions:</strong> Hiring decisions are made solely by employers. 
                    Refery.io does not guarantee job placements or interview opportunities.
                  </p>
                  <p>
                    <strong>Financial Transactions:</strong> While we use secure payment processors, 
                    we are not liable for payment processing delays or failures beyond our control.
                  </p>
                  <p>
                    <strong>Maximum Liability:</strong> Our total liability to any user shall not exceed 
                    the amount of rewards paid to that user in the preceding 12 months.
                  </p>
                </div>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Governing Law
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    These Terms of Service are governed by and construed in accordance with the laws of Estonia.
                  </p>
                  <p>
                    Any disputes arising from these terms or your use of the platform will be resolved 
                    through binding arbitration in accordance with Estonian law.
                  </p>
                  <p>
                    By using Refery.io, you consent to the jurisdiction of Estonian courts for any 
                    legal proceedings related to these terms.
                  </p>
                </div>
              </section>

              {/* Changes to Terms */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Changes to These Terms
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We may update these Terms of Service from time to time. When we do, we will:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Update the "Last updated" date at the top of this page</li>
                    <li>Notify users of significant changes via email or platform notification</li>
                    <li>Provide at least 30 days notice for material changes</li>
                  </ul>
                  <p>
                    Your continued use of the platform after changes take effect constitutes 
                    acceptance of the updated terms.
                  </p>
                </div>
              </section>
            </div>

            {/* Footer CTA */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Need clarification on any of these terms?
                </p>
                <a 
                  href="mailto:legal@refery.io"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Email legal@refery.io
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}