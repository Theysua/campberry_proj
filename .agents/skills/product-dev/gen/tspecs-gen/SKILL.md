---
name: tspecs-gen
description: Generate test specifications and test cases from PRD or TRD documents. Use when users say "generate test cases", "test spec", "test plan", "QA spec", "acceptance tests", "create test scenarios", or need structured test cases with preconditions, steps, and expected results.
---

# Test Specifications Generator

Generate structured test case sets from product or technical requirement documents.

## When to use

- PRD or TRD is ready and you need test cases before development
- Need to ensure all requirements have corresponding test coverage
- Creating QA handoff documentation
- **Input typically from**: `prd-gen` or `trd-gen` output

## Inputs

- **Required**:
  - `source_doc`: PRD, TRD, or feature description to derive tests from
- **Optional**:
  - `test_level`: Unit / Integration / E2E / All (default: All)
  - `priority_filter`: Only generate tests for P0 / P0+P1 / All (default: All)
  - `format`: Table / Gherkin / Both (default: Table)

## Conventions

Follow `skills/product-dev/_shared/gen-conventions.md` for standard workflow, failure handling, and safety boundaries.

- **Metadata**: `type: TEST_SPEC`, version `1.0.0`
- **Naming**: `tspecs-<feature-name>-v1.0.0.md`

## Workflow Details

1. **Parse requirements**: Extract functional requirements, user stories, acceptance criteria, and NFRs from the source document.
2. **Map coverage**: Create a requirement-to-test mapping ensuring every P0 requirement has at least one test case.
3. **Generate test cases**: For each requirement: Test case ID (TC-NNN), Title, Preconditions, Steps, Expected result, Priority, Test level (Unit/Integration/E2E).
4. **Add edge cases**: For each P0 feature, at least one negative test and one boundary test.
5. **Coverage summary**: Traceability matrix (requirement ID → test case IDs).

**Output structure**:
```
## Test Suite: <Feature Name>
### Coverage Summary
| Requirement ID | Test Cases | Status |
### Test Cases
| TC-001 | Title | Preconditions | Steps | Expected | Priority | Level |
### Traceability Matrix
| Requirement | Test Cases |
```

**Tspecs-specific failure handling**:
- Source doc lacks acceptance criteria → derive testable criteria, mark `[DERIVED]`
- Ambiguous requirement → generate test for most likely interpretation, flag for review
- Too many requirements (> 50) → ask user to filter by priority
- Use synthetic data only — no real user data or credentials

## Examples

### Example 1: From user stories

**User**: Generate test cases from this PRD user story:
> US-01: As a user, I want to reset my password via email so that I can regain access. AC: Reset link sent within 30s, link expires in 24h, new password must meet strength rules.

**Expected Output**:

| ID | Title | Preconditions | Steps | Expected | Priority | Level |
|----|-------|---------------|-------|----------|----------|-------|
| TC-001 | Password reset email sent | User exists with verified email | 1. Go to login 2. Click "Forgot password" 3. Enter email 4. Submit | Reset email received within 30s | P0 | E2E |
| TC-002 | Reset link expiration | Reset email received > 24h ago | 1. Click reset link after 24h | Error: "Link expired, request a new one" | P0 | E2E |
| TC-003 | Weak password rejected | Valid reset link clicked | 1. Enter "123" as new password 2. Submit | Error: password strength requirements shown | P0 | Integration |
| TC-004 | Non-existent email | No account with email | 1. Enter unknown email 2. Submit | Same success message (no user enumeration) | P0 | E2E |
