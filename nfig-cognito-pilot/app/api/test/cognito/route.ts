/**
 * Server-Side Cognito Diagnostic API
 * 
 * Tests connectivity to Cognito endpoints and returns diagnostic information
 */

import { NextResponse } from "next/server";
import {
  COGNITO_ISSUER,
  COGNITO_AUTHORIZATION_ENDPOINT,
  COGNITO_TOKEN_ENDPOINT,
  COGNITO_USERINFO_ENDPOINT,
  COGNITO_END_SESSION_ENDPOINT,
  COGNITO_JWKS_URI,
  SUPPORTED_SCOPES,
} from "@/lib/auth-config";

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    configuration: {
      clientId: process.env.COGNITO_CLIENT_ID ? "SET" : "NOT SET",
      clientSecret: process.env.COGNITO_CLIENT_SECRET ? "SET" : "NOT SET",
      issuer: COGNITO_ISSUER,
      scopes: SUPPORTED_SCOPES,
    },
    tests: {},
  };

  // Test 1: OIDC Discovery Endpoint
  try {
    const discoveryUrl = `${COGNITO_ISSUER}/.well-known/openid-configuration`;
    const response = await fetch(discoveryUrl);
    results.tests.oidcDiscovery = {
      url: discoveryUrl,
      status: response.status,
      statusText: response.statusText,
      success: response.ok,
    };
    
    if (response.ok) {
      const data = await response.json();
      results.tests.oidcDiscovery.data = data;
    } else {
      results.tests.oidcDiscovery.error = await response.text();
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    results.tests.oidcDiscovery = {
      success: false,
      error: errorMessage,
    };
  }

  // Test 2: JWKS Endpoint
  try {
    const response = await fetch(COGNITO_JWKS_URI);
    results.tests.jwks = {
      url: COGNITO_JWKS_URI,
      status: response.status,
      statusText: response.statusText,
      success: response.ok,
    };
    
    if (response.ok) {
      const data = await response.json();
      results.tests.jwks.keyCount = data.keys?.length || 0;
    } else {
      results.tests.jwks.error = await response.text();
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    results.tests.jwks = {
      success: false,
      error: errorMessage,
    };
  }

  // Test 3: Authorization Endpoint (HEAD request)
  try {
    const response = await fetch(COGNITO_AUTHORIZATION_ENDPOINT, {
      method: "HEAD",
    });
    results.tests.authorizationEndpoint = {
      url: COGNITO_AUTHORIZATION_ENDPOINT,
      status: response.status,
      statusText: response.statusText,
      success: response.status < 500, // Any response < 500 means endpoint exists
      note: "HEAD request - any non-5xx response means endpoint is reachable",
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    results.tests.authorizationEndpoint = {
      success: false,
      error: errorMessage,
    };
  }

  // Test 4: Token Endpoint (OPTIONS request for CORS)
  try {
    const response = await fetch(COGNITO_TOKEN_ENDPOINT, {
      method: "OPTIONS",
    });
    results.tests.tokenEndpoint = {
      url: COGNITO_TOKEN_ENDPOINT,
      status: response.status,
      statusText: response.statusText,
      success: response.status < 500,
      note: "OPTIONS request - testing endpoint availability",
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    results.tests.tokenEndpoint = {
      success: false,
      error: errorMessage,
    };
  }

  // Test 5: Domain Reachability
  try {
    const domain = new URL(COGNITO_AUTHORIZATION_ENDPOINT).origin;
    const response = await fetch(domain);
    results.tests.domainReachability = {
      url: domain,
      status: response.status,
      statusText: response.statusText,
      success: true, // If we get any response, domain is reachable
      note: "Testing if Cognito domain responds",
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    results.tests.domainReachability = {
      success: false,
      error: errorMessage,
    };
  }

  // Test 6: OAuth URL Generation
  const clientId = process.env.COGNITO_CLIENT_ID;
  const redirectUri = "http://localhost:3000/api/auth/callback/cognito";
  const scope = SUPPORTED_SCOPES.join(" ");
  
  results.tests.oauthUrlGeneration = {
    success: !!clientId,
    generatedUrl: clientId ? 
      `${COGNITO_AUTHORIZATION_ENDPOINT}?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}`
      : "Cannot generate - CLIENT_ID not set",
    note: "This is the URL NextAuth will redirect to",
  };

  // Summary
  const allTests = Object.values(results.tests);
  const successCount = allTests.filter((t: any) => t.success).length;
  const totalTests = allTests.length;
  
  results.summary = {
    totalTests,
    successfulTests: successCount,
    failedTests: totalTests - successCount,
    overallStatus: successCount === totalTests ? "PASS" : "PARTIAL_PASS",
  };

  // Add recommendations based on test results
  results.recommendations = [];
  
  if (!results.tests.oidcDiscovery?.success) {
    results.recommendations.push({
      priority: "HIGH",
      message: "OIDC Discovery endpoint is not accessible. This is a critical issue.",
      action: "Verify the issuer URL is correct and the Cognito User Pool exists.",
    });
  }
  
  if (!results.tests.jwks?.success) {
    results.recommendations.push({
      priority: "HIGH",
      message: "JWKS endpoint is not accessible. Token validation will fail.",
      action: "Check if the User Pool is active and the JWKS URI is correct.",
    });
  }
  
  if (!results.tests.domainReachability?.success) {
    results.recommendations.push({
      priority: "CRITICAL",
      message: "Cognito domain is not reachable.",
      action: "Check network connectivity and verify the domain name is correct.",
    });
  }
  
  if (!clientId) {
    results.recommendations.push({
      priority: "CRITICAL",
      message: "Client ID is not configured.",
      action: "Set COGNITO_CLIENT_ID in .env.local",
    });
  }
  
  if (results.recommendations.length === 0) {
    results.recommendations.push({
      priority: "INFO",
      message: "All technical tests passed. Configuration appears correct.",
      action: "If authentication still fails, the issue is likely in AWS Cognito App Client settings (Hosted UI not enabled or identity providers not assigned).",
    });
  }

  return NextResponse.json(results, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
