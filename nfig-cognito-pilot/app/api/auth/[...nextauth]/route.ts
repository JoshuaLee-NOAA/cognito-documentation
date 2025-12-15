/**
 * NextAuth Route Handler for NFIG Cognito Pilot App
 * 
 * This file configures NextAuth v5 with AWS Cognito as the authentication provider.
 * It handles the OAuth2/OIDC flow with Cognito's hosted UI.
 * 
 * Key Features:
 * - CognitoProvider configuration with custom OIDC endpoints
 * - JWT callback to capture and store access_token and id_token
 * - Session callback to pass tokens to client-side
 * - Error handling for authentication failures
 */

import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import { JWT } from "next-auth/jwt"

import {
  COGNITO_ISSUER,
  COGNITO_AUTHORIZATION_ENDPOINT,
  COGNITO_TOKEN_ENDPOINT,
  COGNITO_USERINFO_ENDPOINT,
  SUPPORTED_SCOPES,
} from "@/lib/auth-config"

/**
 * NextAuth configuration
 */
export const authOptions: NextAuthConfig = {
  providers: [
    {
      id: "cognito",
      name: "AWS Cognito",
      type: "oidc",
      
      // Use environment variables for sensitive credentials
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      
      // OIDC Discovery endpoints from our configuration
      issuer: COGNITO_ISSUER,
      authorization: {
        url: COGNITO_AUTHORIZATION_ENDPOINT,
        params: {
          // Request these scopes from Cognito
          scope: SUPPORTED_SCOPES.join(" "), // "openid email phone profile"
        },
      },
      token: COGNITO_TOKEN_ENDPOINT,
      userinfo: COGNITO_USERINFO_ENDPOINT,
      
      // Profile mapping - extract user info from Cognito response
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || profile.email,
          email: profile.email,
          image: profile.picture,
        }
      },
    },
  ],
  
  /**
   * JWT Callback
   * This runs whenever a JWT is created or updated
   * We use it to capture and store the access_token and id_token from Cognito
   * 
   * FR-2: These tokens are needed for the Debug Dashboard to display claims
   */
  callbacks: {
    async jwt({ token, account, profile }) {
      // On initial sign-in, account and profile will be available
      if (account) {
        // Store Cognito tokens in the JWT
        token.access_token = account.access_token
        token.id_token = account.id_token
        token.refresh_token = account.refresh_token
        token.expires_at = account.expires_at
        
        // Store user ID
        token.sub = profile?.sub || account.providerAccountId
      }
      
      return token
    },

    /**
     * Session Callback
     * This runs whenever session is checked (e.g., getSession, useSession)
     * We pass the tokens from JWT to the session so they're available client-side
     * 
     * FR-2: Critical for Debug Dashboard to access tokens
     */
    async session({ session, token }) {
      // Pass tokens to the session
      session.access_token = token.access_token as string
      session.id_token = token.id_token as string
      session.expires_at = token.expires_at as number
      
      // Pass user info
      if (session.user) {
        session.user.id = token.sub as string
      }
      
      // Pass any errors
      if (token.error) {
        session.error = token.error as string
      }
      
      return session
    },
  },
  
  /**
   * Pages Configuration
   * Customize the default NextAuth pages
   */
  pages: {
    // Redirect to home page for sign in (we'll handle it there)
    signIn: "/",
    // Redirect to home page on sign out
    signOut: "/",
    // Custom error page (optional - for now use default)
    // error: "/auth/error",
  },
  
  /**
   * Session Strategy
   * Use JWT for stateless, serverless-compatible sessions
   * FR-4.3: JWT-based session management for load testing
   */
  session: {
    strategy: "jwt",
  },
  
  /**
   * Enable debug mode in development
   */
  debug: process.env.NODE_ENV === "development",
}

/**
 * NextAuth handler for App Router
 * Handles GET and POST requests to /api/auth/*
 */
const { auth, handlers: { GET, POST } } = NextAuth(authOptions)

export { GET, POST, auth }
