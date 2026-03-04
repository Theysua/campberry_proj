# Workflow: api-first

API-driven development — starts from API design.

## Steps

```yaml
name: api-first
description: API documentation first, then TRD and test specs
steps:
  - skill: api-gen
    input_from: context
    output_key: api_docs
  - skill: api-validator
    input_from: api_docs
    gate: true
  - skill: trd-gen
    input_from: api_docs
    output_key: trd
  - skill: tspecs-gen
    input_from: api_docs
    output_key: test_specs
```
