/**
 * Debug Dashboard for NFIG Cognito Pilot App
 * 
 * This is the CRITICAL component for the PoC - it allows testing of
 * Cognito's claim passthrough from upstream IDPs.
 * 
 * Features:
 * - Displays raw ID token and access token JSON
 * - Shows decoded claims from each source
 * - Displays token metadata (expiration, issuer, etc.)
 * - Copy-to-clipboard functionality
 * - Syntax highlighting for JSON
 */

import { auth } from '@/lib/auth'
import { decodeJWT } from '@/lib/token-utils'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import TokenDisplay from '@/components/TokenDisplay'
import TokenMetadata from '@/components/TokenMetadata'
import ClaimDisplay from '@/components/ClaimDisplay'

export default async function DashboardPage() {
  // Get session server-side
  const session = await auth()

  // Redirect if not authenticated
  if (!session || !session.user) {
    redirect('/')
  }

  // Extract tokens from session
  const idToken = session.id_token
  const accessToken = session.access_token

  // Decode tokens
  const idTokenClaims = decodeJWT(idToken)
  const accessTokenClaims = decodeJWT(accessToken)

  // Note: UserInfo endpoint would require a separate API call
  // For now, we'll use ID token claims as a proxy since NextAuth
  // already fetches userinfo during authentication
  const userInfoClaims = session.user

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e9f0 100%)' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 mat-elevation-2">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mat-h4" style={{ color: 'var(--noaa-primary)' }}>
                Debug Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Token Inspection & Claim Verification
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {session.user?.name || session.user?.email || 'User'}
                </p>
                <p className="text-xs text-gray-500">Authenticated</p>
              </div>
              <Link
                href="/"
                className="mat-button px-4 py-2 rounded text-sm font-semibold transition-colors"
                style={{ 
                  backgroundColor: 'var(--noaa-secondary)',
                  color: 'white'
                }}
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Introduction Card */}
        <div className="mat-card mat-elevation-4 p-6 bg-white rounded-lg mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--noaa-primary)' }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="mat-h6 mb-2" style={{ color: 'var(--noaa-primary)' }}>
                Welcome to the Debug Dashboard
              </h2>
              <p className="text-sm text-gray-700 mb-3">
                This dashboard displays raw tokens and decoded claims from your Cognito authentication session. 
                Use this to verify whether Cognito is correctly passing through claims from the upstream IdP 
                (Login.gov or Sso.noaa.gov).
              </p>
              <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold mb-1">Testing Claim Passthrough</p>
                  <p>
                    Look for attributes like <code className="bg-white px-1 py-0.5 rounded font-mono">email</code>, 
                    <code className="bg-white px-1 py-0.5 rounded font-mono mx-1">cognito:groups</code>, and custom claims. 
                    Compare what's in the ID token vs. access token to understand what Cognito is forwarding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Token Metadata Section */}
        <div className="mb-6">
          <h2 className="mat-h5 mb-4" style={{ color: 'var(--noaa-primary)' }}>
            Token Metadata
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TokenMetadata claims={idTokenClaims} tokenType="ID Token" />
            <TokenMetadata claims={accessTokenClaims} tokenType="Access Token" />
          </div>
        </div>

        {/* Raw Tokens Section */}
        <div className="mb-6">
          <h2 className="mat-h5 mb-4" style={{ color: 'var(--noaa-primary)' }}>
            Raw Tokens & JSON
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TokenDisplay 
              token={idToken}
              claims={idTokenClaims}
              title="ID Token"
              source="ID Token"
            />
            <TokenDisplay 
              token={accessToken}
              claims={accessTokenClaims}
              title="Access Token"
              source="Access Token"
            />
          </div>
        </div>

        {/* Claims Comparison Section */}
        <div className="mb-6">
          <h2 className="mat-h5 mb-4" style={{ color: 'var(--noaa-primary)' }}>
            Claims by Source
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ClaimDisplay 
              claims={idTokenClaims}
              source="ID Token"
            />
            <ClaimDisplay 
              claims={accessTokenClaims}
              source="Access Token"
            />
          </div>
        </div>

        {/* UserInfo Section */}
        <div className="mb-6">
          <h2 className="mat-h5 mb-4" style={{ color: 'var(--noaa-primary)' }}>
            User Information
          </h2>
          <ClaimDisplay 
            claims={userInfoClaims}
            source="UserInfo"
          />
        </div>

        {/* Testing Notes */}
        <div className="mat-card mat-elevation-2 p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">
              <p className="font-semibold text-gray-900 mb-2">Integration LOE Testing Notes</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Use the "Copy" buttons to export tokens for external analysis</li>
                <li>Compare claim counts and values between ID and access tokens</li>
                <li>Check if group membership or custom attributes are present</li>
                <li>Note any claims that are missing or incorrectly formatted</li>
                <li>Document the integration effort required to extract these claims</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
