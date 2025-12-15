# Security Guidelines for NFIG Cognito Pilot App

## ⚠️ CRITICAL: This Repository Will Be Shared on GitHub

This documentation repository and any associated pilot applications contain **public endpoints** but must **NEVER** include actual credentials or secrets.

## What is Safe to Share (Public Information)

The following information is **safe to commit** to the public GitHub repository:

### ✅ Public Endpoints (Safe)
- OIDC Discovery URLs (e.g., `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_8KX012Qnq/.well-known/openid-configuration`)
- Authorization endpoints
- Token endpoints
- UserInfo endpoints
- Logout endpoints
- JWKS URIs (public key endpoints)
- Cognito User Pool IDs (these are public identifiers)
- Cognito domain names (e.g., `us-east-18kx012qnq.auth.us-east-1.amazoncognito.com`)

These endpoints are designed to be publicly accessible and do not grant access without valid credentials.

## What MUST BE Protected (Secrets)

The following information is **SENSITIVE** and must **NEVER** be committed to the repository:

### 🔒 Secrets (Never Commit)
- **Client IDs** - Application identifiers that are sensitive in this context
- **Client Secrets** - Cryptographic secrets used to authenticate the application
- **Access Tokens** - Bearer tokens that grant access to protected resources
- **ID Tokens** - User identity tokens containing PII
- **Refresh Tokens** - Long-lived tokens for obtaining new access tokens
- **Session Cookies** - Authentication session identifiers
- **API Keys** - Any AWS, NOAA, or third-party API keys
- **Private Keys** - Cryptographic private keys (`.pem`, `.key` files)
- **Credentials** - Usernames, passwords, or any authentication credentials

## How to Obtain Required Credentials

To run the NFIG Cognito Pilot App locally, you will need credentials from your NOAA Cognito administrator:

1. **Contact NOAA Cognito Administrator**: Request access to the NFIG test environment
2. **Request Client Credentials**: Ask for:
   - Client ID for your test application
   - Client Secret for your test application
   - Confirmation of which upstream IDP(s) are configured (Login.gov or Sso.noaa.gov)
3. **Verify Callback URLs**: Ensure your local development callback URL (e.g., `http://localhost:3000/api/auth/callback/cognito`) is registered in the Cognito App Client settings

## Best Practices for Local Development

### 1. Use Environment Variables
Always store secrets in environment variables, never in code:

```bash
# .env.local (This file is automatically ignored by .gitignore)
COGNITO_CLIENT_ID=your_client_id_here
COGNITO_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 2. Never Commit .env Files
The repository includes a `.gitignore` that prevents committing:
- `.env`
- `.env.local`
- `.env.*.local`
- Any file containing `*secret*`, `*credential*`, `*password*`, or `*token*` in the name

### 3. Use .env.example for Templates
The repository includes a `.env.example` file with **placeholder values only**:

```bash
# .env.example (Safe to commit)
COGNITO_CLIENT_ID=YOUR_CLIENT_ID_HERE
COGNITO_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
NEXTAUTH_SECRET=GENERATE_WITH_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000
```

### 4. Rotate Secrets if Accidentally Exposed
If you accidentally commit secrets to the repository:

1. **Immediately rotate the exposed credentials** through the Cognito console
2. **Remove the secrets from Git history** (contact NOAA DevOps if needed)
3. **Notify your NOAA security team**
4. **Update your local `.env.local` with new credentials**

### 5. Code Review Checklist
Before committing code, verify:
- [ ] No hardcoded credentials in source code
- [ ] No `.env.local` or similar files in the commit
- [ ] All example code uses placeholder values (e.g., `YOUR_CLIENT_ID_HERE`)
- [ ] No real tokens in test files or documentation
- [ ] No screenshots containing real tokens or PII

## Testing with Real Tokens

When testing the Debug Dashboard that displays tokens:

### ✅ DO:
- Display tokens on localhost only
- Use tokens in memory only
- Clear tokens from clipboard after use
- Use incognito/private browsing for sensitive testing

### ❌ DON'T:
- Save tokens to files
- Share screenshots of real tokens
- Commit token dumps to the repository
- Share tokens in chat/email without encryption

## Documentation Guidelines

When writing documentation that will be shared publicly:

### Code Examples
Use clear placeholders in all code examples:

```javascript
// ✅ GOOD - Uses obvious placeholders
const clientId = process.env.COGNITO_CLIENT_ID; // "YOUR_CLIENT_ID_HERE"
const clientSecret = process.env.COGNITO_CLIENT_SECRET; // "YOUR_SECRET_HERE"

// ❌ BAD - Real or realistic-looking values
const clientId = "7a3m5k9p2c1j8h6n"; // Looks like real ID
const clientSecret = "abc123secret"; // Looks like real secret
```

### Screenshots
If including screenshots in documentation:
- Blur or redact any tokens displayed
- Use test/dummy data where possible
- Focus on UI/UX elements, not actual credential values

## Repository Maintenance

### Regular Security Audits
Periodically review the repository for:
- Accidentally committed secrets (use tools like `git-secrets` or `trufflehog`)
- Stale `.env.example` files that need updating
- Documentation that inadvertently reveals sensitive patterns

### Pull Request Reviews
All PRs should be reviewed for:
- Credential exposure
- Proper use of environment variables
- Updated `.env.example` if new variables are added

## Questions or Concerns?

If you have questions about what is safe to share or how to handle credentials:

1. **NOAA Security Team**: Contact your information security officer
2. **NFIG Program Office**: Reach out to the Lead Architect or Technical Product Manager
3. **When in Doubt**: Treat information as sensitive and don't commit it

---

**Remember**: Public repositories are visible to the entire internet. Treat every commit as if it will be reviewed by external parties.

**Last Updated**: December 15, 2025  
**Maintained By**: NFIG Initiative Team
