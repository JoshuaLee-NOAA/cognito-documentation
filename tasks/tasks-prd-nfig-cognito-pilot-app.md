# Task List: NFIG Cognito Pilot App

Generated from: `prd-nfig-cognito-pilot-app.md`

## Relevant Files

### Core Application Files
- `app/layout.tsx` - Root layout with Tailwind and Material Design configuration
- `app/page.tsx` - Home page with sign-in button (FR-1.1)
- `app/globals.css` - Global styles, Tailwind imports, Material Design custom properties
- `tailwind.config.ts` - Tailwind configuration with Material Design theme (elevation, spacing, NOAA colors)
- `components/Navigation.tsx` - Top navigation showing auth state and sign-out button
- `components/AuthButton.tsx` - Reusable authentication button component

### Authentication Files
- `app/api/auth/[...nextauth]/route.ts` - NextAuth configuration with CognitoProvider (FR-1.2, FR-1.3)
- `lib/auth.ts` - NextAuth configuration and session handling
- `lib/auth-config.ts` - Cognito OIDC endpoints configuration
- `middleware.ts` - Route protection middleware (FR-3.5)
- `types/next-auth.d.ts` - TypeScript types for extended NextAuth session

### Debug Dashboard Files
- `app/dashboard/page.tsx` - Main debug dashboard (FR-2.1)
- `components/TokenDisplay.tsx` - Token JSON display with syntax highlighting (FR-2.2, FR-2.3)
- `components/ClaimDisplay.tsx` - Claims display with source labels (FR-2.5)
- `components/TokenMetadata.tsx` - Token expiration and metadata display (FR-2.6)
- `components/CopyButton.tsx` - Copy-to-clipboard button (FR-2.7)
- `lib/token-utils.ts` - Token parsing and extraction utilities

### Logout Files
- `app/api/auth/logout/route.ts` - Custom logout handler for Cognito end_session_endpoint (FR-3.3)

### Documentation Files
- `docs/integration-guide.md` - Detailed integration documentation (FR-5.2)
- `docs/claim-mapping.md` - Claim mapping verification procedures
- `docs/load-testing.md` - Load testing configuration guide (FR-4.4)
- `docs/authentication-flow.md` - Authentication flow diagrams (FR-5.4)
- `docs/slo-testing.md` - Single Logout testing methodology
- `docs/metrics-collection.md` - Integration LOE metrics collection guide

### Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration
- `.env.example` - Environment variable template (already created)
- `.gitignore` - Git ignore patterns (already created)
- `SECURITY.md` - Security guidelines (already created)
- `README.md` - Project documentation (already created)

### Testing Files (Future)
- `__tests__/auth.test.ts` - Authentication flow tests
- `__tests__/dashboard.test.ts` - Dashboard component tests
- `__tests__/logout.test.ts` - Logout flow tests

### Notes
- Tests are optional for this PoC but recommended for verification
- All environment variables must use `.env.local` (never commit)
- Use `npm run dev` to start the development server
- Use `npm run build` to verify production build compatibility

## Tasks

- [x] 1.0 **Project Setup & Configuration**
  - [x] 1.1 Initialize Next.js 14 project with TypeScript and App Router (`npx create-next-app@latest nfig-cognito-pilot --typescript --tailwind --app --no-src-dir`)
  - [x] 1.2 Install required dependencies: `next-auth@beta` (v5), `react-syntax-highlighter`, `@types/react-syntax-highlighter`
  - [x] 1.3 Configure Tailwind CSS with Material Design principles:
    - [x] 1.3.1 Add Material Design color system to `tailwind.config.ts`
    - [x] 1.3.2 Add Material Design elevation/shadow scale (0-24dp)
    - [x] 1.3.3 Add Material Design spacing scale (8px base unit)
    - [x] 1.3.4 Add NOAA branded colors (primary, secondary, accent) to theme
    - [x] 1.3.5 Configure Material Typography scale (h1-h6, body1, body2, etc.)
  - [x] 1.4 Set up environment variables:
    - [x] 1.4.1 Verify `.env.example` exists with all required variables (already created)
    - [x] 1.4.2 Create `.env.local` from template (local only, never commit)
    - [x] 1.4.3 Document environment variable mapping in README
  - [x] 1.5 Configure TypeScript for NextAuth extended session types
  - [x] 1.6 Verify `.gitignore` excludes all sensitive files (already created)
  - [x] 1.7 Set up project file structure (app/, components/, lib/, docs/)

