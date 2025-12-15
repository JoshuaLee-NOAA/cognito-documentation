# NFIG Cognito Pilot App

⚠️ **SECURITY WARNING**: This is a test application. Never commit `.env.local` or real credentials to the repository!

## Overview

This is a technical Proof of Concept (PoC) application designed to test AWS Cognito as an Enterprise Authentication Proxy for NOAA's National Federated Identity Gateway (NFIG) initiative. This application will **never go into production** - it exists solely to evaluate Cognito's claim passthrough, Single Logout (SLO), and integration complexity.

**Built with:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS with Material Design principles
- NextAuth.js v5 (beta)
- NOAA branded color scheme

## Prerequisites

- Node.js 18+ 
- npm or yarn
- AWS Cognito Client ID and Client Secret (obtain from NOAA Cognito administrator)

## Environment Variables

### Required Configuration

Copy `.env.example` to `.env.local` and replace placeholder values with real credentials:

```bash
cp .env.example .env.local
```

### Environment Variable Mapping

The application requires these environment variables mapped from the OIDC Discovery configuration:

| Environment Variable | OIDC Discovery Field | Purpose | Example Value |
|---------------------|---------------------|---------|---------------|
| `COGNITO_CLIENT_ID` | N/A (from AWS Console) | Application client identifier | `7a3m5k9p2c1j8h6n` |
| `COGNITO_CLIENT_SECRET` | N/A (from AWS Console) | Application client secret | `xxxxx-xxxxx-xxxxx` |
| `COGNITO_ISSUER` | `issuer` | Token validation | `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_8KX012Qnq` |
| `COGNITO_DOMAIN` | Derived from `authorization_endpoint` | Cognito domain | `us-east-18kx012qnq.auth.us-east-1.amazoncognito.com` |
| `NEXTAUTH_SECRET` | N/A (generate locally) | Session encryption | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | N/A (local config) | Application base URL | `http://localhost:3000` |

### OIDC Discovery Endpoints (Public - Safe to Share)

These endpoints are derived from the Cognito OIDC Discovery JSON and are public:

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

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Edit `.env.local` and add your real Cognito credentials:

```bash
# Required: Obtain from NOAA Cognito administrator
COGNITO_CLIENT_ID=your_real_client_id_here
COGNITO_CLIENT_SECRET=your_real_client_secret_here

# Required: Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret_here

# These values are correct for the NFIG test environment
COGNITO_ISSUER=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_8KX012Qnq
COGNITO_DOMAIN=us-east-18kx012qnq.auth.us-east-1.amazoncognito.com
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Test Authentication Flow

1. Click "Sign In" on the home page
2. You'll be redirected to Cognito Hosted UI
3. Authenticate with your NOAA credentials
4. After successful login, you'll be redirected back
5. Access the Debug Dashboard to inspect tokens and claims

## Project Structure

```
nfig-cognito-pilot/
├── app/
│   ├── api/auth/[...nextauth]/  # NextAuth configuration
│   ├── dashboard/               # Debug dashboard (token inspection)
│   ├── globals.css             # Material Design + NOAA styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                  # React components
├── lib/                        # Utility libraries
├── types/                      # TypeScript type definitions
├── .env.example                # Environment variable template
├── .env.local                  # YOUR secrets (never commit!)
└── .gitignore                  # Protects secrets
```

## Testing Objectives

This PoC is designed to test three critical aspects:

1. **Federation Test**: Can Cognito successfully redirect to upstream IDPs (Login.gov, Sso.noaa.gov)?
2. **Claim Passthrough Test**: Does Cognito pass mapped attributes (email, groups) or strip them?
3. **Single Logout Test**: Does SLO work effectively across the federation chain?

## Debug Dashboard

Access `/dashboard` (after authentication) to view:
- Raw ID Token JSON
- Raw Access Token JSON  
- UserInfo endpoint claims
- Token metadata (issuer, expiration, etc.)
- Copy-to-clipboard functionality for analysis

## Security

⚠️ **Critical Security Reminders:**

- **NEVER commit `.env.local`** (already in `.gitignore`)
- **NEVER commit real credentials** to this repository
- **NEVER share screenshots** containing real tokens
- **Use placeholder values** in all documentation
- **Tokens should only exist** in memory or clipboard temporarily

See `SECURITY.md` in the parent directory for complete security guidelines.

## Troubleshooting

### "Invalid credentials" error
- Verify `COGNITO_CLIENT_ID` and `COGNITO_CLIENT_SECRET` are correct
- Confirm callback URL `http://localhost:3000/api/auth/callback/cognito` is registered in Cognito

### "Session not persisted" error
- Verify `NEXTAUTH_SECRET` is set and properly generated
- Check `NEXTAUTH_URL` matches your running server URL

### Authentication redirect fails
- Ensure all OIDC Discovery endpoints are correct
- Verify Cognito domain matches your User Pool configuration

## Technology Stack

- **Framework**: Next.js 14.0 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS with Material Design 3 principles
- **Authentication**: NextAuth.js v5 (beta) with CognitoProvider
- **UI Library**: React 19
- **Material Design**: Custom CSS variables + Tailwind utilities

## NOAA Branding

The application uses official NOAA colors:
- **Primary**: `#0050d8` (NOAA Blue)
- **Secondary**: `#0077b6` (Ocean Blue)
- **Accent**: `#00a6ed` (Sky Blue)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Material Design 3](https://m3.material.io/)

## License

This project is for internal NOAA evaluation purposes only.

---

**Last Updated**: December 15, 2025  
**Maintainer**: NOAA NFIG Team  
**Status**: Development - PoC Testing Phase
