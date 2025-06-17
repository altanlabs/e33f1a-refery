import React from 'react';

export default function TestDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Dashboard</h1>
      <p>This is a simple test to see if the app is loading correctly.</p>
      <div className="mt-4 p-4 bg-blue-100 rounded">
        <p>If you can see this, the React app is working!</p>
      </div>
    </div>
  );
}