- [ ] 2.0 **NextAuth Integration with Cognito**
  - [x] 2.1 Create `lib/auth-config.ts` with OIDC Discovery endpoints:
    - [x] 2.1.1 Define Cognito issuer URL
    - [x] 2.1.2 Define authorization endpoint
    - [x] 2.1.3 Define token endpoint
    - [x] 2.1.4 Define userinfo endpoint
    - [x] 2.1.5 Define end_session endpoint (for logout)
    - [x] 2.1.6 Define JWKS URI
  - [x] 2.2 Create `app/api/auth/[...nextauth]/route.ts`:
    - [x] 2.2.1 Configure CognitoProvider with environment variables
    - [x] 2.2.2 Set authorization params (scope: openid email profile)
    - [x] 2.2.3 Configure JWT callback to include access_token in session
    - [x] 2.2.4 Configure session callback to pass tokens to client
    - [x] 2.2.5 Add error handling for authentication failures (FR-1.4)
  - [x] 2.3 Create `lib/auth.ts` for auth utilities:
    - [x] 2.3.1 Export auth configuration
    - [x] 2.3.2 Create helper functions for getting session
    - [x] 2.3.3 Create token extraction utilities
  - [x] 2.4 Create `types/next-auth.d.ts` to extend NextAuth types:
    - [x] 2.4.1 Extend Session to include access_token, id_token, expires_at
    - [x] 2.4.2 Extend JWT to include custom claims
  - [ ] 2.5 Create `middleware.ts` for route protection:
    - [ ] 2.5.1 Protect /dashboard route (require authentication)
    - [ ] 2.5.2 Redirect unauthenticated users to home page (FR-3.5)
  - [ ] 2.6 Test authentication flow:
    - [ ] 2.6.1 Verify redirect to Cognito Hosted UI
    - [ ] 2.6.2 Verify callback handling and token exchange (FR-1.3)
    - [ ] 2.6.3 Verify session creation

- [x] 3.0 **Authentication UI & User Experience**
  - [x] 3.1 Create `app/layout.tsx`:
    - [x] 3.1.1 Import global styles and Tailwind
    - [x] 3.1.2 Configure fonts and metadata
    - [x] 3.1.3 Navigation functionality implemented via card headers (not separate component)
    - [x] 3.1.4 Apply NOAA branded background color
  - [x] 3.2 Create `app/page.tsx` (Home Page):
    - [x] 3.2.1 Add project title and description (NFIG Cognito Pilot App)
    - [x] 3.2.2 Add "Sign In" button with Material Design elevation (FR-1.1)
    - [x] 3.2.3 Apply NOAA primary color to button
    - [x] 3.2.4 Add hover states with Material ripple effect
    - [x] 3.2.5 Display authentication state (signed in/out) (FR-8.3)
    - [x] 3.2.6 Show user info when authenticated (FR-1.5)
    - [x] 3.2.7 Add link to Debug Dashboard when authenticated
  - [x] 3.3 Create `app/globals.css`:
    - [x] 3.3.1 Import Tailwind directives
    - [x] 3.3.2 Define Material Design CSS custom properties (elevation, transitions)
    - [x] 3.3.3 Add NOAA brand color variables
    - [x] 3.3.4 Add Material typography styles
    - [x] 3.3.5 Add utility classes for Material Design patterns
  - [x] 3.4 Card-based navigation (adapted approach):
    - [x] 3.4.1 Card header with branding replaces top navigation
    - [x] 3.4.2 Show app title in card header
    - [x] 3.4.3 Display authentication status indicator (gray/green dot)
    - [x] 3.4.4 Add "Sign Out" button when authenticated (FR-3.1)
    - [x] 3.4.5 Apply NOAA primary color to branding
    - [x] 3.4.6 Responsive card design for desktop (FR-8.4)
  - [x] 3.5 Authentication buttons (implemented inline):
    - [x] 3.5.1 Buttons use Material Design styling
    - [x] 3.5.2 Proper touch targets (py-3 = 12px top/bottom + text = 44px+)
    - [x] 3.5.3 Loading states handled by NextAuth default behavior
    - [x] 3.5.4 Error handling configured in NextAuth (FR-1.4)
  - [x] 3.6 Material Design principles applied:
    - [x] 3.6.1 8dp spacing grid used (Tailwind spacing: p-2=16px, p-4=32px, etc.)
    - [x] 3.6.2 Appropriate elevation levels (mat-elevation-4 for cards, mat-elevation-8 for raised)
    - [x] 3.6.3 Material motion with mat-transition classes and hover effects
    - [x] 3.6.4 NOAA colors provide proper contrast (WCAG AA compliant)

