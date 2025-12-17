/**
 * Token Display Component for NFIG Cognito Pilot App
 * 
 * Displays raw JWT token JSON with syntax highlighting and copy functionality.
 * Supports expandable/collapsible view.
 */

'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CopyButton from './CopyButton'
import { prettyPrintJSON } from '@/lib/token-utils'

interface TokenDisplayProps {
  token: string | undefined
  claims: any
  title: string
  source: 'ID Token' | 'Access Token' | 'UserInfo'
}

export default function TokenDisplay({ token, claims, title, source }: TokenDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  if (!token && !claims) {
    return (
      <div className="mat-card mat-elevation-4 p-6 bg-white rounded-lg">
        <h3 className="mat-h6 mb-4" style={{ color: 'var(--noaa-primary)' }}>
          {title}
        </h3>
        <p className="text-sm text-gray-600">No token data available</p>
        <p className="text-xs text-gray-500 mt-2">
          Make sure you're authenticated and the session includes this token.
        </p>
      </div>
    )
  }

  const jsonString = prettyPrintJSON(claims)

  return (
    <div className="mat-card mat-elevation-4 bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg 
              className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div 
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ 
              backgroundColor: source === 'ID Token' ? '#e3f2fd' : 
                             source === 'Access Token' ? '#f3e5f5' : '#e8f5e9',
              color: source === 'ID Token' ? 'var(--noaa-primary)' : 
                     source === 'Access Token' ? 'var(--noaa-secondary)' : 'var(--noaa-accent)'
            }}
          >
            {source}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {token && <CopyButton text={token} label="Token" />}
          {claims && <CopyButton text={jsonString} label="JSON" />}
        </div>
      </div>

      {/* Token Display */}
      {isExpanded && (
        <div className="relative">
          {/* Raw Token (truncated) */}
          {token && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-2">RAW TOKEN (JWT)</p>
              <div className="font-mono text-xs text-gray-800 break-all bg-white p-3 rounded border border-gray-200 max-h-32 overflow-auto">
                {token}
              </div>
            </div>
          )}

          {/* Decoded JSON with Syntax Highlighting */}
          {claims && (
            <div className="relative">
              <div className="absolute top-2 right-2 z-10">
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                  JSON
                </span>
              </div>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: '13px',
                  maxHeight: '500px'
                }}
                showLineNumbers={true}
                wrapLines={true}
              >
                {jsonString}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      )}

      {/* Collapsed State */}
      {!isExpanded && (
        <div className="p-4 text-center text-sm text-gray-500">
          <p>Click to expand and view token details</p>
        </div>
      )}
    </div>
  )
}
