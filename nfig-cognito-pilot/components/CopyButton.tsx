/**
 * Copy Button Component for NFIG Cognito Pilot App
 * 
 * A Material Design button that copies text to clipboard and provides feedback.
 */

'use client'

import { useState } from 'react'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

export default function CopyButton({ text, label = 'Copy', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setError(false)
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      setError(true)
      
      // Reset error after 2 seconds
      setTimeout(() => {
        setError(false)
      }, 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`mat-button mat-button-raised mat-elevation-2 px-4 py-2 rounded transition-all hover:mat-elevation-4 ${className}`}
      style={{
        backgroundColor: copied ? '#4caf50' : error ? '#f44336' : 'var(--noaa-primary)',
        color: 'white'
      }}
      title={copied ? 'Copied!' : error ? 'Failed to copy' : 'Copy to clipboard'}
    >
      {copied ? (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </span>
      ) : error ? (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Failed
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </span>
      )}
    </button>
  )
}
