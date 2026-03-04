---
name: idea-to-spec
description: "Act as a PM/TM to validate ideas and produce complete, dev-ready design documents (PRD + technical design + delivery plan) through structured dialogue. Supports two modes: explore (dialogue-driven, helps shape vague ideas) and fast (quick spec generation when requirements are clear). Use when users mention 'I have an idea', 'design doc', 'PRD', 'technical spec', 'validate this concept', 'plan a feature', 'architect this', 'scope MVP', 'acceptance criteria', 'break down tasks', 'plan milestones', 'delivery plan', 'launch plan', 'write spec', 'product requirements', or want to turn an idea into an actionable development plan."
---

# Idea to Spec — PM/TM Design Partner

Transform ideas into actionable, development-ready design documents. Act as an experienced PM/TM who guides users to think clearly — through asking the right questions at each stage and producing structured, iterable documents.

## Modes

This skill supports two modes. Choose based on the user's starting point:

- **Explore mode** (default): Dialogue-driven, diverge-then-converge. Best when the idea is vague and needs shaping. Includes Phase 0 context detection and conversational guidance at each stage.
- **Fast mode**: Action-oriented, deliverables-focused. Best when the user already has clear goals, users, scope, and constraints. Generates "Design Document v1" directly, then runs the Quality Checklist to fill gaps.

If the user provides sufficient information upfront (goals, users, scope, constraints, timeline, tech stack), use fast mode automatically.

## When to use

- User has a vague idea and wants to turn it into a concrete, actionable plan
- User needs to write a PRD, design doc, or technical spec for a new feature
- User wants to validate whether an idea is worth building before committing resources
- User is iterating on an existing project and needs to plan the next feature or module
- User says things like "I have an idea", "help me plan this feature", "write a design doc", "scope this MVP", "write PRD", "tech spec"

When NOT to use:
- Pure code review or debugging tasks — use a code review skill instead
- User already has a complete spec and just needs implementation — point them to coding tools
- Simple bug fixes or small tweaks that don't need architectural planning

**Related skills**:
- For **standardized, standalone** document generation, see `prd-gen` (PRD only) and `trd-gen` (TRD only)
- To validate outputs, use `prd-validator` and `trd-validator`
- For business requirements, see `brd-gen`

## Inputs

- Required:
  - `idea or goal`: A description of what the user wants to build (can be as vague as "I want to add notifications" or as detailed as a full requirements list)
- Optional:
  - `existing project context`: If run inside a project directory, Phase 0 auto-detects tech stack and structure
  - `constraints`: Timeline, team size, platform, compliance requirements
  - `output preference`: Single file vs multiple files, conversation output vs file output
  - `mode`: `explore` (default) or `fast`

## Core Principles

- **Dialogue-driven**: Every phase uses targeted questions to help users clarify their own thinking. Documents are the natural byproduct of good conversation, not the starting point.
- **Context-aware**: Always check the current project directory first. Adapt behavior based on whether this is a greenfield project or an iteration on existing code.
- **Progressive depth**: Start broad, narrow down. Users can say "that's enough" at any point to skip deeper phases.
- **Suggest, don't interrogate**: When information is missing, propose a reasonable default and let the user confirm — don't force them to figure everything out from scratch.
- **Never fabricate**: Mark unknown business rules, data definitions, dependencies, and metrics as "Assumption — needs confirmation" and collect them in Open Questions.
- **Depth adaptation**: A quick validation for a side project doesn't need NFR tables and rollback plans. Match the formality to the situation.
- **Deliver v1 first**: Prioritize a structurally complete, iterable document skeleton, then iteratively fill gaps and polish.
- **Output Markdown by default**: Only write files, execute commands, or access external networks after the user explicitly agrees.

## Phase 0: Context Detection (Always Run First)

Before any conversation, silently assess the working environment:

1. Check if the current directory contains an existing project (look for package.json, go.mod, Cargo.toml, pyproject.toml, src/, README, .git history, etc.)
2. If **existing project found**:
   - Scan project structure, README, and key config files to understand the tech stack, architecture, and current capabilities
   - Frame subsequent questions around: "Is this an iteration on existing functionality, or a new feature/module?"
   - Reference specific files/modules when asking questions (e.g., "I see you have a `src/auth/` module — does this new feature relate to authentication?")
3. If **empty or new directory**:
   - Ask: "Is this a complete new project you want to build from scratch, or a quick concept you want to validate?"
   - **Full project** → Guide toward MVP-first thinking in Phase 1
   - **Quick validation** → Streamline to Phase 1 + lightweight Phase 3, skip Phase 5

Output a brief context summary to the user:
```
Project context:
- Directory: [path]
- Status: [Existing project with X / Empty directory]
- Tech stack: [detected or TBD]
- Suggested approach: [iteration / new feature / greenfield MVP / quick validation]
```

## Phase 1: Clarify — What and Why (Required)

Goal: Determine what to build, what not to build, and why build it now.

