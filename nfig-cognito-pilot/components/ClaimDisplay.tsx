/**
 * Claim Display Component for NFIG Cognito Pilot App
 * 
 * Displays claims from ID token, access token, or userinfo endpoint
 * in a readable table format with source labels.
 */

'use client'

interface ClaimDisplayProps {
  claims: any
  source: 'ID Token' | 'Access Token' | 'UserInfo'
  highlightClaims?: string[] // Claims to highlight (e.g., email, sub, groups)
}

export default function ClaimDisplay({ 
  claims, 
  source,
  highlightClaims = ['email', 'sub', 'cognito:groups', 'groups'] 
}: ClaimDisplayProps) {
  if (!claims || Object.keys(claims).length === 0) {
    return (
      <div className="mat-card mat-elevation-4 p-6 bg-white rounded-lg">
        <div className="flex items-center gap-2 mb-4">
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
          <h3 className="mat-h6" style={{ color: 'var(--noaa-primary)' }}>
            Claims
          </h3>
        </div>
        <p className="text-sm text-gray-600">No claims available</p>
      </div>
    )
  }

  const claimEntries = Object.entries(claims).sort(([a], [b]) => a.localeCompare(b))
  
  // Separate important claims from others
  const importantClaims = claimEntries.filter(([key]) => highlightClaims.includes(key))
  const otherClaims = claimEntries.filter(([key]) => !highlightClaims.includes(key))

  const renderClaimValue = (value: any): string => {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    if (typeof value === 'boolean') return value.toString()
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    return String(value)
  }

  const renderClaim = ([key, value]: [string, any], isImportant = false) => (
    <tr 
      key={key}
      className={`border-b border-gray-100 ${isImportant ? 'bg-blue-50' : ''}`}
    >
      <td className="py-3 px-4 align-top">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-gray-900">{key}</span>
          {isImportant && (
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
        </div>
        <span className="text-xs text-gray-500">{typeof value}</span>
      </td>
      <td className="py-3 px-4">
        <pre className="font-mono text-sm text-gray-900 whitespace-pre-wrap break-all">
          {renderClaimValue(value)}
        </pre>
      </td>
    </tr>
  )

  return (
    <div className="mat-card mat-elevation-4 bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
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
          <h3 className="mat-h6" style={{ color: 'var(--noaa-primary)' }}>
            Claims ({claimEntries.length})
          </h3>
        </div>
        {importantClaims.length > 0 && (
          <p className="text-xs text-gray-600">
            <svg className="w-4 h-4 inline text-blue-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Important claims highlighted
          </p>
        )}
      </div>

      {/* Claims Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Claim Name</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Value</th>
            </tr>
          </thead>
          <tbody>
            {/* Important claims first */}
            {importantClaims.map(entry => renderClaim(entry, true))}
            
            {/* Other claims */}
            {otherClaims.map(entry => renderClaim(entry, false))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
