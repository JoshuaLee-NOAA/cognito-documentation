# Single Logout (SLO) Testing Guide

## Overview

This guide provides a systematic methodology for testing Single Logout (SLO) functionality in the NFIG Cognito Pilot App. SLO is critical for security to ensure sessions are properly terminated across all systems.

## Logout Architecture

### Logout Flow Sequence

1. **User clicks "Sign Out"** → `/api/auth/logout`
2. **Custom handler clears local session** → Calls NextAuth signout
3. **Redirect to Cognito** → `end_session_endpoint` with client_id and logout_uri
4. **Cognito terminates session** → Clears Cognito cookies
5. **Return to application** → User redirected to homepage
6. **(Optional) Upstream IDP logout** → May or may not propagate to Login.gov/SSO

## Test Scenarios

### Test 1: Local Session Termination

**Objective**: Verify application session is cleared

**Steps**:
1. Sign in to the application
2. Navigate to `/dashboard` (verify access granted)
3. Click "Sign Out"
4. Verify redirect to homepage occurs
5. Attempt to access `/dashboard` directly
6. **Expected**: Should redirect to login (middleware protection)

**Success Criteria**:
- ✅ User redirected to home page
- ✅ Protected routes no longer accessible
- ✅ No session cookie remains in browser

### Test 2: Cognito Session Termination

**Objective**: Verify Cognito session is properly cleared

**Steps**:
1. Sign in to the application
2. Verify successful authentication
3. Click "Sign Out"
4. **Important**: Watch the URL bar during logout - should see:
   ```
   https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com/logout?...
   ```
5. Return to application homepage
6. Click "Sign In" again
7. **Expected**: Should be prompted for credentials (not auto-login)

**Success Criteria**:
- ✅ Redirect to Cognito logout endpoint observed
- ✅ Subsequent login requires re-authentication
- ✅ No SSO from cached Cognito session

### Test 3: Upstream IDP Logout Propagation

**Objective**: Determine if Cognito propagates logout to federated IdP

**Steps**:
1. Sign in using **Login.gov** (or other federated IdP)
2. Complete authentication and access dashboard
3. Open a **new browser tab**
4. Navigate to Login.gov directly: `https://secure.login.gov`
5. Verify you have an active session there
6. **Return to pilot app** and click "Sign Out"
7. **After logout completes**, go back to the Login.gov tab
8. Refresh the page or try to access a protected Login.gov resource
9. **Question**: Are you still logged in to Login.gov?

**Expected Results** (Based on Cognito Behavior):
- ❌ **Likely**: Login.gov session is **NOT** terminated
- ✅ Cognito session is terminated
- ✅ Application session is terminated

**Why**: Cognito typically does NOT implement full SAML SLO or OIDC RP-Initiated Logout propagation to upstream IdPs. This is a known limitation.

**Document Finding**: Note whether upstream logout works or not in your evaluation report.

### Test 4: Multi-Tab Session Consistency

**Objective**: Verify logout terminates sessions across all tabs

**Steps**:
1. Sign in to the application
2. Open dashboard in **Tab 1**
3. Open dashboard in **Tab 2** (same browser)
4. In **Tab 1**, click "Sign Out"
5. In **Tab 2**, try to refresh the page
6. **Expected**: Tab 2 should also redirect to login

**Success Criteria**:
- ✅ Logout affects all tabs/windows
- ✅ No stale sessions remain

### Test 5: Logout Parameter Validation

**Objective**: Verify correct parameters sent to Cognito

**Steps**:
1. Open browser Developer Tools → Network tab
2. Click "Sign Out"
3. Look for request to `/logout` endpoint
4. Verify parameters:
   ```
   client_id=5q5mnevpmi7mms0i8prrs4ihgk
   logout_uri=http://localhost:3000
   ```

**Success Criteria**:
- ✅ Correct client_id sent
- ✅ Correct logout_uri sent
- ✅ No errors in network response

## Known Limitations

### Cognito SLO Limitations

1. **No Upstream Propagation**: Cognito does **not** propagate logout to federated identity providers (Login.gov, SSO)
2. **Session Independence**: Each system (App → Cognito → Login.gov) maintains independent sessions
3. **User Education Required**: Users may need to manually log out of upstream IdPs for complete session termination

### Workarounds

**Option 1: User Guidance**
- Provide clear instructions: "To fully log out, also sign out of Login.gov"
- Add informational message on logout confirmation page

**Option 2: Manual Redirect** (Not Implemented)
- After Cognito logout, redirect user to Login.gov logout endpoint
- Requires knowing all possible upstream IdPs

**Option 3: Short Session Timeouts**
- Use shorter TTLs for Cognito sessions
- Reduces window of vulnerability if logout doesn't propagate

## Testing Checklist

Use this checklist when testing SLO:

- [ ] Test 1 - Local session clears
- [ ] Test 2 - Cognito session clears  
- [ ] Test 3 - Check upstream IDP (document result)
- [ ] Test 4 - Multi-tab consistency
- [ ] Test 5 - Logout parameters correct
- [ ] Verify no console errors during logout
- [ ] Confirm redirect back to app works
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)

## Troubleshooting

### Issue: User not redirected to Cognito logout

**Cause**: Custom logout handler not working  
**Check**: Verify `/api/auth/logout/route.ts` exists and is correct

### Issue: User auto-logs back in after logout

**Cause**: Cognito session not terminated  
**Check**: Verify `end_session_endpoint` is being called with correct parameters

### Issue: Logout redirect fails

**Cause**: Invalid `logout_uri` parameter  
**Check**: Ensure logout URI is registered in Cognito App Client settings under "Allowed sign-out URLs"

## Metrics to Collect

Document these findings:

- **Local Session Termination**: ✅ / ❌
- **Cognito Session Termination**: ✅ / ❌  
- **Upstream IDP Termination**: ✅ / ❌ / N/A
- **Multi-Tab Consistency**: ✅ / ❌
- **Logout Time**: [seconds]
- **User Experience Rating**: [1-5 scale]

## Conclusion Template

After testing, complete this assessment:

```
SLO Test Results - [Date]
========================

Local Session Termination: [PASS/FAIL]
Cognito Session Termination: [PASS/FAIL]
Upstream IDP Propagation: [YES/NO/NOT TESTED]

Limitations Identified:
1. [limitation 1]
2. [limitation 2]

Recommendation:
[GO / NO-GO for Cognito adoption based on SLO requirements]
```

---

**Document Version**: 1.0  
**Last Updated**: December 15, 2025  
**Purpose**: SLO testing methodology for NFIG evaluation
