---
name: project-init
description: Initialize a project documentation structure with document stubs. Use when users say "init project", "project setup", "create project docs", "bootstrap project", "scaffold docs", or need to set up the standard directory and document skeleton for a new project.
---

# Project Initializer

Generate a project documentation directory structure with stub documents for each document type.

## When to use

- Starting a brand new project and need the documentation skeleton
- Setting up standardized doc structure for an existing project
- Onboarding a project to the document management workflow
- **First step** in a typical project lifecycle, before running gen skills

## Inputs

- **Required**:
  - `project_name`: Name of the project (used in file naming)
- **Optional**:
  - `project_type`: webapp / mobile / api / library / data-pipeline (affects which doc types to include)
  - `doc_types`: Override which documents to create — BRD / PRD / TRD / ADR / API / TEST_SPEC (default: all applicable)
  - `description`: Brief project description (pre-populates Background sections)
  - `team`: Team members and roles (pre-populates Stakeholder sections)

## Workflow

1. **Determine doc set**: Based on project_type, select applicable document types:
   - webapp/mobile: BRD + PRD + TRD + ADR + API + TEST_SPEC
   - api: PRD + TRD + ADR + API + TEST_SPEC
   - library: TRD + ADR + TEST_SPEC
   - data-pipeline: BRD + TRD + ADR

2. **Create directory structure**:
   ```
   docs/
   ├── brd/
   ├── prd/
   ├── trd/
   ├── adr/
   ├── api/
   ├── test-specs/
   └── reports/
   ```

3. **Generate stub documents**: For each doc type, create a stub with:
   - Complete YAML frontmatter (version 0.1.0, status Draft)
   - All required section headings from the corresponding schema
   - `[TODO]` placeholders for content
   - Pre-populated fields from inputs (project name, description, team)

4. **Create index file**: Generate `docs/README.md` with:
   - Project overview
   - Document inventory table
   - Workflow guide (which skill to use for each document)

5. **Present**: Summary of created files and suggested next steps.

## Output Contract

- **Format**: Directory structure with Markdown files
- **Stub quality**: Each stub has valid frontmatter and all required headings
- **Index**: `docs/README.md` with document inventory
- **Next steps**: Recommended skill execution order

## Failure Handling

- Directory already exists → warn, ask whether to merge or skip existing files
- Invalid project type → list valid types, ask user to choose
- No description provided → create minimal stubs with `[TODO]` throughout

## Safety Boundaries

- Ask before overwriting existing files
- Do not delete any existing content
- Create only in specified directory (default: `docs/`)

## Examples

### Example 1: Web app project

**User**: Initialize docs for project "smart-checkout", it's a web app for e-commerce checkout optimization.

**Expected Output**:

```
Created project documentation structure:

docs/
├── README.md                              (Project index)
├── brd/
│   └── brd-smart-checkout-v0.1.0.md       (BRD stub)
├── prd/
│   └── prd-smart-checkout-v0.1.0.md       (PRD stub)
├── trd/
│   └── trd-smart-checkout-v0.1.0.md       (TRD stub)
├── adr/
│   └── (empty — create ADRs as decisions arise)
├── api/
│   └── api-smart-checkout-v0.1.0.md       (API doc stub)
├── test-specs/
│   └── (empty — generate after PRD/TRD)
└── reports/
    └── (empty — for validation reports)

Suggested next steps:
1. Run `brd-gen` to flesh out the BRD
2. Run `prd-gen` to define product requirements
3. Run `trd-gen` to create technical design
4. Run `tspecs-gen` to generate test cases
```
