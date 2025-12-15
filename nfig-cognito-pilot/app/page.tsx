/**
 * NFIG Cognito Pilot App - Home Page
 * 
 * This is the landing page for the NOAA National Federated Identity Gateway
 * Cognito Proof of Concept application. It provides authentication controls
 * and displays user session information.
 */

import Link from "next/link";

export default function Home() {
  // In a real implementation, we'd get session here
  // For now, we'll create the UI structure
  const isAuthenticated = false; // TODO: Get from session
  const user: { name?: string; email?: string } | null = null; // TODO: Get from session

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e9f0 100%)' }}>
      {/* Top Navigation Bar */}
      <nav className="mat-elevation-4 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: 'var(--noaa-primary)' }}>
              N
            </div>
            <div>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--noaa-primary)' }}>
                NFIG Cognito Pilot
              </h1>
              <p className="text-xs text-gray-500">NOAA Identity Gateway</p>
            </div>
          </div>
          {isAuthenticated && (
            <a
              href="/api/auth/signout"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign Out
            </a>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {!isAuthenticated ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-sm font-medium mb-6" style={{ color: 'var(--noaa-primary)' }}>
                ⚠️ Test Environment Only
              </div>
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                AWS Cognito Authentication Test
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Evaluating Cognito as an Enterprise Authentication Proxy for NOAA's National Federated Identity Gateway
              </p>
            </div>

            {/* Main Authentication Card */}
            <div className="mat-card mat-elevation-8 p-10 mb-8 bg-white rounded-lg max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--noaa-primary)' }}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">Sign In to Continue</h3>
                <p className="text-gray-600">
                  Authenticate with your NOAA credentials via Cognito Hosted UI
                </p>
              </div>

              <a
                href="/api/auth/signin"
                className="mat-button mat-button-raised mat-elevation-4 block text-center text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:mat-elevation-8 hover:scale-105"
                style={{ backgroundColor: 'var(--noaa-primary)' }}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In with Cognito
                </span>
              </a>

              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#e3f2fd', borderLeft: '4px solid var(--noaa-primary)' }}>
                <p className="text-sm text-gray-700">
                  <strong>ℹ️ About This Application:</strong> This is a technical Proof of Concept to evaluate Cognito's claim passthrough and Single Logout capabilities. It will never be deployed to production.
                </p>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="mat-card mat-elevation-4 p-6 bg-white rounded-lg hover:mat-elevation-8 transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#e3f2fd' }}>
                  <svg className="w-6 h-6" style={{ color: 'var(--noaa-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--noaa-primary)' }}>Federation Test</h3>
                <p className="text-sm text-gray-600">
                  Verifies redirect to Cognito Hosted UI and upstream IDP integration with Login.gov and Sso.noaa.gov
                </p>
              </div>

              <div className="mat-card mat-elevation-4 p-6 bg-white rounded-lg hover:mat-elevation-8 transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#e3f2fd' }}>
                  <svg className="w-6 h-6" style={{ color: 'var(--noaa-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--noaa-secondary)' }}>Claim Passthrough</h3>
                <p className="text-sm text-gray-600">
                  Tests whether token claims from upstream IDPs are correctly preserved and accessible via Debug Dashboard
                </p>
              </div>

              <div className="mat-card mat-elevation-4 p-6 bg-white rounded-lg hover:mat-elevation-8 transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#e3f2fd' }}>
                  <svg className="w-6 h-6" style={{ color: 'var(--noaa-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--noaa-accent)' }}>Single Logout</h3>
                <p className="text-sm text-gray-600">
                  Evaluates Single Logout (SLO) functionality and session termination across the federation chain
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="mat-card mat-elevation-8 p-10 mb-8 bg-white rounded-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Welcome back!</h2>
            <div className="mb-8 p-6 rounded-lg bg-green-50 border-l-4 border-green-500">
              <p className="text-sm text-gray-700 mb-2">✅ <strong>Authenticated</strong></p>
              <p className="text-lg font-medium text-gray-900">{user?.name || user?.email || 'User'}</p>
              {user?.email && <p className="text-sm text-gray-600">{user.email}</p>}
            </div>

            <div className="space-y-4">
              <Link
                href="/dashboard"
                className="mat-button mat-button-raised block text-center text-white font-semibold py-4 px-8 rounded-lg transition-all"
                style={{ backgroundColor: 'var(--noaa-secondary)' }}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Debug Dashboard
                </span>
              </Link>

              <a
                href="/api/auth/signout"
                className="mat-button block text-center bg-gray-100 text-gray-700 font-semibold py-4 px-8 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Sign Out
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
