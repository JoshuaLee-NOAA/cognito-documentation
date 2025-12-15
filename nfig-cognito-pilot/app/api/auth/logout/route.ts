/**
 * Custom Logout Handler for Cognito Single Logout (SLO)
 * 
 * This endpoint handles logout by:
 * 1. Clearing the local NextAuth session
 * 2. Redirecting to Cognito's end_session_endpoint to terminate the Cognito session
 * 3. Returning user to the app after logout
 * 
 * FR-3.2: Clicking "Sign Out" must clear the local application session
 * FR-3.3: Must redirect to Cognito end_session_endpoint
 * FR-3.4: Must include proper redirect parameters
 */

import { NextRequest, NextResponse } from "next/server";
import { COGNITO_END_SESSION_ENDPOINT } from "@/lib/auth-config";

export async function GET(request: NextRequest) {
  // Get the client ID from environment
  const clientId = process.env.COGNITO_CLIENT_ID;
  
  // Define the post-logout redirect URI (where user returns after logout)
  const postLogoutRedirectUri = `${request.nextUrl.origin}`;
  
  // Build the Cognito end_session_endpoint URL
  // Format: https://[domain]/logout?client_id=[id]&logout_uri=[uri]
  const cognitoLogoutUrl = `${COGNITO_END_SESSION_ENDPOINT}?` +
    `client_id=${encodeURIComponent(clientId || '')}&` +
    `logout_uri=${encodeURIComponent(postLogoutRedirectUri)}`;
  
  // First, clear the NextAuth session by redirecting to NextAuth's signout
  // Then redirect to Cognito logout
  // Note: NextAuth's signout will clear cookies and session
  const nextAuthSignoutUrl = `/api/auth/signout?callbackUrl=${encodeURIComponent(cognitoLogoutUrl)}`;
  
  return NextResponse.redirect(new URL(nextAuthSignoutUrl, request.url));
}
