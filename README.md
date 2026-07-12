# EcoSphere ESG Management Platform

Welcome to the **EcoSphere ESG Management Platform**, an enterprise-grade sustainability, carbon ledger, and compliance tracking workspace built for the **Odoo Hackathon 2026**.

This repository is initialized with a robust, strict-TypeScript monorepo foundation that separates concerns between Frontend, Backend, and Shared packages, allowing all 4 team members to collaborate in parallel.

---


## videp link 
https://youtu.be/bbhAksEcu3Y

## 🚀 Quick Start

### 1. Prerequisites
Make sure you have the following installed on your machine:
* **Node.js** (v18+ recommended)
* **PostgreSQL** running locally on port `5432`

### 2. Setup Environment
Ensure your local PostgreSQL password matches the default configuration in `backend/.env` (default is `12345678`):
```env
DATABASE_URL="postgresql://postgres:12345678@localhost:5432/ecosphere?schema=public"
```
*(If your local PostgreSQL credentials differ, update the password in `backend/.env` accordingly).*

### 3. Installation & Database Sync
Run the following commands from the **root directory** of the repository:

```bash
# 1. Install all dependencies across all workspaces
npm install

# 2. Run Prisma migrations to create the database tables
npm run prisma:migrate --workspace=backend -- --name init

# 3. Build all workspace projects to verify compilation
npm run build
```

### 4. Running the Development Server
Run the frontend and backend servers concurrently:
```bash
npm run dev
```
* **Frontend UI**: http://localhost:3000 (React, Vite)
* **Backend API**: http://localhost:5000 (Express)

To log in to the portal, you can use:
* **Email**: `admin@ecosphere.com` (forces Admin role layout) or any employee email
* **Password**: `password123` (or any dummy password)

---

## 📁 Repository Directory Structure

```text
├── .github/workflows/          # Continuous Integration configs
├── docs/                       # Developer guidelines and collaboration rules
├── shared/                     # Shared monorepo packages
│   └── types/index.ts          # Common TypeScript interfaces (Models & Enums)
├── backend/                    # Node.js + Express API Server
│   ├── prisma/                 # Database schema models (17 entities) & migrations
│   └── src/
│       ├── index.ts            # API Server entry point & routing hooks
│       ├── controllers/        # Request handlers & parsing
│       ├── routes/             # Express routes definition
│       └── services/           # DB transactional logic
└── frontend/                   # React 19 + Vite client
    ├── index.html              # Main mount page
    ├── vite.config.ts          # Absolute path mappings & proxies
    ├── src/
        ├── App.tsx             # Providers wrapper (Query, Auth, Theme)
        ├── main.tsx            # Application entry mount
        ├── components/
        │   ├── ui/             # Reusable base Tailwind components (Button, Modal, Card...)
        │   ├── layout/         # Enterprise Sidebar, Navbar, Mobile Drawer
        │   └── charts/         # Reusable Recharts chart templates
        ├── pages/              # Lazy-loaded views (Dashboard, Environmental, Social, Copilot...)
        ├── contexts/           # Auth and Theme State providers
        └── routes/             # AppRoutes config & lazy loading setup
```

---

## 🛠️ Developer Commands Reference

Run these commands from the **root** folder:

| Command | Action |
| :--- | :--- |
| `npm install` | Installs dependencies globally and links workspaces |
| `npm run dev` | Spins up Vite dev server (port 3000) and Express (port 5000) in parallel |
| `npm run build` | Validates TypeScript check and compiles production bundles |
| `npm run format` | Runs Prettier format rules workspace-wide |
| `npm run prisma:generate --workspace=backend` | Re-generates the local Prisma Client |
| `npm run prisma:migrate --workspace=backend` | Generates a new SQL database migration |

---

## 🤝 Collaboration Assignments (Hackathon Plan)
To work in parallel with zero merge conflicts, we recommend dividing task areas:
1. **Developer 1 (Auth & Governance)**: Build out user profile registration, audit ledger, and policy endpoints.
2. **Developer 2 (Environmental Carbon Ledger)**: Build carbon transactions input grids, department calculators, and Scope emissions.
3. **Developer 3 (Social volunteering & Rewards)**: Build community CSR activities, gamified employee challenges, and badge awarding.
4. **Developer 4 (AI Advisor & Reports)**: Integrate AI Copilot chat services (OpenAI/Gemini integrations) and generate PDF reports.
