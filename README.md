# NFIG Cognito Reference Implementation

## ⚠️ SECURITY WARNING: Do Not Commit Secrets

**This repository is shared on GitHub.** Never commit:
- Client IDs or Client Secrets
- Access tokens, ID tokens, or refresh tokens
- `.env.local` or any files containing real credentials
- Screenshots showing real tokens or PII

See **[SECURITY.md](SECURITY.md)** for complete security guidelines.

---

## TL;DR

Working Next.js reference implementation demonstrating AWS Cognito integration with Login.gov for NOAA's federated identity initiative. **Tested Result: 100% claim passthrough** from Login.gov through Cognito to application. Includes debug dashboard, diagnostic tools, and Single Logout (SLO) implementation.

**Browse this code as a reference when building your own Cognito integration.**

---

## Overview

The **NFIG (National Federated Identity Gateway) Cognito Pilot App** is a technical Proof of Concept (PoC) designed to evaluate whether AWS Cognito can serve as an "Enterprise Authentication Proxy" for the National Oceanic and Atmospheric Administration (NOAA).

### Purpose

This is a reference implementation that demonstrates:
- Cognito's ability to federate with upstream IDPs (Login.gov, Sso.noaa.gov)
- Claim mapping and attribute passthrough
- Single Logout (SLO) capabilities  
- Integration patterns for NOAA applications

### Problem Statement

NOAA needs a broker to bridge central Identity Providers (IDPs) like Login.gov and Sso.noaa.gov with downstream applications. AWS Cognito has "Protocol Asymmetry"—it supports SAML backends but forces OIDC on the frontend. This PoC tests whether the "refactoring tax" for legacy applications is acceptable.

**Result**: ✅ Minimal refactoring required - standard OIDC patterns work.

---

## How to Use This Reference

**This repository is for browsing and reference** - you don't need to clone it to learn from it.

### For NOAA Development Teams:

1. **Browse the code on GitHub** to see working examples
2. **Contact the NFIG team** to request your own:
   - Cognito Client ID
   - Cognito Client Secret
   - Callback URL registration
3. **Adapt these patterns** to your technology stack
4. **Use the diagnostic tools** (`/nfig-cognito-pilot/app/test/`) when troubleshooting

### What's In This Repository

📁 **`/nfig-cognito-pilot/`** - Complete Next.js application with:
- 🔐 **Authentication** - OIDC integration with Cognito + Login.gov
- 🔍 **Debug Dashboard** (`/dashboard`) - Inspect tokens and claims
- 🛠️ **Diagnostic Tools** (`/test`) - Test configuration and connectivity
- 🚪 **Single Logout** - Custom SLO implementation
- 🛡️ **Route Protection** - Middleware example

---

## Key Findings

### ✅ What Works Exceptionally Well

**100% Claim Passthrough**
- ✅ `custom:ial` - Identity Assurance Level
- ✅ `custom:aal` - Authentication Assurance Level
- ✅ `email`, `sub`, `cognito:groups`
- ✅ Full identity chain in `identities` claim

**Standard OIDC Integration**
- No Cognito-specific code required
- Uses NextAuth.js standard `CognitoProvider`
- Stack-agnostic patterns easily adaptable

**Single Logout**
- Local session clears successfully
- Cognito session terminates
- Manual navigation back to app required

### ⚠️ Known Issues

**Login.gov Sandbox CSP Warning**
- **Error**: "Sending form data to SAML endpoint violates Content Security Policy"
- **Impact**: Cosmetic only - authentication completes successfully
- **Workaround**: Manually navigate back to app after seeing error
- **Note**: May not occur with production Login.gov (untested)

**Custom Claim Namespacing**
- SAML attributes receive `custom:` prefix (e.g., `custom:ial` not `ial`)
- Simple string prefix handling needed in your application code

---

## Repository Structure

```
cognito-documentation/
├── README.md                    # This file
├── SECURITY.md                  # Security guidelines (READ THIS!)
├── .env.example                 # Environment variable template
├── .gitignore                   # Protects secrets
└── nfig-cognito-pilot/          # Working Next.js application
    ├── app/
    │   ├── api/auth/[...nextauth]/  # NextAuth configuration
    │   ├── api/auth/logout/         # Custom SLO handler
    │   ├── api/test/cognito/        # Diagnostic API
    │   ├── dashboard/               # Token inspection UI
    │   ├── test/                    # Diagnostic tools
    │   └── page.tsx                 # Home page
    ├── components/              # Reusable React components
    ├── lib/                     # Auth configuration & utilities
    ├── types/                   # TypeScript definitions
    └── .env.example             # App environment template
```

