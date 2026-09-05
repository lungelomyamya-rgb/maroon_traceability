# Test Layout Policy

This repository uses a **hybrid test layout** with an explicit placement rule.

## Directory roles

| Location | Purpose |
| -------- | ------- |
| `tests/` | Primary home for integration, feature, and cross-cutting tests |
| `src/__tests__/` | Unit tests tightly coupled to a single module under `src/` |

## When to use each

### `tests/`

Place tests here when they:

- Exercise multiple layers (adapters, repositories, application services)
- Cover auth, registration, or API behavior
- Validate types or transformers shared across features
- Run integration scenarios with mocked external services

Subdirectories mirror domains: `tests/auth/`, `tests/registration/`, `tests/integration/`, `tests/unit/`, `tests/types/`.

### `src/__tests__/`

Place tests here when they:

- Test a single utility or mapper colocated with its source
- Have no dependencies on other feature modules
- Serve as fast, module-scoped unit tests

Example: `src/__tests__/utils/profileDataMapper.test.ts` tests `src/utils/profileDataMapper.ts`.

## Naming conventions

- Files: `*.test.ts` or `*.test.tsx`
- Jest discovers both `tests/**` and `src/__tests__/**` via `jest.config.js`

## Ignored suites

The following suites are temporarily excluded in `jest.config.js` pending rewrite:

- `tests/registration/RegistrationRepository.test.ts` — legacy mock adapter assumptions
- `tests/auth/AuthApplication.test.ts` — outdated dynamic require paths / Hybrid stack

Re-enable only after aligning with the current Supabase auth stack (`userContext` + `RealAuthAdapter`).

**Tracked:** [Issue #10](https://github.com/lungelomyamya-rgb/maroon_traceability/issues/10) item **D8** (optional: re-enable or rewrite ignored Jest auth/registration suites). Do not remove `testPathIgnorePatterns` until those suites pass locally.

## CI requirements

- `passWithNoTests` is **disabled in CI** — empty test runs fail the pipeline
- Full suite runs on every PR via [node.yml](../../.github/workflows/node.yml)
- Pre-push hook runs `npm test` locally

## Adding new tests

1. Choose `tests/` unless the test only targets one `src/` file
2. Mirror existing patterns (Testing Library for components, mocks in `__mocks__/`)
3. Do not add tests under `src/features/*/dist/` or build output paths
