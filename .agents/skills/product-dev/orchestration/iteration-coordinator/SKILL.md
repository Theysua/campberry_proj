---
name: iteration-coordinator
description: Coordinate multi-document iteration when a change affects multiple project documents. Use when users say "update all docs", "cascade change", "multi-doc iteration", "propagate changes", "sync documents", or need to apply a change across BRD, PRD, TRD, and test specs while maintaining consistency.
---

# Iteration Coordinator

Orchestrate multi-document iteration by running change impact analysis, then sequentially updating affected documents while maintaining cross-document consistency.

## When to use

- A change affects multiple documents (e.g., scope change impacts BRD, PRD, TRD)
- After `change-impactor` identifies multiple documents needing updates
- Need to ensure all project documents stay in sync after a change
- **Orchestrates** iteration and validator skills — does not modify documents directly

## Inputs

- **Required**:
  - `change_description`: What changed and why
- **Optional**:
  - `docs_directory`: Path to project documents (default: `docs/`)
  - `impact_report`: Pre-computed impact report from `change-impactor` (skips re-analysis)
  - `auto_validate`: Run validators after each iteration (default: true)

## Workflow

1. **Assess impact**: If no `impact_report` provided, run `change-impactor` to identify affected documents and recommended update order.

2. **Plan iteration sequence**: Order documents by dependency (upstream first):
   - BRD → PRD → TRD → API → TEST_SPEC
   - ADRs updated in parallel if affected

3. **Iterate sequentially**: For each affected document in order:
   a. Show the user what will change in this document
   b. Run the corresponding iteration skill (e.g., `prd-iteration`)
   c. If `auto_validate`, run the corresponding validator
   d. Report results, ask user to confirm before proceeding to next document

4. **Cross-consistency check**: After all iterations:
   - Run `trace-check` on updated documents
   - Flag any new inconsistencies introduced

5. **Final summary**: Report all changes, version bumps, and remaining issues.

## Output Contract

- **Format**: Coordination report + all updated documents
- **Structure**:
  ```markdown
  ## Iteration Coordination Report

  ### Change
  <description>

  ### Documents Updated
  | Document | Version Change | Iteration Result | Validation Score |
  |----------|---------------|------------------|------------------|

  ### Cross-Consistency
  - Trace check result: PASS / NEEDS_WORK
  - New gaps: ...

  ### Remaining Issues
  - ...
  ```

## Failure Handling

- Iteration skill fails on a document → report error, ask to skip or retry
- Validator FAIL after iteration → offer to re-iterate or accept as-is
- Circular dependency detected → break cycle, warn user
- Too many documents affected (> 10) → ask user to prioritize

## Safety Boundaries

- Always confirm with user before each document modification
- Never auto-commit changes — present diffs for review
- Do not modify documents that were explicitly excluded
- Checkpoint after each document iteration

## Examples

### Example 1: Auth system migration

**User**: We're migrating from session auth to JWT. Update all project docs.

**Expected Output**:

```
Impact Analysis: 5 documents affected
  1. ADR (new: ADR-005 JWT migration) — HIGH
  2. PRD (auth requirements section) — HIGH
  3. TRD (auth architecture, API security) — HIGH
  4. API docs (auth headers) — MEDIUM
  5. Test specs (auth test cases) — MEDIUM

Starting iteration sequence...

Step 1/5: Creating ADR-005...
  ✓ ADR created, validation: PASS (4.5/5)

Step 2/5: Updating PRD auth requirements...
  ✓ PRD updated 1.2.0 → 1.3.0, validation: PASS (4.0/5)

[Continue?]
```

## References

- `skills/product-dev/_shared/output-conventions.md` — Version bump rules
- `skills/product-dev/_shared/quality-rules.md` — Validation scoring
