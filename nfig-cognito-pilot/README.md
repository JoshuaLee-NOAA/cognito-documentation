# Cognito Reference Implementation

## TL;DR

Working Next.js app demonstrating AWS Cognito integration with Login.gov for NOAA's federated identity initiative. Includes debug dashboard for token inspection, diagnostic tools for troubleshooting, and single logout implementation. **Tested Result: 100% claim passthrough** from Login.gov through Cognito to application.

**Use this as a reference implementation for your Cognito integration.**

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local

# 3. Add your credentials to .env.local
# (Get Client ID & Secret from NOAA Cognito admin)

# 4. Run the app
npm run dev

# 5. Open browser
open http://localhost:3000
```

**That's it!** Click "Sign In" to test authentication.

---

## What's Included

### 🔐 Authentication
- OIDC integration with AWS Cognito
- Federation to Login.gov (SAML → OIDC conversion)
- NextAuth.js v5 implementation
- Single Logout (SLO) flow

### 🔍 Debug Dashboard (`/dashboard`)
- View raw ID Token & Access Token
- Inspect all claims and metadata
- Compare token contents
- Copy tokens for external analysis

### 🛠️ Diagnostic Tools (`/test`)
- Verify configuration
- Test endpoint connectivity
- Generate OAuth URLs
- Server-side diagnostics
- **Use this first when troubleshooting!**

### 🛡️ Security Features
- Route protection middleware
- No secrets in code
- Proper `.gitignore` configuration

---

## Environment Configuration

### Required Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Source | Example | Notes |
|----------|--------|---------|-------|
| `COGNITO_CLIENT_ID` | AWS Console | `5q5mnevpmi...` | Your app client ID |
| `COGNITO_CLIENT_SECRET` | AWS Console | `xxxxx` | Keep secret! |
| `COGNITO_ISSUER` | OIDC Discovery | `https://cognito-idp...` | Token issuer URL |
| `COGNITO_DOMAIN` | AWS Console | `your-domain.auth...` | Cognito hosted UI domain |
| `NEXTAUTH_SECRET` | Generate locally | Run: `openssl rand -base64 32` | Session encryption |
| `NEXTAUTH_URL` | Your setup | `http://localhost:3000` | App base URL |

### OIDC Endpoints (Public)

```json
{
  "issuer": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_8KX012Qnq",
  "authorization_endpoint": "https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com/oauth2/authorize",
  "token_endpoint": "https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com/oauth2/token",
  "userinfo_endpoint": "https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com/oauth2/userInfo",
  "end_session_endpoint": "https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com/logout",
  "jwks_uri": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_8KX012Qnq/.well-known/jwks.json"
}
```

---

## Key Learnings

### ✅ What Works Well

**Claim Passthrough**: 100% of Login.gov claims successfully passed through
- ✅ `custom:ial` - Identity Assurance Level
- ✅ `custom:aal` - Authentication Assurance Level
- ✅ `email`, `sub`, `cognito:groups`
- ✅ Full identity chain in `identities` claim

**Integration Complexity**: Minimal - standard OIDC patterns work
- No Cognito-specific code required
- Uses NextAuth.js standard `CognitoProvider`
- Stack-agnostic approach

**Single Logout**: Works as expected
- Local session clears
- Cognito session terminates
- Requires manual redirect back to app

### ⚠️ Known Issues

**Login.gov Sandbox CSP Warning**
- **Error**: "Sending form data to SAML endpoint violates Content Security Policy"
- **Impact**: Cosmetic only - authentication completes successfully
- **Workaround**: Manually navigate back to app after seeing error
- **Production**: May not occur with production Login.gov (untested)

**Custom Claim Namespacing**
- SAML attributes get `custom:` prefix (e.g., `custom:ial` not `ial`)
- Simple string prefix handling needed in application code

---

## Project Structure

```
nfig-cognito-pilot/
├── app/
│   ├── api/auth/[...nextauth]/  # NextAuth configuration
│   ├── api/auth/logout/         # Custom SLO handler
│   ├── api/test/cognito/        # Diagnostic API
│   ├── dashboard/               # Token inspection UI
│   ├── test/                    # Diagnostic page
│   └── page.tsx                 # Home page
├── components/                  # Reusable React components
├── lib/                         # Auth configuration & utilities
├── types/                       # TypeScript definitions
├── .env.example                 # Environment template
└── docs/                        # Additional documentation
```

---

## Troubleshooting

### Authentication Fails

**Check Cognito Configuration**:
1. Visit `/test` page for diagnostics
2. Verify all endpoints return 200 or expected responses
3. Confirm callback URL is registered: `http://localhost:3000/api/auth/callback/cognito`

**Common Issues**:
- ❌ Hosted UI not enabled → Enable in AWS Console
- ❌ Identity providers not assigned → Assign Login.gov to app client
- ❌ Wrong Client ID/Secret → Verify credentials

### "Invalid credentials" Error

- Double-check `COGNITO_CLIENT_ID` and `COGNITO_CLIENT_SECRET`
- Ensure no extra spaces or characters
- Verify credentials are for correct environment

### Session Not Persisting

- Verify `NEXTAUTH_SECRET` is set (run `openssl rand -base64 32`)
- Check `NEXTAUTH_URL` matches your running server
- Clear browser cookies and try again

### Can't Access Dashboard

- Are you signed in? Check home page for "Authenticated" status
- Try accessing home page first, then navigate to `/dashboard`
- Check browser console for errors

---

## Security Best Practices

⚠️ **NEVER commit real credentials to this repository!**

- ✅ `.env.local` is in `.gitignore`
- ✅ Use placeholder values in documentation
- ✅ Rotate secrets if accidentally exposed
- ✅ Use environment-specific credentials
- ❌ Never screenshot real tokens

---

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Auth**: NextAuth.js v5 (beta)
- **Styling**: Tailwind CSS
- **Node**: 18+

---

## Additional Resources

- **Evaluation Report**: See `docs/EVALUATION-REPORT.md` for pilot test results
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)

---

## Questions or Issues?

Contact the NOAA NFIG team or refer to the evaluation report in `docs/` for detailed findings.

---

**Last Updated**: December 16, 2025  
**Maintainer**: NOAA NFIG Team  
**Status**: Reference Implementation
