# NOAA Cognito Reference Implementation

## Overview

This repository contains a **complete, working reference implementation** demonstrating AWS Cognito integration with Login.gov for NOAA's federated identity initiative.

**Status**: ✅ Complete and tested  
**Result**: 100% claim passthrough verified  
**Purpose**: Reference for other NOAA teams implementing Cognito

---

## What's Inside

### `/nfig-cognito-pilot/` - Working Next.js Application

Complete Cognito integration example with:
- ✅ Authentication flow with Login.gov
- ✅ Debug dashboard for token inspection
- ✅ Diagnostic tools for troubleshooting
- ✅ Single Logout (SLO) implementation
- ✅ Documented known issues

**👉 [Start here: nfig-cognito-pilot/README.md](nfig-cognito-pilot/README.md)**

---

## Quick Start for Teams

```bash
# 1. Clone the repository
git clone https://github.com/JoshuaLee-NOAA/cognito-documentation.git
cd cognito-documentation/nfig-cognito-pilot

# 2. Follow the Quick Start in the app README
```

See **[nfig-cognito-pilot/README.md](nfig-cognito-pilot/README.md)** for complete setup instructions.

---

## Key Findings

### ✅ What Works

- **100% Claim Passthrough**: All Login.gov claims (including `ial`, `aal`) successfully passed through Cognito
- **Standard OIDC Integration**: No Cognito-specific code required - uses standard NextAuth.js patterns
- **Minimal Integration Effort**: Stack-agnostic approach adaptable to any framework
- **Single Logout**: Works as expected (local + Cognito session termination)

### ⚠️ Known Issues

- **Login.gov Sandbox CSP Warning**: Cosmetic error during SAML response (authentication still completes)
- **Custom Claim Namespacing**: SAML attributes get `custom:` prefix (e.g., `custom:ial`)

---

## For Development Teams

**Use this repository as**:
- Reference implementation for Cognito integration
- Working code example to adapt for your stack
- Troubleshooting guide with diagnostic tools
- Security best practices reference

**Key Resources**:
- [App README](nfig-cognito-pilot/README.md) - Setup and usage
- [SECURITY.md](SECURITY.md) - Security guidelines
- [.env.example](.env.example) - Environment configuration template

---

## Security

⚠️ **NEVER commit secrets to this repository!**

- Client IDs and Secrets → Use `.env.local` (in `.gitignore`)
- Real tokens → Never commit or screenshot
- Credentials → Obtain from NOAA Cognito administrator

See **[SECURITY.md](SECURITY.md)** for complete guidelines.

---

## Project Structure

```
cognito-documentation/
├── README.md                    # This file
├── SECURITY.md                  # Security guidelines
├── .env.example                 # Environment template
├── .gitignore                   # Protects secrets
└── nfig-cognito-pilot/          # 👈 Working Next.js app
    ├── README.md                # App documentation
    ├── app/                     # Next.js application
    ├── components/              # React components
    ├── lib/                     # Utilities
    └── .env.local               # Your secrets (not committed)
```

---

## Getting Help

**For Questions**:
- Check the [app README](nfig-cognito-pilot/README.md) first
- Use `/test` page in the app for diagnostics
- Contact NOAA NFIG team

**For Credentials**:
- Request Client ID/Secret from NOAA Cognito administrator
- Verify callback URLs are registered in AWS Console

---

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Auth**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **Node**: 18+

---

**Last Updated**: December 16, 2025  
**Maintainer**: NOAA NFIG Team  
**License**: Internal NOAA use
