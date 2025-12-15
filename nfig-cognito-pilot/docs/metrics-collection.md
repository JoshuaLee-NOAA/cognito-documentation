# Integration LOE Metrics Collection Guide

## Overview

This guide provides a framework for measuring and documenting the Level of Effort (LOE) required to integrate with AWS Cognito as an Enterprise Authentication Proxy. These metrics are critical for the go/no-go decision on Cognito adoption.

## Key Metrics to Track

### 1. Integration Time (Primary Metric)

**Target**: ≤8 hours for OIDC-experienced developer

Track time spent in these phases:

| Phase | Description | Target Time | Actual Time |
|-------|-------------|-------------|-------------|
| **Setup** | Environment configuration, obtain credentials | 1 hour | _____ |
| **Development** | Implement auth flow, callbacks, token handling | 2-3 hours | _____ |
| **Token Integration** | Capture tokens, implement claims access | 2 hours | _____ |
| **Debug/Testing** | Troubleshoot issues, verify functionality | 1-2 hours | _____ |
| **Documentation** | Document integration process | 1 hour | _____ |
| **TOTAL** | | **6-8 hours** | **_____** |

### 2. Claim Completeness (Critical)

**Target**: ≥80% of expected claims present

**Measurement Method**:
1. List all claims expected from upstream IdP (e.g., Login.gov)
2. Authenticate through Cognito
3. Use Debug Dashboard to inspect tokens
4. Calculate percentage

**Template**:
```
Expected Claims from Login.gov:
1. [ ] sub (user ID)
2. [ ] email
3. [ ] email_verified
4. [ ] given_name
5. [ ] family_name
6. [ ] phone_number (if requested)
7. [ ] address (if requested)
8. [ ] verified_at
9. [ ] ial (Identity Assurance Level)
10. [ ] aal (Authentication Assurance Level)

Claims Present in ID Token: ___/10
Claims Present in Access Token: ___/10
Claims Present in UserInfo: ___/10

Claim Completeness Score: ____%
```

### 3. Protocol Asymmetry Impact

**Question**: How much refactoring is required due to SAML→OIDC conversion?

Rate on 1-5 scale:
- **1**: No impact - App already used OIDC
- **2**: Minimal - Simple config changes
- **3**: Moderate - Some code refactoring needed
- **4**: Significant - Major architectural changes
- **5**: Severe - Complete rewrite required

**Score**: _____

**Description of Impact**: 
```
[Describe specific changes required due to protocol conversion]
```

### 4. Single Logout Effectiveness

**Target**: 100% session termination

Measure these sub-metrics:

| Component | Working? | Notes |
|-----------|----------|-------|
| Local session cleared | ✅ / ❌ | |
| Cognito session cleared | ✅ / ❌ | |
| Upstream IDP session cleared | ✅ / ❌ / N/A | |
| Multi-tab consistency | ✅ / ❌ | |

**SLO Score**: 
- Full (100%): All components working
- Partial (50-75%): Local + Cognito work, upstream doesn't
- Minimal (25%): Only local session clears
- None (0%): Sessions persist after logout

**Score**: _____

### 5. Developer Experience

Rate on 1-5 scale (5 = excellent):

| Aspect | Rating | Comments |
|--------|--------|----------|
| Documentation quality | ___/5 | |
| Error messages clarity | ___/5 | |
| Debug tooling | ___/5 | |
| Time to first success | ___/5 | |
| Overall satisfaction | ___/5 | |

**Average DX Score**: _____/5

## Data Collection During Integration

### Daily Log Template

```markdown
## Integration Log - Day [X] - [Date]

**Time Spent**: _____ hours

**Tasks Completed**:
- [ ] Task 1
- [ ] Task 2

**Blockers Encountered**:
1. [Blocker description]
   - Time lost: _____ minutes
   - Resolution: [how it was resolved]

**Claims Verified**:
- ID Token: [X] claims found
- Access Token: [X] claims found

**Notes**:
[Any observations about the integration process]
```

### Issue Tracker

Document all issues encountered:

| Issue # | Description | Time Lost | Severity | Resolution |
|---------|-------------|-----------|----------|------------|
| 1 | | | High/Med/Low | |
| 2 | | | | |

## Post-Integration Evaluation

### Claim Mapping Analysis

For each expected claim, document:

```yaml
email:
  expected: true
  present_in_id_token: true
  present_in_access_token: false
  source: Login.gov
  mapping_required: true
  mapping_difficulty: easy/medium/hard
  
cognito:groups:
  expected: true
  present_in_id_token: true
  source: Cognito User Pool
  notes: "Requires attribute mapping in Cognito console"
```

### "Protocol Tax" Assessment

Calculate the extra work required due to SAML→OIDC conversion:

**Hours Breakdown**:
- Understanding protocol differences: _____ hours
- Refactoring authentication flow: _____ hours
- Updating token validation logic: _____ hours
- Claim mapping configuration: _____ hours
- Testing protocol-specific behavior: _____ hours

**Total "Protocol Tax"**: _____ hours

**Percentage of Total Integration Time**: _____%

## Final Evaluation Report Template

```markdown
# NFIG Cognito Integration Evaluation Report

**Date**: [Date]  
**Evaluator**: [Name]  
**Application**: [App Name]

## Executive Summary

[2-3 sentence summary of findings]

## Integration Metrics

### Time Investment
- **Total Integration Time**: _____ hours
- **Target**: 6-8 hours
- **Status**: ✅ Within target / ❌ Exceeded target
- **Variance**: +/-_____ hours

### Claim Completeness
- **Claims Present**: ____%
- **Target**: ≥80%
- **Status**: ✅ Met / ❌ Not met

### SLO Effectiveness
- **Score**: [Full / Partial / Minimal / None]
- **Critical Issues**: [List if any]

### Protocol Asymmetry Impact
- **Rating**: ___/5
- **Protocol Tax**: _____ hours (___% of total)

## Findings

### What Worked Well
1. [Finding 1]
2. [Finding 2]

### Challenges Encountered
1. [Challenge 1]
2. [Challenge 2]

### Known Limitations
1. **Claim Passthrough**: [Description]
2. **Single Logout**: [Description]
3. **Protocol Asymmetry**: [Description]

## Recommendation

**GO / NO-GO**: [Decision]

**Rationale**: 
[Explain the recommendation based on metrics collected]

**Conditions** (if conditional GO):
1. [Condition 1]
2. [Condition 2]

## Appendices

### A. Claim Mapping Details
[Detailed claim-by-claim analysis]

### B. Integration Timeline
[Day-by-day breakdown]

### C. Issue Log
[All issues encountered with resolutions]
```

## Success Criteria Reference

From the PRD, the PoC is successful if:

| Criterion | Target | Measurement | Result |
|-----------|--------|-------------|--------|
| **Claim Passthrough** | ≥80% | Count present claims | ___% |
| **SLO Effectiveness** | 100% | Test all scenarios | ___% |
| **Integration LOE** | ≤8 hours | Track actual time | ___ hrs |

**Overall Success**: ✅ / ❌

## Next Steps After Evaluation

Based on results:

**If GO**:
1. Present findings to architecture review board
2. Plan pilot deployment to test environment
3. Develop production migration strategy

**If NO-GO**:
1. Document reasons for rejection
2. Evaluate alternative solutions
3. Provide recommendations for future evaluation

---

**Document Version**: 1.0  
**Last Updated**: December 15, 2025  
**Purpose**: Systematic LOE tracking for Cognito evaluation
