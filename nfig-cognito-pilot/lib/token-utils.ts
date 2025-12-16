/**
 * Token Utilities for NFIG Cognito Pilot App
 * 
 * Utility functions for parsing, decoding, and formatting JWT tokens
 * for display in the Debug Dashboard.
 * 
 * IMPORTANT: These functions are for DISPLAY ONLY and do NOT perform
 * cryptographic verification. Never use for security-critical operations.
 */

/**
 * Decode JWT payload
 * 
 * @param token - The JWT token string
 * @returns Decoded token payload or null
 */
export function decodeJWT(token: string | null | undefined): Record<string, unknown> | null {
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
    
    // Handle URL-safe base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = Buffer.from(base64, 'base64').toString('utf-8')
    
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

/**
 * Decode JWT header
 * 
 * @param token - The JWT token string
 * @returns Decoded token header or null
 */
export function decodeJWTHeader(token: string | null | undefined): Record<string, unknown> | null {
  if (!token) {
    return null
  }
  
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }
    
    // Decode the header (first part)
    const header = parts[0]
    const base64 = header.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = Buffer.from(base64, 'base64').toString('utf-8')
    
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Error decoding JWT header:', error)
    return null
  }
}

/**
 * Extract claims from a JWT token
 * 
 * @param token - The JWT token string
 * @returns Object with decoded claims or null
 */
export function extractClaims(token: string | null | undefined): Record<string, unknown> | null {
  return decodeJWT(token)
}

/**
 * Format a Unix timestamp to human-readable date string
 * 
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted date string
 */
export function formatTimestamp(timestamp: number | undefined): string {
  if (!timestamp) {
    return 'N/A'
  }
  
  try {
    const date = new Date(timestamp * 1000) // Convert seconds to milliseconds
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

/**
 * Calculate time remaining until token expiration
 * 
 * @param exp - Expiration timestamp in seconds
 * @returns Object with time remaining in various units
 */
export function getTimeRemaining(exp: number | undefined): {
  total: number
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
  isExpiringSoon: boolean // Less than 5 minutes
} {
  if (!exp) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      isExpiringSoon: false
    }
  }
  
  const now = Math.floor(Date.now() / 1000) // Current time in seconds
  const total = exp - now
  
  if (total <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      isExpiringSoon: false
    }
  }
  
  const days = Math.floor(total / (60 * 60 * 24))
  const hours = Math.floor((total % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((total % (60 * 60)) / 60)
  const seconds = total % 60
  
  return {
    total,
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    isExpiringSoon: total < 300 // Less than 5 minutes
  }
}

/**
 * Format time remaining in human-readable string
 * 
 * @param exp - Expiration timestamp in seconds
 * @returns Formatted string like "2h 30m 15s" or "Expired"
 */
export function formatTimeRemaining(exp: number | undefined): string {
  const remaining = getTimeRemaining(exp)
  
  if (remaining.isExpired) {
    return 'Expired'
  }
  
  const parts: string[] = []
  
  if (remaining.days > 0) {
    parts.push(`${remaining.days}d`)
  }
  if (remaining.hours > 0) {
    parts.push(`${remaining.hours}h`)
  }
  if (remaining.minutes > 0) {
    parts.push(`${remaining.minutes}m`)
  }
  if (remaining.seconds > 0 || parts.length === 0) {
    parts.push(`${remaining.seconds}s`)
  }
  
  return parts.join(' ')
}

/**
 * Validate JWT token structure
 * 
 * @param token - The JWT token string
 * @returns Object with validation result and any errors
 */
export function validateTokenStructure(token: string | null | undefined): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (!token) {
    errors.push('Token is null or undefined')
    return { isValid: false, errors }
  }
  
  if (typeof token !== 'string') {
    errors.push('Token must be a string')
    return { isValid: false, errors }
  }
  
  const parts = token.split('.')
  if (parts.length !== 3) {
    errors.push(`Token must have 3 parts (header.payload.signature), found ${parts.length}`)
    return { isValid: false, errors }
  }
  
  // Try to decode header
  try {
    decodeJWTHeader(token)
  } catch (error) {
    errors.push('Failed to decode token header')
  }
  
  // Try to decode payload
  try {
    const payload = decodeJWT(token)
    if (!payload) {
      errors.push('Failed to decode token payload')
    }
  } catch (error) {
    errors.push('Failed to decode token payload')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Pretty print JSON with indentation
 * 
 * @param obj - Object to stringify
 * @param indent - Number of spaces for indentation
 * @returns Formatted JSON string
 */
export function prettyPrintJSON(obj: Record<string, unknown> | unknown[] | unknown, indent: number = 2): string {
  try {
    return JSON.stringify(obj, null, indent)
  } catch (error) {
    return 'Error formatting JSON'
  }
}