---

## Environment Configuration (For Your Implementation)

When building your own integration, you'll need these environment variables:

| Variable | Source | Purpose |
|----------|--------|---------|
| `COGNITO_CLIENT_ID` | NFIG Team | Your application's client identifier |
| `COGNITO_CLIENT_SECRET` | NFIG Team | Your application's secret |
| `COGNITO_ISSUER` | NFIG Team | Token validation URL |
| `COGNITO_DOMAIN` | NFIG Team | Cognito hosted UI domain |
| `NEXTAUTH_SECRET` | Generate locally | Session encryption (run: `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your setup | Your application's base URL |

### OIDC Discovery Endpoints (Public)

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

## Technology Stack

This reference implementation uses:
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Auth**: NextAuth.js v5 (beta) with CognitoProvider
- **Styling**: Tailwind CSS
- **Node**: 18+

**Note**: The OIDC patterns shown here are stack-agnostic and can be adapted to Java/Spring Boot, Python/Flask, .NET, or any framework with OIDC support.

---

## Security Best Practices

### Before Implementing

🔒 **Never commit secrets** - Use environment variables for all sensitive data  
📖 **Read SECURITY.md** - Understand what is safe to share  
✅ **Use placeholders** - All code examples must use obvious placeholder values  
🔍 **Review before committing** - Double-check for sensitive files  
🚫 **No real tokens** - Never commit screenshots or dumps with real tokens

### Security Checklist (Required for all commits)

- [ ] No hardcoded credentials in source code
- [ ] No `.env.local` or similar files in the commit
- [ ] All example code uses placeholder values (`YOUR_CLIENT_ID_HERE`)
- [ ] No real tokens in test files or documentation
- [ ] No screenshots containing real tokens or PII
- [ ] Ran `git status` to verify only intended files are staged

**When in doubt, don't commit it.** Consult [SECURITY.md](SECURITY.md) or your security team.

---

## Troubleshooting

### Authentication Fails

1. Visit the `/test` page in the pilot app for diagnostics
2. Verify all endpoints return 200 or expected responses
3. Confirm callback URL is registered in Cognito
4. Check that Hosted UI is enabled in AWS Console
5. Verify identity providers are assigned to your app client

### "Invalid credentials" Error

- Double-check `COGNITO_CLIENT_ID` and `COGNITO_CLIENT_SECRET`
- Ensure no extra spaces or characters
- Verify credentials are for the correct environment
- Confirm credentials haven't been rotated

### Session Not Persisting

- Verify `NEXTAUTH_SECRET` is set (run `openssl rand -base64 32`)
- Check `NEXTAUTH_URL` matches your running server
- Clear browser cookies and try again
- Ensure cookies are configured correctly for your environment

### CSP Error with Login.gov

This is a known cosmetic issue with the Login.gov sandbox:
- **Impact**: None - authentication completes successfully
- **Action**: Manually navigate back to your application
- **Note**: May not occur in production Login.gov

---

## Resources

### NOAA Internal

- **Contact NFIG Team** for Cognito credentials and configuration
- **NFIG Program Office** for project questions
- **NOAA Security Team** for security concerns

### External Documentation

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [OIDC Specification](https://openid.net/connect/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js 14 Documentation](https://nextjs.org/docs)

---

## Success Criteria

This PoC was evaluated using these go/no-go decision criteria:

| Criterion | Target | Result | Status |
|-----------|--------|--------|--------|
| **Claim Passthrough** | ≥80% | 100% | ✅ EXCEEDED |
| **Single Logout** | Working | ✅ Yes | ✅ MET |
| **Integration Complexity** | Minimal | Standard OIDC | ✅ MET |

**Recommendation**: ✅ **GO** - Cognito is viable for NOAA's federated identity requirements.

---

## License

This project is intended for internal NOAA use and evaluation purposes.

---

## Contact

**Repository Maintainer**: Joshua Lee (NOAA)  
**NFIG Team**: Contact for credentials and configuration  
**Last Updated**: December 16, 2025  
**Status**: Reference Implementation - Complete

---

## Important Reminders

🔒 **Security First** - Never commit real credentials  
📖 **Read the Docs** - Check SECURITY.md before contributing  
✅ **Use This as Reference** - Browse and adapt, don't clone blindly  
🚫 **No Production Use** - This is a PoC/reference implementation  
💬 **Ask Questions** - Contact NFIG team when in doubt
