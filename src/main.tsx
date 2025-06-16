import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Simple test component to isolate the issue
function TestApp() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Refery.io
        </h1>
        <p className="text-gray-600">
          Application is loading...
        </p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>,
)