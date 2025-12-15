/**
 * NFIG Cognito Pilot App - Home Page
 * 
 * Simple sign-in/sign-out page
 */

import Link from "next/link";

export default function Home() {
  const isAuthenticated = false // TODO: Get from session
  const user: { name?: string; email?: string } | null = null // TODO: Get from session

  return (
    <div className="h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e9f0 100%)' }}>
      <div className="w-full max-w-lg px-6">
        {!isAuthenticated ? (
          <div className="mat-card mat-elevation-8 bg-white rounded-lg overflow-hidden">
            {/* Card Header with branding */}
            <div className="px-8 pt-6 pb-4 border-b border-gray-100 text-center">
              <div className="mb-2">
                <h1 className="text-lg font-semibold text-gray-900">NFIG Cognito Pilot</h1>
                <p className="text-xs text-gray-500">Test Environment</p>
              </div>
              {/* Status indicator */}
              <div className="flex items-center justify-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <span className="text-gray-600">Not Authenticated</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--noaa-primary)' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900">Sign in to continue</h2>
              <p className="text-sm text-gray-600 mb-6">Authenticate with NOAA credentials via Cognito</p>

              <a
                href="/api/auth/signin"
                className="mat-button mat-button-raised mat-elevation-4 flex items-center justify-center text-white font-semibold py-3 px-6 rounded-lg transition-all hover:mat-elevation-8"
                style={{ backgroundColor: 'var(--noaa-primary)' }}
              >
                Sign In with Cognito
              </a>
            </div>
          </div>
        ) : (
          <div className="mat-card mat-elevation-8 bg-white rounded-lg overflow-hidden">
            {/* Card Header with branding */}
            <div className="px-8 pt-6 pb-4 border-b border-gray-100 text-center">
              <div className="mb-2">
                <h1 className="text-lg font-semibold text-gray-900">NFIG Cognito Pilot</h1>
                <p className="text-xs text-gray-500">Test Environment</p>
              </div>
              {/* Status indicator */}
              <div className="flex items-center justify-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Authenticated</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-4 text-center">Welcome back!</h2>
              <div className="mb-6 p-4 rounded-lg bg-green-50 border-l-4 border-green-500">
                <p className="text-sm mb-1">✅ <strong>Signed in as:</strong></p>
                <p className="font-medium">{(user as any)?.name || (user as any)?.email || 'User'}</p>
                {(user as any)?.email && <p className="text-sm text-gray-600">{(user as any).email}</p>}
              </div>

              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="mat-button mat-button-raised block text-center text-white font-semibold py-3 px-6 rounded-lg"
                  style={{ backgroundColor: 'var(--noaa-secondary)' }}
                >
                  View Debug Dashboard
                </Link>
                <a
                  href="/api/auth/logout"
                  className="mat-button block text-center bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200"
                >
                  Sign Out
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Diagnostic Tools Link */}
        <div className="mt-4 text-center">
          <Link
            href="/test"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            🔧 Diagnostic Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
