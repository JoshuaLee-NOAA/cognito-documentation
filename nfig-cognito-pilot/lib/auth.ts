/**
 * Auth Utilities for NFIG Cognito Pilot App
 * 
 * This file provides helper functions and utilities for authentication,
 * including session management and token extraction.
 */

import NextAuth from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type { Session } from "next-auth"

/**
 * Export the NextAuth instance for server-side session access
 * This is used in Server Components and API Routes
 */
export const { auth, handlers } = NextAuth(authOptions)

/**
 * Export the auth configuration for use in other parts of the app
 * This allows components and API routes to access NextAuth configuration
 */
export { authOptions }

/**
 * Extract the access token from a session
 * 
 * @param session - The NextAuth session object
 * @returns The access token string or null
 */
export function getAccessToken(session: Session | null): string | null {
  if (!session?.access_token) {
    return null
  }
  return session.access_token
}

/**
 * Extract the ID token from a session
 * 
 * @param session - The NextAuth session object
 * @returns The ID token string or null
 */
export function getIdToken(session: Session | null): string | null {
  if (!session?.id_token) {
    return null
  }
  return session.id_token
}

/**
 * Check if a session is valid and not expired
 * 
 * @param session - The NextAuth session object
 * @returns boolean indicating if session is valid
 */
export function isSessionValid(session: Session | null): boolean {
  if (!session) {
    return false
  }
  
  // Check if session has an expiration time
  if (session.expires_at) {
    const now = Math.floor(Date.now() / 1000)
    return now < session.expires_at
  }
  
  // If no expires_at, check the session.expires string
  if (session.expires) {
    const expiresDate = new Date(session.expires)
    return expiresDate.getTime() > Date.now()
  }
  
  // If we can't determine expiration, assume it's valid
  return true
}

/**
 * Get time remaining until session expires
 * 
 * @param session - The NextAuth session object
 * @returns Number of seconds until expiration, or null if can't be determined
 */
export function getSessionTimeRemaining(session: Session | null): number | null {
  if (!session) {
    return null
  }
  
  if (session.expires_at) {
    const now = Math.floor(Date.now() / 1000)
    return Math.max(0, session.expires_at - now)
  }
  
  if (session.expires) {
    const expiresDate = new Date(session.expires)
    const timeRemaining = expiresDate.getTime() - Date.now()
    return Math.max(0, Math.floor(timeRemaining / 1000))
  }
  
  return null
}

/**
 * Extract user information from session
 * 
 * @param session - The NextAuth session object
 * @returns User object or null
 */
export function getUser(session: Session | null) {
  if (!session?.user) {
    return null
  }
  return session.user
}

/**
 * Check if user is authenticated
 * 
 * @param session - The NextAuth session object
 * @returns boolean indicating if user is authenticated
 */
export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user && isSessionValid(session)
}

/**
 * Decode a JWT token without verification
 * IMPORTANT: This is for display purposes only in the Debug Dashboard
 * Do NOT use for security-critical operations
 * 
 * @param token - The JWT token string
 * @returns Decoded token payload or null
 */
export function decodeJWT(token: string | null | undefined): any {
  if (!token) {
    return null
  }
  
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }
    
    // Decode the payload (second part)
    const payload = parts[1]
    const decoded = Buffer.from(payload, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

/**
 * Extract claims from ID token
 * 
 * @param session - The NextAuth session object
 * @returns Decoded ID token claims or null
 */
export function getIdTokenClaims(session: Session | null): any {
  const idToken = getIdToken(session)
  return decodeJWT(idToken)
}

/**
 * Extract claims from access token
 * 
 * @param session - The NextAuth session object
 * @returns Decoded access token claims or null
 */
export function getAccessTokenClaims(session: Session | null): any {
  const accessToken = getAccessToken(session)
  return decodeJWT(accessToken)
}