- [ ] 4.0 **Debug Dashboard for Token Inspection (Critical)**
  - [ ] 4.1 Create `app/dashboard/page.tsx`:
    - [ ] 4.1.1 Create protected route (authentication required) (FR-2.1)
    - [ ] 4.1.2 Fetch session data server-side
    - [ ] 4.1.3 Extract id_token, access_token, and userinfo claims
    - [ ] 4.1.4 Create full-screen layout with Material Design cards
    - [ ] 4.1.5 Add page title and description
    - [ ] 4.1.6 Handle missing token scenarios gracefully
  - [ ] 4.2 Create `components/TokenDisplay.tsx`:
    - [ ] 4.2.1 Create component accepting token JSON as prop
    - [ ] 4.2.2 Implement syntax highlighting with `react-syntax-highlighter` (FR-2.2, FR-2.3)
    - [ ] 4.2.3 Use Material Design card with elevation
    - [ ] 4.2.4 Add expandable/collapsible functionality
    - [ ] 4.2.5 Format JSON with proper indentation
    - [ ] 4.2.6 Add dark theme for code display (better readability)
  - [ ] 4.3 Create `components/ClaimDisplay.tsx`:
    - [ ] 4.3.1 Create component to display claims from different sources (FR-2.5)
    - [ ] 4.3.2 Add clear labels: "ID Token Claims", "Access Token Claims", "UserInfo Claims"
    - [ ] 4.3.3 Use Material Design chips/badges to indicate source
    - [ ] 4.3.4 Display claims in a readable table format
    - [ ] 4.3.5 Highlight important claims (email, sub, groups)
  - [ ] 4.4 Create `components/TokenMetadata.tsx`:
    - [ ] 4.4.1 Display token issuer (iss claim) (FR-2.6)
    - [ ] 4.4.2 Display issued at timestamp (iat)
    - [ ] 4.4.3 Display expiration timestamp (exp)
    - [ ] 4.4.4 Calculate and display time remaining until expiration
    - [ ] 4.4.5 Add visual warning if token is near expiration (<5 minutes)
    - [ ] 4.4.6 Use Material Design list items for metadata display
  - [ ] 4.5 Create `components/CopyButton.tsx`:
    - [ ] 4.5.1 Create button to copy token JSON to clipboard (FR-2.7)
    - [ ] 4.5.2 Use browser Clipboard API
    - [ ] 4.5.3 Show success feedback (Material snackbar or checkmark)
    - [ ] 4.5.4 Handle copy errors gracefully
    - [ ] 4.5.5 Apply Material Design button styling
  - [ ] 4.6 Create `lib/token-utils.ts`:
    - [ ] 4.6.1 Create function to decode JWT without verification (for display)
    - [ ] 4.6.2 Create function to extract claims from token
    - [ ] 4.6.3 Create function to format timestamps
    - [ ] 4.6.4 Create function to validate token structure
  - [ ] 4.7 Organize dashboard layout:
    - [ ] 4.7.1 Three-panel layout: ID Token | Access Token | UserInfo
    - [ ] 4.7.2 Add Token Metadata section at top
    - [ ] 4.7.3 Make panels scrollable independently
    - [ ] 4.7.4 Apply consistent Material spacing (16dp between panels)