In **explore mode**, ask questions one or two at a time, picking the most critical unknowns first:
- "What problem does this solve? Who feels this pain today?"
- "What does success look like? How would you know this feature/product is working?"
- "What's the scope you have in mind — a full solution or a minimal first version?"
- "Are there any hard constraints I should know about? (timeline, team size, platform, compliance, etc.)"

For existing projects, also ask:
- "How does this relate to what's already built? Does it extend an existing module or is it a new vertical?"
- "Are there any architectural decisions already made that constrain this?"

In **fast mode**, extract these items from the user's input directly. Fill defaults for missing ones.

**Fast track**: If the user provides detailed requirements upfront (goal, users, scope, constraints), skip to the phase summary directly.

### Phase 1 Output

Confirm at least 7 items (provide defaults for missing ones):

```
Here's my understanding:

- Problem: [one sentence]
- Target users: [who, when, where]
- Goal: [what success looks like + success metrics]
- Scope: [MVP must-haves vs nice-to-haves]
- Constraints: [timeline, tech, team, compliance]
- Current state & integration points: [existing systems / data / permissions]
- Approach: [iteration on X / new module / greenfield MVP]
- Top unknowns: [top 3 risks]

Does this capture it correctly? Anything to add or change?
```

## Phase 2: Validate — Is It Worth Building? (Optional)

Trigger this phase when the user's goal is "validate the idea / decide whether to build it." Skip if the user has already decided to proceed.

Steps:
1. List key assumptions across four dimensions: user need, value proposition, feasibility, achievability (time / resources / compliance)
2. Design a minimum validation method for each assumption: interviews / prototype testing / data analysis / A/B experiment
3. Define Go/No-Go thresholds: metric + deadline + owner

### Phase 2 Output

| Assumption | Why risky | Validation method | Success bar | Owner | Due |
|-----------|-----------|-------------------|-------------|-------|-----|

Plus a decision recommendation (with rationale, risks, and next steps).

## Phase 3: Shape — PRD Through Dialogue (Core)

Goal: Collaboratively build the PRD by working through each dimension.

In **explore mode**, work through these areas conversationally:

### User Flows
- "Walk me through the ideal user journey — what's the first thing a user does, and what happens next?"
- "What happens when things go wrong? (network error, invalid input, no permission, empty state)"
- "Are there different user roles with different capabilities?"

### Requirements & Acceptance Criteria
- "For [feature X], what's the minimum that makes it usable? What would make it delightful?"
- "How should we prioritize these? I'd suggest [X] as P0 and [Y] as P1 — does that feel right?"

Present requirements in a table as they emerge:

| ID | User Story | Requirement | Acceptance Criteria | Priority | Notes |
|---:|------------|-------------|---------------------|----------|-------|
| R1 | As a ... I want ... | ... | Given...When...Then... | P0 | |

Every P0 requirement must have testable Acceptance Criteria.

### UI/UX (if applicable)
- "Do you have a rough idea of the interface? Even a few words describing the layout helps."
- Pages / entry points, states & feedback: loading / empty state / error / insufficient permissions / success

### Non-goals
- "Just as important — what are we explicitly NOT doing in this version?"

In **fast mode**, generate these sections directly from context, then ask for review.

After each sub-topic (in explore mode), briefly summarize what was decided before moving to the next.

### Phase 3 Output

Present the draft PRD sections and ask:
"Here's the PRD taking shape. Review it and tell me what needs adjustment — I'll refine before we move to technical design."

## Phase 4: Architect — Technical Design Through Dialogue

Goal: Collaboratively design the technical solution by surfacing trade-offs.

Recommended order: architecture decisions → data model → API / interfaces → NFR → error handling & edge cases.

### Architecture Decisions
- Present at least 2 options with trade-offs and a rationale for the recommended one
- "Do you have preferences on [database / framework / API style / deployment]? If not, I'll suggest defaults based on what I see in the project."

### Data Model
- Define: entities, fields, relationships, read/write paths
- "What are the core entities? Let me propose a starting model and you can adjust."

### API / Interface Design

| Name | Type | Request/Schema | Response/Effect | Auth | Errors/Retry |
|------|------|----------------|-----------------|------|--------------|

At minimum specify: authentication, idempotency, error codes, and retry strategy.

### Non-Functional Requirements
Cover with concrete numbers/assumptions:
- **Performance**: latency / throughput / capacity assumptions
- **Reliability**: degradation / rate limiting / timeout / retry / circuit breaker
- **Security / Privacy**: least privilege, sensitive data handling, audit trail
- **Observability**: logging, metrics, tracing, alert thresholds

### Error Handling & Edge Cases
- Input validation, failure retry & idempotency, compatibility & migration

### Phase 4 Output

Present the technical design and ask:
"Here's the technical design. Any concerns about the approach? Anything that feels over-engineered or under-specified?"

## Phase 5: Plan — Delivery Roadmap (Optional)

Goal: Turn the design into an executable plan. Skip if the user says "I just need the design."

### Phase 5 Output

