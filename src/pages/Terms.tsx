import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Please read these terms carefully. By using Refery.io, you agree to the following.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Definitions</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>To help you understand these terms, here are key definitions:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Referrer:</strong> A user who refers candidates to job opportunities on our platform</li>
                <li><strong>Candidate:</strong> A person seeking employment who is referred through our platform</li>
                <li><strong>Poster:</strong> A company or hiring manager posting job opportunities</li>
                <li><strong>Rewards:</strong> Monetary compensation paid to referrers for successful hires</li>
                <li><strong>Platform:</strong> The Refery.io website, mobile app, and related services</li>
                <li><strong>Successful Hire:</strong> When a referred candidate is hired and completes their probation period</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Eligibility</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>To use Refery.io, you must meet these requirements:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Age:</strong> You must be at least 18 years old</li>
                <li><strong>Professional Use:</strong> The platform is for legitimate professional networking and hiring</li>
                <li><strong>No Spam:</strong> Prohibited from mass referrals, fake profiles, or referral abuse</li>
                <li><strong>Accurate Information:</strong> All profile information must be truthful and current</li>
                <li><strong>Single Account:</strong> One account per person; duplicate accounts will be terminated</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts that violate these eligibility requirements.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Scope</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>Refery.io operates as a referral marketplace with the following process:</p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ol className="list-decimal pl-6 space-y-3">
                  <li><strong>Connection:</strong> Referrers connect qualified candidates with job opportunities</li>
                  <li><strong>Application:</strong> Candidates apply through our platform with referrer attribution</li>
                  <li><strong>Hiring Decision:</strong> Companies make independent hiring decisions</li>
                  <li><strong>Verification:</strong> We verify successful hires and probation completion</li>
                  <li><strong>Reward:</strong> Referrers receive compensation for verified successful placements</li>
                </ol>
              </div>
              <p>
                <strong>Important:</strong> Refery.io is a platform facilitator, not an employer or recruitment agency. 
                We do not make hiring decisions or guarantee job placements.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reward Terms</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>Referral rewards are subject to these conditions:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Eligibility:</strong> Rewards paid only upon verified hire and successful probation completion</li>
                <li><strong>Probation Period:</strong> Typically 90 days, but varies by company policy</li>
                <li><strong>Payment Method:</strong> All rewards processed through Stripe to your verified payment method</li>
                <li><strong>Processing Time:</strong> Rewards paid within 30 days of probation completion verification</li>
                <li><strong>Tax Responsibility:</strong> You are responsible for any applicable taxes on rewards</li>
                <li><strong>Disputes:</strong> Reward disputes must be raised within 60 days of the hiring decision</li>
              </ul>
              <p>
                Reward amounts are set by the posting company and clearly displayed on job listings. 
                Refery.io may charge a platform fee, which will be disclosed before any transaction.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Referral Ownership Rules</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>To ensure fair attribution of referrals:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>First Referral Wins:</strong> The first referrer to submit a candidate gets attribution</li>
                <li><strong>Timestamp Priority:</strong> Referral ownership determined by submission timestamp</li>
                <li><strong>No Duplicates:</strong> Same candidate cannot be referred multiple times for the same position</li>
                <li><strong>24-Hour Window:</strong> Candidates have 24 hours to complete their application after referral</li>
                <li><strong>Attribution Lock:</strong> Once a candidate applies, referral attribution is locked</li>
              </ul>
              <p>
                If you believe there's an error in referral attribution, contact our support team within 48 hours 
                of the disputed referral.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Activities</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>The following activities are strictly prohibited:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Fake Referrals:</strong> Referring unqualified or non-existent candidates</li>
                <li><strong>Self-Referral:</strong> Referring yourself under different names or accounts</li>
                <li><strong>Spam:</strong> Mass referrals without genuine candidate relationships</li>
                <li><strong>Misrepresentation:</strong> Providing false information about candidates or yourself</li>
                <li><strong>Platform Abuse:</strong> Attempting to manipulate or circumvent our systems</li>
                <li><strong>Harassment:</strong> Inappropriate contact with candidates, referrers, or companies</li>
              </ul>
              <p>
                Violation of these rules may result in account suspension, reward forfeiture, and platform ban.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                <strong>Platform Role:</strong> Refery.io is a technology platform that connects referrers, candidates, and companies. 
                We are not an employer, recruitment agency, or party to any employment relationship.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Hiring Decisions:</strong> Companies make independent hiring decisions; we are not liable for hiring outcomes</li>
                <li><strong>Employment Issues:</strong> We are not responsible for workplace disputes, terminations, or employment law matters</li>
                <li><strong>Third-Party Actions:</strong> Not liable for actions of users, companies, or candidates on our platform</li>
                <li><strong>Service Availability:</strong> Platform may experience downtime; we're not liable for service interruptions</li>
                <li><strong>Maximum Liability:</strong> Our total liability is limited to the amount of rewards paid to you in the past 12 months</li>
              </ul>
              <p>
                <strong>Disclaimer:</strong> The platform is provided "as is" without warranties of any kind. 
                Use at your own risk.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Termination</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>Either party may terminate your account:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Your Right:</strong> You may delete your account at any time through your profile settings</li>
                <li><strong>Our Right:</strong> We may suspend or terminate accounts for terms violations or platform abuse</li>
                <li><strong>Pending Rewards:</strong> Earned rewards will be paid according to normal processing timelines</li>
                <li><strong>Data Retention:</strong> Some data may be retained for legal and business purposes</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                We may update these terms from time to time. Significant changes will be communicated via email 
                or platform notification. Continued use of Refery.io after changes constitutes acceptance of updated terms.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                These terms are governed by the laws of Estonia and the European Union. 
                Any disputes will be resolved through binding arbitration in Estonia, 
                except where prohibited by local law.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
            <div className="text-gray-700 leading-relaxed">
              <p>
                Questions about these terms? Contact our legal team:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Legal Team</p>
                <p>Email: <a href="mailto:legal@refery.io" className="text-emerald-600 hover:text-emerald-700">legal@refery.io</a></p>
                <p className="text-sm text-gray-600 mt-2">
                  We'll respond to legal inquiries within 5 business days.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}