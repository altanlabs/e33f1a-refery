import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                We value your privacy. Here's what we collect, why, and how we protect it.
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Last Updated: December 16, 2024
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Information We Collect</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                We collect information you provide directly to us and information we gather automatically when you use our platform:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Email address, name, LinkedIn profile, professional details</li>
                <li><strong>Profile Data:</strong> CVs, resumes, work experience, skills, and career preferences</li>
                <li><strong>Referral Metadata:</strong> Referral relationships, candidate submissions, job applications</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information for fraud prevention</li>
                <li><strong>Communication Data:</strong> Messages, support requests, and platform interactions</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>We use your information to provide and improve our referral platform:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Matching:</strong> Connect candidates with relevant job opportunities</li>
                <li><strong>Rewards:</strong> Process referral rewards and track successful placements</li>
                <li><strong>Platform Improvement:</strong> Analyze usage patterns to enhance user experience</li>
                <li><strong>Communication:</strong> Send important updates, notifications, and support responses</li>
                <li><strong>Security:</strong> Prevent fraud, abuse, and maintain platform integrity</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies & Analytics</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                We use cookies and similar technologies to improve your experience and understand how our platform is used:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for platform functionality and security</li>
                <li><strong>Analytics:</strong> Google Analytics to understand user behavior and improve our service</li>
                <li><strong>Performance:</strong> Tools to monitor platform performance and identify issues</li>
              </ul>
              <p>
                You can control cookie preferences through your browser settings, though some features may not work properly if disabled.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>We work with trusted third-party services to provide our platform:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Stripe:</strong> Payment processing for referral rewards and platform fees</li>
                <li><strong>Supabase:</strong> Secure data storage and database management</li>
                <li><strong>AWS/Cloudflare:</strong> Content delivery, hosting, and security services</li>
                <li><strong>Email Services:</strong> Transactional emails and platform notifications</li>
              </ul>
              <p>
                These services have their own privacy policies and security measures. We only share necessary information to provide our services.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>You have several rights regarding your personal information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
              <p>
                To exercise these rights, contact us at <a href="mailto:privacy@refery.io" className="text-emerald-600 hover:text-emerald-700">privacy@refery.io</a>.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Storage & Security</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Encryption:</strong> Data encrypted in transit and at rest</li>
                <li><strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
                <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
                <li><strong>Data Retention:</strong> We retain data only as long as necessary for our services</li>
              </ul>
              <p>
                While we implement strong security measures, no system is 100% secure. We continuously work to improve our security practices.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact for Privacy Questions</h2>
            <div className="text-gray-700 leading-relaxed">
              <p>
                If you have questions about this Privacy Policy or how we handle your personal information, please contact us:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Privacy Team</p>
                <p>Email: <a href="mailto:privacy@refery.io" className="text-emerald-600 hover:text-emerald-700">privacy@refery.io</a></p>
                <p className="text-sm text-gray-600 mt-2">
                  We'll respond to privacy inquiries within 48 hours.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <div className="text-gray-700 leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time. We'll notify you of significant changes by email or through our platform. 
                Your continued use of Refery.io after changes become effective constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}