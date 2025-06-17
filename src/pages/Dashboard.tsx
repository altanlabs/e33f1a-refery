import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl py-6 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome to Refery Dashboard!
          </h1>
          <p className="text-gray-600">
            Your dashboard is loading successfully.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow border">
          <h3 className="text-lg font-semibold">My Jobs</h3>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-gray-500">0 currently open</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow border">
          <h3 className="text-lg font-semibold">My Referrals</h3>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-gray-500">0 successful hires</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow border">
          <h3 className="text-lg font-semibold">My Applications</h3>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-gray-500">0 in progress</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow border">
          <h3 className="text-lg font-semibold">Total Earnings</h3>
          <p className="text-2xl font-bold">$0</p>
          <p className="text-sm text-gray-500">0 pending rewards</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow border">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link to="/opportunities" className="block p-3 hover:bg-gray-50 rounded">
              Browse Jobs
            </Link>
            <Link to="/jobs/new" className="block p-3 hover:bg-gray-50 rounded">
              Post a Job
            </Link>
            <Link to="/my-referrals" className="block p-3 hover:bg-gray-50 rounded">
              View My Referrals
            </Link>
            <Link to="/my-applications" className="block p-3 hover:bg-gray-50 rounded">
              View My Applications
            </Link>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow border">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 mb-4">
              No recent activity yet. Get started by browsing jobs or posting your first position!
            </p>
            <div className="space-x-2">
              <Link to="/opportunities" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Browse Jobs
              </Link>
              <Link to="/jobs/new" className="inline-block px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h3 className="text-xl font-semibold mb-2">Welcome to Refery!</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          You're all set up! Start by browsing jobs to refer candidates, applying to positions, or posting your own job openings.
        </p>
        <div className="space-x-3">
          <Link to="/opportunities" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Browse Jobs
          </Link>
          <Link to="/jobs/new" className="inline-block px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            Post Your First Job
          </Link>
        </div>
      </div>
    </div>
  );
}