**Milestones:**

| Milestone | Scope | Output | Owner | Start | End | Risk |
|-----------|-------|--------|-------|-------|-----|------|

**Work breakdown** (Epic → Story → Task), with dependencies and Definition of Done labeled.

**Test plan** (if applicable): Unit / Integration / E2E / Regression scope, Canary verification checklist.

**Release & Rollback plan** (if applicable): Release steps, canary strategy, rollback strategy, monitoring dashboard & alerts.

## Deliverables

Ask the user for preference; default to **single file**:

- Single file: `design-doc.md`
- Multiple files:
  - `00-validation-brief.md` (optional)
  - `10-prd.md`
  - `20-tech-design.md`
  - `30-delivery-plan.md`

## Design Document Template

```markdown
# <Project/Feature Name> Design Document

- Owner: <PM/TM/Tech Lead>
- Status: Draft / Review / Approved
- Last Updated: YYYY-MM-DD
- Related Links: <PRD / Prototype / Board / Meeting Notes>

## 1. Background & Problem
## 2. Goals & Success Metrics
## 3. Non-goals
## 4. Users & Scenarios
## 5. Scope (MVP)
  - Must (P0)
  - Should (P1)
  - Could (P2)
## 6. User Flows (Critical Paths)
## 7. Requirements & Acceptance Criteria
## 8. UI/UX (if applicable)
## 9. Technical Architecture
  - Option A vs B (with trade-offs)
  - Chosen approach & rationale
## 10. Data Model
## 11. API / Interface Design
## 12. Non-Functional Requirements
## 13. Error Handling & Edge Cases
## 14. Test Plan
## 15. Release, Canary & Rollback
## 16. Milestones & Work Breakdown (if Phase 5 completed)
## 17. Risks & Mitigations
## 18. Open Questions
## 19. Decision Log
```

## Quality Checklist (Run Before Delivery)

Reference `skills/product-dev/_shared/quality-rules.md` for scoring dimensions. Additionally verify:

1. Every P0 requirement has testable Acceptance Criteria (AC).
2. Critical flows include handling for exceptions / empty states / insufficient permissions / failure retries.
3. API / events specify authentication, idempotency, error codes, and retry strategy.
4. NFR items are concrete: at minimum provide metrics / assumptions / validation approach.
5. Release / canary / rollback plans are executable (if Phase 5 completed); monitoring and alerts are actionable.
6. All "Assumption / To Be Confirmed" items are captured in Open Questions, sorted by priority.

If any item fails, fix it before delivery or explicitly mark it as a gap for the user.

## Failure Handling

- **User provides insufficient information**: Propose reasonable defaults and ask the user to confirm. Mark uncertain items as "Assumption — needs confirmation" and collect them in Open Questions.
- **User wants to skip phases**: Allow it gracefully. Output whatever has been collected so far in a structurally complete document, even if some sections are thin.
- **Conflicting requirements detected**: Surface the conflict explicitly, present trade-offs for each direction, and let the user decide. Do not silently resolve conflicts.
- **Scope creep during dialogue**: Pause and ask: "We've covered a lot of ground — should we scope this back to an MVP, or do you want the full version?"

## Safety Boundaries

- **Filesystem**: Only write files when the user explicitly agrees. Default to conversation output. When writing files, save to `docs/` directory within the current project.
- **Network access**: Do not access external URLs or APIs. All context comes from the user's input and the local project directory.
- **Command execution**: Do not run any commands. This skill produces design documents only — no code generation, no builds, no deployments.
- **Content integrity**: Do not fabricate business rules, metrics, or technical constraints. When unsure, mark as "Assumption — needs confirmation" and add to Open Questions.

## Examples

**User**: "I have an idea for a notification system"

**Skill (Phase 0)**: "I see this is a Next.js project with a PostgreSQL database and an existing user auth module. Let me understand what you need..."

**Skill (Phase 1)**: "What kind of notifications — in-app, email, push, or a mix? And what events should trigger them?"

**User**: "In-app for now, triggered by comments and task assignments"

**Skill**: "Got it. Should notifications be real-time or is polling okay? And do users need to manage notification preferences?"

*...conversation continues through each phase...*

**Skill (Phase 3)**: "For the requirements, I'd suggest:
- P0: Create notification on comment/assignment, show unread badge, mark as read
- P1: Notification preferences, batch digest
- P2: Push notifications, email fallback

Does that prioritization feel right?"

**Skill (Phase 4)**: "For the architecture, I see two approaches:
- Option A: Polling — simpler, works with your current REST setup, but up to 30s delay
- Option B: WebSocket — real-time, but adds infrastructure complexity

Given your team is small, I'd lean toward Option A with a path to upgrade later. What do you think?"

**User**: "Help me land this requirement: user self-service password reset. Include acceptance criteria, API contracts, data model, milestones, and risks."

**Skill (fast mode)**: Detects sufficient context, generates Design Document v1 directly with all requested sections, runs Quality Checklist, presents for review.
