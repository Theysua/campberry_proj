---
name: flow
description: Execute named document workflows that chain multiple skills in sequence. Use when users say "run workflow", "execute flow", "new feature flow", "full document pipeline", "end-to-end docs", or need to orchestrate a sequence of gen/validate/iterate skills for a standard process like new feature development.
---

# Flow — Workflow Engine

Execute predefined or custom workflows that chain multiple skills together in a logical sequence.

## When to use

- Need to run a standard multi-step document pipeline (e.g., BRD → PRD → TRD → Tests)
- Want to automate a repeatable process across multiple skills
- Setting up a complete documentation suite for a feature
- **Orchestrates** other skills — does not generate documents directly

## Inputs

- **Required**:
  - `workflow`: Name of a predefined workflow OR custom step list
  - `context`: Input context passed to the first skill in the chain
- **Optional**:
  - `skip_steps`: Steps to skip (e.g., skip BRD if already exists)
  - `stop_after`: Stop after a specific step
  - `validate`: Run validators after each gen step (default: true)

## Predefined Workflows

Defined in `references/workflows/`:

### `new-feature`
Full feature documentation pipeline:
1. `brd-gen` → BRD
2. `brd-validator` → Validate BRD
3. `prd-gen` (input: BRD) → PRD
4. `prd-validator` → Validate PRD
5. `trd-gen` (input: PRD) → TRD
6. `trd-validator` → Validate TRD
7. `tspecs-gen` (input: PRD + TRD) → Test Specs
8. `trace-check` (input: all docs) → Traceability Report

### `quick-spec`
Lightweight spec generation (skips BRD):
1. `prd-gen` → PRD
2. `prd-validator` → Validate
3. `trd-gen` (input: PRD) → TRD
4. `trd-validator` → Validate

### `api-first`
API-driven development:
1. `api-gen` → API Documentation
2. `api-validator` → Validate
3. `trd-gen` (input: API docs) → TRD
4. `tspecs-gen` (input: API docs) → Test Specs

### `decision-record`
Architecture decision:
1. `adr-gen` → ADR
2. `adr-validator` → Validate
3. `change-impactor` → Impact Analysis

## Workflow

1. **Resolve workflow**: Load predefined workflow from `references/workflows/` or parse custom step list.

2. **Initialize context**: Set up shared context object that flows between steps.

3. **Execute steps sequentially**:
   - For each step: invoke the skill with accumulated context
   - Pass each step's output as input to the next step
   - If `validate: true`, run the corresponding validator after each gen step
   - If validator returns FAIL, pause and ask user whether to iterate or continue

4. **Handle checkpoints**: After each step, briefly report status and ask if user wants to review before proceeding.

5. **Final summary**: Report all generated documents, validation scores, and any outstanding issues.

## Output Contract

- **Format**: All individual skill outputs + a workflow summary
- **Summary structure**:
  ```markdown
  ## Workflow Summary: <workflow-name>

  ### Steps Completed
  | Step | Skill | Output | Validation | Score |
  |------|-------|--------|------------|-------|

  ### Generated Documents
  - ...

  ### Outstanding Issues
  - ...

  ### Next Steps
  - ...
  ```

## Failure Handling

- Skill step fails → report error, ask user whether to retry, skip, or abort
- Validator returns FAIL → pause, suggest running iteration skill, continue on user approval
- Unknown workflow name → list available workflows

## Safety Boundaries

- Always checkpoint between steps — never run the entire pipeline without user awareness
- Do not auto-iterate without user confirmation
- Each step clearly attributed to its source skill

## Examples

### Example 1: New feature workflow

**User**: Run the new-feature workflow for a "user notification system".

**Expected Output**: Step-by-step execution:
1. Generated BRD (score: 4.1 PASS)
2. Generated PRD from BRD (score: 3.8 NEEDS_WORK — missing NFR metrics)
3. → Pause: "PRD needs work. Run prd-iteration to fix, or continue?"
4. ... continues based on user choice
