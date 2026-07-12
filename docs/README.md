# EcoSphere Development & Collaboration Guidelines

Welcome to the EcoSphere ESG Platform development workspace. This document outlines the standards, structures, and tools to help the 4 team members work together concurrently with minimal merge conflicts.

---

## 1. Branching Strategy (Avoiding Conflicts)
To avoid overwriting each other's code, we follow a strict **Feature-Branch Git Flow**:

* **`main`**: The stable branch. Do not commit directly to `main` after this initialization.
* **`feature/<name>-<topic>`**: Create individual branches for new developments. E.g., `feature/vijay-auth` or `feature/sham-emission-factors`.
* **Prisma schema edits**: To avoid database migration conflicts, only **one developer** should edit `backend/prisma/schema.prisma` at a time. Coordinate schema changes in team chat before making them.

### Committing Conventions
Use **Conventional Commits** for readability and automated changelogs:
* `feat(frontend): add carbon transaction table`
* `fix(backend): fix user role authorization middleware`
* `docs: update deployment guidelines`
* `chore: update package dependencies`

---

## 2. Workspace Architecture

### Shared Package (`shared/`)
* Contains domain TypeScript types/interfaces (`shared/types/index.ts`).
* Both the `frontend` and `backend` packages import these types.
* If you modify a database entity or model, you **must** update the corresponding type file under `shared/types/index.ts`.

### Backend (`backend/`)
* **Framework**: Express + TypeScript.
* **ORM**: Prisma connecting to PostgreSQL.
* Keep routes, controllers, and services decoupled:
  - `routes/`: Define API endpoints and plug in middlewares.
  - `controllers/`: Handle HTTP requests and inputs parsing.
  - `services/`: Encapsulate core business logic and direct database queries via Prisma.
  - `middleware/`: Auth validation, schema checking (Zod), and error handlers.

### Frontend (`frontend/`)
* **Framework**: React 19 + Vite + TailwindCSS.
* **Path Mapping**: Always use `@/*` for absolute imports mapping to `frontend/src/*`. Avoid relative nesting like `../../components`.
* **Queries/Mutations**: Always wrap api calls using TanStack React Query (`@tanstack/react-query`) hooks to handle caching, loading, and error states gracefully.
* **Form validation**: Utilize `react-hook-form` paired with `zod` schemas for client-side field validation.

---

## 3. Database Migration Workflows
When you need to make changes to the database structure:
1. Update `backend/prisma/schema.prisma`.
2. Run migration dev to sync your local Postgres database:
   ```bash
   npm run prisma:migrate --workspace=backend -- --name <migration_name>
   ```
3. Commit both the `schema.prisma` change and the generated migration folder under `backend/prisma/migrations/`.
4. Pull the changes locally and run `npm run prisma:generate` to rebuild your client.
