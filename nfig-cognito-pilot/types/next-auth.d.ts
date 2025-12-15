/**
 * NextAuth Type Extensions for NFIG Cognito Pilot App
 * 
 * This file extends NextAuth types to include custom properties needed
 * for Cognito integration and token inspection.
 */

import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Extend the Session interface to include Cognito tokens
   * These tokens are needed for the Debug Dashboard to display
   * raw token JSON and claims from different sources.
   */
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
    
    // Cognito tokens for claim inspection
    access_token?: string
    id_token?: string
    refresh_token?: string
    
    // Token metadata
    expires_at?: number
    token_type?: string
    
    // Error handling
    error?: string
  }

  /**
   * Extend the User interface if additional user properties are needed
   */
  interface User extends DefaultUser {
    id: string
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the JWT interface to include Cognito-specific claims
   * and tokens that will be passed through callbacks
   */
  interface JWT extends DefaultJWT {
    // Cognito tokens
    access_token?: string
    id_token?: string
    refresh_token?: string
    
    // Token expiration
    expires_at?: number
    
    // User claims
    sub?: string
    email?: string
    email_verified?: boolean
    
    // Cognito-specific claims
    "cognito:groups"?: string[]
    "cognito:username"?: string
    
    // Error handling
    error?: string
  }
}
