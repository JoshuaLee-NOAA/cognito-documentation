# NFIG Cognito Pilot App Documentation

## ⚠️ SECURITY WARNING: Do Not Commit Secrets

**This repository is shared on GitHub.** Never commit:
- Client IDs or Client Secrets
- Access tokens, ID tokens, or refresh tokens
- `.env.local` or any files containing real credentials
- Screenshots showing real tokens or PII

See [SECURITY.md](SECURITY.md) for complete security guidelines.

---

## Overview

The **NFIG (National Federated Identity Gateway) Cognito Pilot App** is a technical Proof of Concept (PoC) designed to evaluate whether AWS Cognito can serve as an "Enterprise Authentication Proxy" for the National Oceanic and Atmospheric Administration (NOAA).

This is a **disposable testing application** that will never go into production. Its purpose is to:
- Test Cognito's ability to federate with upstream IDPs (Login.gov, Sso.noaa.gov)
- Verify claim mapping and attribute passthrough
- Evaluate Single Logout (SLO) capabilities
- Measure Application Integration Level of Effort (LOE)
- Document the integration process for other NOAA teams

## Problem Statement

NOAA needs a broker to bridge central Identity Providers (IDPs) like Login.gov and Sso.noaa.gov with downstream applications. AWS Cognito has "Protocol Asymmetry"—it supports SAML backends but forces OIDC on the frontend. This PoC tests whether the "refactoring tax" for legacy applications is acceptable.

## Project Structure

```
cognito-documentation/
├── README.md                    # This file
├── SECURITY.md                  # Security guidelines (READ THIS!)
├── .env.example                 # Environment variable template
├── .gitignore                   # Protects secrets from being committed
├── planning/                    # Planning and process documentation
│   ├── create-prd.mdc
│   ├── generate-tasks.mdc
│   └── process-task-list.mdc
└── tasks/                       # Product Requirements Documents
    └── prd-nfig-cognito-pilot-app.md
```

## Quick Start

### Prerequisites
- Access to NOAA Cognito test environment
- Client ID and Client Secret from NOAA Cognito administrator
- Node.js 18+ (for future app implementation)
- Understanding of OIDC/OAuth2 concepts

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/JoshuaLee-NOAA/cognito-documentation.git
   cd cognito-documentation
   ```

2. **Read Security Guidelines**
   ```bash
   cat SECURITY.md
   ```
   **Important**: Understand what can and cannot be committed before making changes.

3. **Set Up Environment Variables** (for future app implementation)
   ```bash
   cp .env.example .env.local
   ```
   
4. **Obtain Credentials**
   - Contact your NOAA Cognito administrator
   - Request Client ID and Client Secret
   - Verify callback URLs are registered

5. **Configure .env.local**
   - Open `.env.local` and replace placeholder values
   - Generate NextAuth secret: `openssl rand -base64 32`
   - **Never commit this file!** (already in .gitignore)

## Documentation

### Key Documents

- **[PRD: NFIG Cognito Pilot App](tasks/prd-nfig-cognito-pilot-app.md)** - Comprehensive product requirements document
- **[SECURITY.md](SECURITY.md)** - Security guidelines for handling secrets
- **[.env.example](.env.example)** - Environment variable template

### OIDC Discovery Configuration

The pilot app uses this OIDC Discovery JSON (public endpoints - safe to share):

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

## Success Metrics

This PoC will be evaluated using clear **go/no-go decision criteria**:

### Critical Success Criteria
1. **Claim Passthrough**: ≥80% of mapped attributes pass through from upstream IDP
2. **Single Logout**: Successfully terminates Cognito session (and optionally propagates to IDP)
3. **Integration LOE**: Developer can integrate in ≤8 hours (1 work day)

### Metrics to Collect
- Integration time (developer hours)
- Claim completeness (% of expected claims present)
- Error rate during testing
- Code complexity vs. direct IDP integration

## Testing Goals

1. **Federation Test**: Verify redirect to Cognito Hosted UI and callback handling
2. **Claim Inspection Test**: Debug Dashboard to view raw token JSON and verify claims
3. **Session & Logout Test**: Single Logout functionality across federation chain
4. **Load Test Preparation**: Serverless-compatible architecture for JMeter testing

## Tech Stack (Planned)

- **Framework**: Next.js 14 (App Router)
- **Auth Library**: NextAuth.js with CognitoProvider
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Serverless (Vercel or AWS Lambda)

## Contributing

### Before Committing Code

**Security Checklist** (required for all commits):
- [ ] No hardcoded credentials in source code
- [ ] No `.env.local` or similar files in the commit
- [ ] All example code uses placeholder values (`YOUR_CLIENT_ID_HERE`)
- [ ] No real tokens in test files or documentation
- [ ] No screenshots containing real tokens or PII
- [ ] Ran `git status` to verify only intended files are staged

### Code Review Requirements
All pull requests will be reviewed for:
- Credential exposure
- Proper use of environment variables
- Updated `.env.example` if new variables are added
- Security best practices

### Commit Messages
Use clear, descriptive commit messages:
```bash
# Good examples
git commit -m "docs: add claim mapping verification guide"
git commit -m "feat: implement debug dashboard for token inspection"
git commit -m "security: update .gitignore to exclude token dumps"

# Bad examples (too vague)
git commit -m "update"
git commit -m "fix stuff"
```

## Troubleshooting

### "Module not found" errors
- Ensure you've run `npm install` (when app is implemented)
- Check Node.js version: `node --version` (should be 18+)

### "Invalid credentials" during authentication
- Verify Client ID and Client Secret in `.env.local`
- Confirm callback URL is registered in Cognito App Client
- Check that credentials haven't been rotated

### "Session not persisted" issues
- Verify `NEXTAUTH_SECRET` is set and properly generated
- Check `NEXTAUTH_URL` matches your running server URL

### Accidentally committed secrets
1. **Immediately** rotate the exposed credentials in Cognito console
2. Remove secrets from Git history (contact NOAA DevOps)
3. Notify NOAA security team
4. Update local `.env.local` with new credentials

## Resources

### NOAA Internal
- Contact NOAA Cognito administrators for credentials
- NFIG Program Office for project questions
- NOAA Security Team for security concerns

### External Documentation
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [OIDC Specification](https://openid.net/connect/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js 14 Documentation](https://nextjs.org/docs)

## License

This project is intended for internal NOAA use and evaluation purposes.

## Contact

**Project Lead**: Lead Architect and Technical Product Manager, NFIG Initiative  
**Repository Maintainer**: Joshua Lee (NOAA)  
**Last Updated**: December 15, 2025

---

## Important Reminders

🔒 **Never commit secrets** - Use `.env.local` for all sensitive data  
📖 **Read SECURITY.md** - Understand what is safe to share  
✅ **Use placeholders** - All code examples must use obvious placeholder values  
🔍 **Review before committing** - Double-check `git status` for sensitive files  
🚫 **No real tokens** - Never commit screenshots or dumps with real tokens

**When in doubt, don't commit it.** Consult [SECURITY.md](SECURITY.md) or your security team.