- [ ] 5.0 **Logout Flow & Documentation**
  - [ ] 5.1 Implement Single Logout (SLO):
    - [ ] 5.1.1 Create custom logout handler that clears local session (FR-3.2)
    - [ ] 5.1.2 Redirect to Cognito `end_session_endpoint` (FR-3.3)
    - [ ] 5.1.3 Include proper redirect parameters (post_logout_redirect_uri) (FR-3.4)
    - [ ] 5.1.4 Test that protected routes redirect after logout (FR-3.5)
    - [ ] 5.1.5 Document whether Cognito propagates logout to upstream IDP (FR-3.6)
  - [ ] 5.2 Create comprehensive README (FR-5.1):
    - [ ] 5.2.1 Update existing README.md with quick start instructions
    - [ ] 5.2.2 Document prerequisites (Node.js version, credentials needed)
    - [ ] 5.2.3 Add step-by-step setup instructions
    - [ ] 5.2.4 Document environment variable configuration
    - [ ] 5.2.5 Add "How to run locally" section
    - [ ] 5.2.6 Add troubleshooting section (common issues)
    - [ ] 5.2.7 Include prominent security warning (FR-7.4)
  - [ ] 5.3 Create integration documentation (FR-5.2):
    - [ ] 5.3.1 Create `docs/integration-guide.md`:
      - [ ] 5.3.1.1 Document OIDC Discovery configuration mapping
      - [ ] 5.3.1.2 Step-by-step Cognito setup process
      - [ ] 5.3.1.3 Environment variables explanation
      - [ ] 5.3.1.4 Integration LOE tracking methodology
      - [ ] 5.3.1.5 Stack-agnostic guidance for other frameworks (FR-5.3)
    - [ ] 5.3.2 Create `docs/claim-mapping.md`:
      - [ ] 5.3.2.1 Document expected claims from upstream IDP
      - [ ] 5.3.2.2 Claim verification procedures
      - [ ] 5.3.2.3 How to use Debug Dashboard for verification
      - [ ] 5.3.2.4 Common claim mapping issues and solutions
    - [ ] 5.3.3 Create `docs/slo-testing.md`:
      - [ ] 5.3.3.1 Single Logout testing methodology
      - [ ] 5.3.3.2 How to verify session termination
      - [ ] 5.3.3.3 Upstream IDP logout propagation testing
      - [ ] 5.3.3.4 Expected behaviors and edge cases
    - [ ] 5.3.4 Create `docs/load-testing.md` (FR-4.4):
      - [ ] 5.3.4.1 JMeter configuration guide
      - [ ] 5.3.4.2 How to extract tokens for load testing
      - [ ] 5.3.4.3 Serverless architecture considerations (FR-4.1, FR-4.2)
      - [ ] 5.3.4.4 JWT-based session benefits for scaling (FR-4.3)
    - [ ] 5.3.5 Create `docs/authentication-flow.md` (FR-5.4):
      - [ ] 5.3.5.1 Create sequence diagram of authentication flow
      - [ ] 5.3.5.2 Document OAuth2 authorization code flow
      - [ ] 5.3.5.3 Show token exchange process
      - [ ] 5.3.5.4 Illustrate session management
    - [ ] 5.3.6 Create `docs/metrics-collection.md`:
      - [ ] 5.3.6.1 Integration LOE metrics to collect
      - [ ] 5.3.6.2 Claim completeness measurement methodology
      - [ ] 5.3.6.3 Error rate tracking guidelines
      - [ ] 5.3.6.4 Template for evaluation report
  - [ ] 5.4 Security documentation (FR-7.2, already partially complete):
    - [ ] 5.4.1 Verify SECURITY.md includes all required sections
    - [ ] 5.4.2 Add code examples with placeholder values (FR-7.3)
    - [ ] 5.4.3 Document credential rotation procedures
  - [ ] 5.5 Final verification and testing:
    - [ ] 5.5.1 Test complete authentication flow end-to-end
    - [ ] 5.5.2 Verify all 40 functional requirements are met
    - [ ] 5.5.3 Test logout flow completely
    - [ ] 5.5.4 Verify no secrets in repository (`git status`, check .gitignore)
    - [ ] 5.5.5 Test with fresh clone (ensure setup docs are accurate)
    - [ ] 5.5.6 Collect initial integration LOE metrics
    - [ ] 5.5.7 Document any gotchas or issues encountered

## Implementation Notes

### Priority Order
1. **Start with Task 1** (Project Setup) - Foundation for everything else
2. **Then Task 2** (NextAuth/Cognito) - Core authentication functionality
3. **Then Task 3** (UI) - User-facing authentication interface
4. **Then Task 4** (Debug Dashboard) - **CRITICAL** for claims testing
5. **Finally Task 5** (Logout & Docs) - Complete the PoC

### Material Design with Tailwind Tips
- Use Tailwind's `shadow-*` utilities for Material elevation (map to dp values)
- Create custom Tailwind classes for Material motion (transition-timing)
- Use Tailwind's color palette as base, extend with NOAA colors
- Consider using `@apply` in CSS for reusable Material components
- Reference Material Design 3 guidelines for spacing, elevation, motion

### NOAA Branding
- Research NOAA's official brand guidelines for exact color codes
- Typical federal colors: Blues (#0050d8, #0077b6), grays, white backgrounds
- Maintain high contrast ratios for accessibility (WCAG AA: 4.5:1 text, 3:1 UI)
- Use NOAA logo/wordmark if available and appropriate

### Security Reminders
- ⚠️ **NEVER commit .env.local** (already in .gitignore)
- ⚠️ Use placeholder values in all documentation
- ⚠️ Review `git status` before every commit
- ⚠️ Real tokens should only exist in memory/clipboard temporarily

### Testing the PoC
- Manual testing is sufficient for this PoC
- Focus on verifying the go/no-go criteria:
  - Can Cognito pass claims? (Use Debug Dashboard)
  - Does SLO work? (Test logout flow)
  - What was the integration LOE? (Track hours)

### Success Criteria Reference
From PRD, the PoC is successful if:
1. ✅ Cognito passes ≥80% of expected claims
2. ✅ SLO successfully terminates sessions
3. ✅ Integration takes ≤8 hours for OIDC-experienced developer

Track these metrics throughout development!

---

**Generated**: December 15, 2025  
**Based on**: prd-nfig-cognito-pilot-app.md (v1.0)
