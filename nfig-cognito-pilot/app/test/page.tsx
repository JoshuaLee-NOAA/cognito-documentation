/**
 * Diagnostic Test Page for NFIG Cognito Pilot
 * 
 * This page displays configuration details and provides tools to test
 * the Cognito integration and diagnose authentication issues.
 */

import {
  COGNITO_ISSUER,
  COGNITO_AUTHORIZATION_ENDPOINT,
  COGNITO_TOKEN_ENDPOINT,
  COGNITO_USERINFO_ENDPOINT,
  COGNITO_END_SESSION_ENDPOINT,
  COGNITO_JWKS_URI,
  SUPPORTED_SCOPES,
} from "@/lib/auth-config";

export default function TestPage() {
  // Build the OAuth URL with current configuration
  const clientId = process.env.COGNITO_CLIENT_ID;
  const redirectUri = "http://localhost:3000/api/auth/callback/cognito";
  const scope = SUPPORTED_SCOPES.join(" ");
  
  const oauthUrl = `${COGNITO_AUTHORIZATION_ENDPOINT}?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scope)}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🔧 Cognito Integration Diagnostic
          </h1>
          <p className="text-gray-600">
            This page displays configuration details and tests Cognito endpoints.
          </p>
        </div>

        {/* Configuration Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 Current Configuration
          </h2>
          
          <div className="space-y-3">
            <ConfigItem
              label="Client ID"
              value={clientId || "NOT SET"}
              isSensitive={false}
            />
            <ConfigItem
              label="Issuer"
              value={COGNITO_ISSUER}
              isSensitive={false}
            />
            <ConfigItem
              label="Authorization Endpoint"
              value={COGNITO_AUTHORIZATION_ENDPOINT}
              isSensitive={false}
            />
            <ConfigItem
              label="Token Endpoint"
              value={COGNITO_TOKEN_ENDPOINT}
              isSensitive={false}
            />
            <ConfigItem
              label="UserInfo Endpoint"
              value={COGNITO_USERINFO_ENDPOINT}
              isSensitive={false}
            />
            <ConfigItem
              label="End Session Endpoint"
              value={COGNITO_END_SESSION_ENDPOINT}
              isSensitive={false}
            />
            <ConfigItem
              label="JWKS URI"
              value={COGNITO_JWKS_URI}
              isSensitive={false}
            />
            <ConfigItem
              label="Requested Scopes"
              value={SUPPORTED_SCOPES.join(", ")}
              isSensitive={false}
            />
            <ConfigItem
              label="Callback URL"
              value={redirectUri}
              isSensitive={false}
            />
          </div>
        </div>

        {/* Generated OAuth URL */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🔗 Generated OAuth URL
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            This is the exact URL NextAuth will redirect to:
          </p>
          
          <div className="bg-gray-100 p-4 rounded border border-gray-300 mb-4 break-all text-sm font-mono">
            {oauthUrl}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigator.clipboard.writeText(oauthUrl)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              📋 Copy URL
            </button>
            <a
              href={oauthUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition inline-block"
            >
              🚀 Test in New Tab
            </a>
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            ⚠️ Testing in new tab will fail without PKCE, but you'll see the exact error from Cognito
          </p>
        </div>

        {/* Endpoint Tests */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🧪 Test Cognito Endpoints
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Click to test if each endpoint is reachable:
          </p>
          
          <div className="space-y-2">
            <TestEndpointLink
              name="OIDC Discovery"
              url={`${COGNITO_ISSUER}/.well-known/openid-configuration`}
            />
            <TestEndpointLink
              name="JWKS Keys"
              url={COGNITO_JWKS_URI}
            />
            <TestEndpointLink
              name="Authorization Endpoint"
              url={COGNITO_AUTHORIZATION_ENDPOINT}
              note="Will show login page or error"
            />
          </div>
        </div>

        {/* Diagnostic API Test */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🔍 Run Diagnostic Test
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Test connectivity to Cognito endpoints from the server:
          </p>
          
          <a
            href="/api/test/cognito"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition inline-block"
          >
            🏥 Run Server-Side Diagnostic
          </a>
          
          <p className="text-xs text-gray-500 mt-3">
            Opens in new tab with JSON results
          </p>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

// Helper component for configuration items
function ConfigItem({ 
  label, 
  value, 
  isSensitive = false 
}: { 
  label: string; 
  value: string; 
  isSensitive?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 border-b border-gray-200 pb-2">
      <span className="font-medium text-gray-700 min-w-[200px]">
        {label}:
      </span>
      <span className={`font-mono text-sm ${isSensitive ? 'text-red-600' : 'text-gray-900'} break-all`}>
        {isSensitive ? '••••••••' : value}
      </span>
    </div>
  );
}

// Helper component for test endpoint links
function TestEndpointLink({ 
  name, 
  url, 
  note 
}: { 
  name: string; 
  url: string; 
  note?: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
      <div>
        <div className="font-medium text-gray-900">{name}</div>
        {note && <div className="text-xs text-gray-500">{note}</div>}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
      >
        Test →
      </a>
    </div>
  );
}
