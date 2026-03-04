# Gen Skill Conventions

> Standard workflow, safety, and failure handling rules shared by all document generation skills under `gen/`.
> Each gen skill MUST follow these conventions unless explicitly overridden.

## Standard Workflow

Every gen skill follows this 5-step workflow:

1. **Collect context**: Read provided inputs. If the primary input is thin, ask up to 5 clarifying questions (fewer for simpler document types). Do not ask more than 2 rounds of questions.

2. **Load schema**: Reference the corresponding schema in `skills/product-dev/_shared/doc-schemas/<type>-schema.md`. Skip this step for utility skills (mermaid-gen, weekly-report-gen) that have no formal schema.

3. **Generate document**: Produce all required sections per the loaded schema. Follow `skills/product-dev/_shared/output-conventions.md` for versioning, naming, and frontmatter format.

4. **Self-check**: Validate the generated output against `skills/product-dev/_shared/quality-rules.md` scoring dimensions (Completeness, Consistency, Clarity, Testability). Target overall score ≥ 3.5 before presenting.

5. **Present**: Output the document with YAML frontmatter metadata (type, version `1.0.0`, status `Draft`, date, changelog). For utility skills without formal document structure, skip frontmatter.

## Output Standards

- **Format**: Markdown with YAML frontmatter (formal docs) or plain Markdown (utility skills)
- **File naming**: `<type-lowercase>-<name>-v<version>.md` per output-conventions.md
- **Line limit**: Keep output under 500 lines; move detailed content to appendix
- **Placeholders**: When information is unavailable, use these markers:
  - `[PLACEHOLDER]` — section needs user input
  - `[ASSUMED]` — reasonable default applied, needs confirmation
  - `[ESTIMATE]` — rough figure, not verified
  - `[DEFAULT]` — industry standard default applied
  - `[DERIVED]` — inferred from context
  - `[INFERRED]` — inferred from limited information
  - `[PROPOSED]` — suggested by skill, awaiting approval
  - `[RESEARCHED]` — based on domain knowledge, not verified data

## Failure Handling

All gen skills handle failures gracefully:

- **Vague input after 2 rounds of questions** → Produce a partial document with `[PLACEHOLDER]` markers for incomplete sections. List what information is still needed.
- **Cannot estimate a value** → Include the field with a note explaining what data points are needed.
- **Input too complex for single document** → Recommend splitting and provide skeleton for each part.
- **Missing optional context** → Use reasonable defaults, clearly marked with appropriate placeholder tags.

## Safety Boundaries

All gen skills observe these rules:

1. **No fabrication** — Do not invent data, metrics, benchmarks, or research findings. Mark estimates and assumptions with appropriate placeholder tags.
2. **No external access** — Do not access external URLs or APIs.
3. **No file modification** — Do not modify existing files unless the user explicitly instructs.
4. **No command execution** — Do not run commands unless the skill's workflow specifically requires it (e.g., weekly-report-gen reading git log).
5. **No sensitive data** — Do not include real credentials, tokens, internal IPs, or PII in examples.
