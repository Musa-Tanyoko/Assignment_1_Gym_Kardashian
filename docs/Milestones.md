# Fitness App Build Milestones

This document contains a series of prompts to feed into Cursor to build the application according to the `technical-design-doc.md`.

Copy and paste the content of each "Prompt" block into Cursor sequentially.

---

## Milestone 1: Project Scaffolding (Monorepo)

**Goal:** Set up the PNPM Turborepo monorepo with root dependencies and configuration files.

**Prompt:**

```
Please scaffold the initial monorepo structure using PNPM Workspaces and Turborepo.

**1. Create the root directory and initialize Git:**
   - Initialize Git (`git init`).
   - Create a `.gitignore` file with common Node, Vite, Firebase, and OS files.

**2. Create the PNPM Workspace config:**
   - Create `pnpm-workspace.yaml` and define the workspaces:
     - `apps/*`
     - `functions`
     - `packages/*`

**3. Create the root `package.json`:**
   - Set `"private": true`.
   - Add scripts for Turborepo:
     - `"build": "turbo run build"`
     - `"dev": "turbo run dev --parallel"`
     - `"lint": "turbo run lint"`
     - `"typecheck": "turbo run typecheck"`
     - `"test": "turbo run test"`
     - `"format": "prettier --write \"**/*.{ts,tsx,md}\""`

**4. Install root dev dependencies (using `pnpm add -wD`):**
   - `turbo`
   - `typescript`
   - `prettier`
   - `eslint`
   - `eslint-config-prettier`
   - `eslint-plugin-perfectionist`
   - `@typescript-eslint/parser`
   - `@typescript-eslint/eslint-plugin`
   - `husky` (for pre-commit hooks)

**5. Create configuration files in the root:**
   - `turbo.json`:
     - Define a base pipeline for `dev`, `build`, `lint`, `test`.
     - Set `build` to depend on `^build` and output `dist/**`.
     - Set `dev` to be persistent.
   - `tsconfig.base.json`:
     - Create a base `tsconfig.json` that all other packages will extend. Include `strict: true`, `esnext` module/target, `jsx: "react-jsx"`, and `resolveJsonModule: true`.
   - `.prettierrc`:
     - Create a simple Prettier config (e.g., `singleQuote: true`, `semi: false`, `trailingComma: "es5"`).
   - `.eslintrc.json`:
     - Set up a base ESLint config using `typescript-eslint`, `prettier`, and `eslint-plugin-perfectionist`.
     - Enable `perfectionist/sort-imports`.
   - `lint-staged.config.js`:
     - Configure `lint-staged` to run `prettier --write` on staged files.
   - `.github/workflows/ci.yml`:
     - Create the CI pipeline based on the technical design document:
       - Setup PNPM, restore Turbo cache
       - `turbo run lint typecheck`
       - `turbo run test`
       - `turbo run build-storybook`
       - `turbo run e2e`

**6. Create the directory structure:**
   - `apps/web`
   - `functions`
   - `packages/shared`
   - `packages/seeding`
   - `docs`

**7. Create "placeholder" package.json files for each workspace:**
   - `apps/web/package.json` (name: `@fitness/web`)
   - `functions/package.json` (name: `@fitness/functions`)
   - `packages/shared/package.json` (name: `@fitness/shared`)
   - `packages/seeding/package.json` (name: `@fitness/seeding`)

**8. Add the TDD to the `docs` folder:**
   - Create `docs/technical-design-doc.md` and paste the full TDD provided into it.

Please generate all these files and configurations.
```

**Success Criteria:**
- ✅ Root `package.json` with Turborepo scripts
- ✅ `pnpm-workspace.yaml` configured
- ✅ `turbo.json` with pipeline definitions
- ✅ Base TypeScript, ESLint, and Prettier configs
- ✅ Directory structure for `apps/`, `functions/`, `packages/`
- ✅ Placeholder `package.json` for each workspace
- ✅ `.gitignore` and Git initialized
- ✅ GitHub Actions CI workflow
- ✅ Technical design document in `docs/`

---