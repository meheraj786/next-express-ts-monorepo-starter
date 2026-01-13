# 🚀 Complete Monorepo Setup Guide

> **A Beginner-Friendly Guide to Building a Monorepo with pnpm, Turborepo, Next.js, and Express**

---

## 📋 Table of Contents

1. [What is a Monorepo?](#what-is-a-monorepo)
2. [Project Overview](#project-overview)
3. [Prerequisites](#prerequisites)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [Project Structure Explained](#project-structure-explained)
6. [Configuration Files Deep Dive](#configuration-files-deep-dive)
7. [Adding New Apps/Packages](#adding-new-appspackages)
8. [Common Commands](#common-commands)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 What is a Monorepo?

A **monorepo** (monolithic repository) is a single repository that contains multiple projects or packages. Instead of having separate repositories for your frontend, backend, and shared libraries, everything lives in one place.

### Benefits:
- ✅ **Code Sharing**: Easily share code between projects
- ✅ **Unified Versioning**: Manage dependencies across all projects
- ✅ **Atomic Changes**: Make changes across multiple projects in one commit
- ✅ **Simplified CI/CD**: Build and test everything together
- ✅ **Better Developer Experience**: One clone, one install, one command

### Popular Examples:
- Google, Facebook, Microsoft use monorepos
- Popular tools: Turborepo, Nx, Lerna

---

## 📦 Project Overview

This monorepo contains:

- **`apps/api`**: Express.js backend API with TypeScript and MongoDB
- **`apps/web`**: Next.js frontend application with React and Tailwind CSS
- **Root**: Shared configuration and workspace management

### Tech Stack:
- **Package Manager**: pnpm (faster than npm/yarn)
- **Build System**: Turborepo (smart caching and parallel execution)
- **Backend**: Express.js + TypeScript + MongoDB (Mongoose)
- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4

---

## 🔧 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v18 or higher)
   ```bash
   node --version
   ```

2. **pnpm** installed globally
   ```bash
   npm install -g pnpm
   # or
   corepack enable
   corepack prepare pnpm@10.22.0 --activate
   ```

3. **Git** installed
   ```bash
   git --version
   ```

4. **MongoDB** (for the API) - either:
   - Local MongoDB installation, or
   - MongoDB Atlas account (cloud)

---

## 🛠️ Step-by-Step Setup

### Step 1: Create the Root Directory

```bash
mkdir monorepo-starter
cd monorepo-starter
```

### Step 2: Initialize Git Repository

```bash
git init
```

### Step 3: Create Root `package.json`

Create `package.json` in the root:

```json
{
  "name": "monorepo",
  "version": "1.0.0",
  "description": "Monorepo starter with Next.js and Express",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build"
  },
  "packageManager": "pnpm@10.22.0",
  "workspaces": [
    "apps/*"
  ],
  "devDependencies": {
    "turbo": "^2.7.4"
  }
}
```

**Key Points:**
- `"private": true` - Prevents accidental publishing
- `workspaces` - Tells pnpm where to find packages
- `turbo` - Build orchestration tool

### Step 4: Create `pnpm-workspace.yaml`

Create `pnpm-workspace.yaml` in the root:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**What this does:**
- Tells pnpm which directories contain packages
- `apps/*` - All apps (frontend, backend)
- `packages/*` - Shared packages (optional, for future use)

### Step 5: Create `turbo.json`

Create `turbo.json` in the root:

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**Explanation:**
- `build` task:
  - `dependsOn: ["^build"]` - Build dependencies first
  - `outputs` - What files to cache
- `dev` task:
  - `cache: false` - Don't cache dev server
  - `persistent: true` - Long-running process

### Step 6: Create Shared TypeScript Config

Create `tsconfig.base.json` in the root:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

**What this does:**
- Base TypeScript configuration
- Shared by all apps (they extend this)

### Step 7: Create `.gitignore`

Create `.gitignore` in the root:

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
/dist
/build
/.next
/public/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Turbo
.turbo/
```

### Step 8: Create the API App

#### 8.1 Create Directory Structure

```bash
mkdir -p apps/api/src/{controllers,database,middlewares,models,routes/api,utils}
```

#### 8.2 Create `apps/api/package.json`

```json
{
  "name": "api",
  "version": "1.0.0",
  "description": "Express API backend",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@types/cookie-parser": "^1.4.10",
    "@types/cors": "^2.8.19",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "mongoose": "^9.1.3"
  },
  "devDependencies": {
    "@types/express": "^5.0.6",
    "@types/node": "^20.19.28",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.9.3"
  }
}
```

#### 8.3 Create `apps/api/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

**Key Points:**
- `extends` - Inherits from root `tsconfig.base.json`
- `outDir` - Where compiled JavaScript goes
- `rootDir` - Source code location

#### 8.4 Create `apps/api/src/index.ts`

```typescript
import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import { dbConnect } from "./database/db.config";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";

const app: Application = express();
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await dbConnect();
    app.use(cors());
    app.use(cookieParser());
    app.use(express.json());
    app.use(router);
    app.get("/", (req, res) => res.send("API Working"));

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Something went wrong:", error);
  }
})();
```

#### 8.5 Create `apps/api/src/database/db.config.ts`

```typescript
import mongoose from "mongoose";

export const dbConnect = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("MONGO_URI is not defined in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
```

#### 8.6 Create `apps/api/src/routes/index.ts`

```typescript
import { Router } from "express";
import apiRoutes from "./api";

const router: Router = Router();

router.use("/api/v1", apiRoutes);

export default router;
```

#### 8.7 Create `apps/api/src/routes/api/index.ts`

```typescript
import express, { Router, Request, Response } from "express";

const apiRoutes: Router = express.Router();

apiRoutes.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is working!" });
});

export default apiRoutes;
```

#### 8.8 Create `apps/api/.env` (Template)

Create `apps/api/.env.example`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/your-database-name
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
```

**Important:** Add `.env` to `.gitignore` (already done)!

### Step 9: Create the Web App

#### 9.1 Initialize Next.js App

```bash
cd apps
npx create-next-app@latest web --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd ..
```

Or manually create the structure:

#### 9.2 Create `apps/web/package.json`

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  },
  "dependencies": {
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

#### 9.3 Create `apps/web/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

#### 9.4 Create `apps/web/next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

#### 9.5 Create `apps/web/postcss.config.mjs`

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

#### 9.6 Create `apps/web/app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monorepo App",
  description: "Monorepo with Next.js and Express",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

#### 9.7 Create `apps/web/app/page.tsx`

```typescript
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Monorepo
        </h1>
        <p className="text-lg text-gray-600">
          Next.js Frontend + Express Backend
        </p>
      </main>
    </div>
  );
}
```

#### 9.8 Create `apps/web/app/globals.css`

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

### Step 10: Install Dependencies

From the root directory:

```bash
pnpm install
```

**What happens:**
- pnpm reads `pnpm-workspace.yaml`
- Installs dependencies for root and all apps
- Creates symlinks between packages
- Installs everything in one go!

### Step 11: Run the Development Servers

From the root directory:

```bash
pnpm dev
```

**What happens:**
- Turborepo runs `dev` script in all apps
- API runs on `http://localhost:5000`
- Web runs on `http://localhost:3000`

---

## 📁 Project Structure Explained

```
monorepo-starter/
├── .git/                    # Git repository
├── .turbo/                  # Turborepo cache (gitignored)
├── node_modules/            # Root dependencies (gitignored)
├── apps/                    # All applications
│   ├── api/                 # Express backend
│   │   ├── src/
│   │   │   ├── controllers/ # Request handlers
│   │   │   ├── database/    # DB connection config
│   │   │   ├── middlewares/ # Express middlewares
│   │   │   ├── models/      # Database models (Mongoose)
│   │   │   ├── routes/      # API routes
│   │   │   ├── utils/       # Helper functions
│   │   │   └── index.ts     # Entry point
│   │   ├── dist/            # Compiled JS (gitignored)
│   │   ├── .env             # Environment variables (gitignored)
│   │   ├── package.json     # API dependencies
│   │   └── tsconfig.json    # TypeScript config
│   └── web/                 # Next.js frontend
│       ├── app/             # Next.js App Router
│       │   ├── layout.tsx   # Root layout
│       │   ├── page.tsx     # Home page
│       │   └── globals.css  # Global styles
│       ├── public/          # Static assets
│       ├── .next/           # Next.js build (gitignored)
│       ├── package.json     # Web dependencies
│       ├── tsconfig.json    # TypeScript config
│       └── next.config.ts   # Next.js config
├── packages/                # Shared packages (optional, for future)
├── .gitignore              # Git ignore rules
├── package.json            # Root package.json
├── pnpm-lock.yaml          # Dependency lock file
├── pnpm-workspace.yaml     # Workspace configuration
├── turbo.json              # Turborepo configuration
└── tsconfig.base.json      # Shared TypeScript config
```

---

## ⚙️ Configuration Files Deep Dive

### 1. Root `package.json`

```json
{
  "name": "monorepo",
  "scripts": {
    "dev": "turbo run dev",    // Runs dev in all apps
    "build": "turbo run build" // Runs build in all apps
  },
  "workspaces": ["apps/*"],    // Tells pnpm where packages are
  "devDependencies": {
    "turbo": "^2.7.4"          // Build orchestration
  }
}
```

### 2. `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"      # All apps
  - "packages/*"  # Shared packages (optional)
```

**Why pnpm?**
- Faster than npm/yarn
- Saves disk space (hard links)
- Better monorepo support
- Strict dependency resolution

### 3. `turbo.json`

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],  // Build dependencies first
      "outputs": [".next/**", "dist/**"]  // Cache these
    },
    "dev": {
      "cache": false,      // Don't cache dev server
      "persistent": true   // Long-running process
    }
  }
}
```

**What Turborepo does:**
- Runs tasks in parallel
- Caches builds (super fast rebuilds!)
- Only rebuilds what changed
- Manages task dependencies

### 4. `tsconfig.base.json`

Shared TypeScript configuration that all apps extend:

```json
{
  "compilerOptions": {
    "strict": true,           // Strict type checking
    "esModuleInterop": true,   // Better import/export
    "skipLibCheck": true      // Faster compilation
  }
}
```

---

## ➕ Adding New Apps/Packages

### Adding a New App

1. **Create the app directory:**
   ```bash
   mkdir -p apps/new-app
   ```

2. **Create `package.json`:**
   ```json
   {
     "name": "new-app",
     "version": "1.0.0",
     "scripts": {
       "dev": "your-dev-command",
       "build": "your-build-command"
     }
   }
   ```

3. **Install dependencies:**
   ```bash
   pnpm install
   ```

4. **Add to `turbo.json` if needed:**
   Turborepo automatically detects apps with matching scripts!

### Adding a Shared Package

1. **Create package directory:**
   ```bash
   mkdir -p packages/shared-utils
   ```

2. **Create `packages/shared-utils/package.json`:**
   ```json
   {
     "name": "@monorepo/shared-utils",
     "version": "1.0.0",
     "main": "index.ts",
     "types": "index.ts"
   }
   ```

3. **Use in apps:**
   ```typescript
   import { something } from "@monorepo/shared-utils";
   ```

4. **Update `pnpm-workspace.yaml`** (already includes `packages/*`)

---

## 🎮 Common Commands

### From Root Directory

```bash
# Install all dependencies
pnpm install

# Run dev servers for all apps
pnpm dev

# Build all apps
pnpm build

# Run a specific app's script
pnpm --filter api dev
pnpm --filter web dev

# Add dependency to specific app
pnpm --filter api add express
pnpm --filter web add axios

# Add dev dependency to root
pnpm add -D -w typescript

# Run script in all apps
pnpm -r run lint
```

### From App Directory

```bash
cd apps/api

# Install dependency (from app directory)
pnpm add express

# Run app-specific script
pnpm dev
```

---

## ✨ Best Practices

### 1. **Dependency Management**

- ✅ Install app-specific deps in app's `package.json`
- ✅ Install shared dev tools in root `package.json`
- ✅ Use exact versions for critical packages
- ❌ Don't duplicate dependencies unnecessarily

### 2. **File Organization**

- ✅ Keep apps independent
- ✅ Use `packages/` for shared code
- ✅ Follow consistent naming conventions
- ❌ Don't create circular dependencies

### 3. **Environment Variables**

- ✅ Use `.env.example` files
- ✅ Document required env vars
- ✅ Never commit `.env` files
- ❌ Don't hardcode secrets

### 4. **Git Workflow**

- ✅ Commit from root (atomic changes)
- ✅ Use meaningful commit messages
- ✅ Keep commits focused
- ❌ Don't commit `node_modules` or build files

### 5. **TypeScript**

- ✅ Extend base config
- ✅ Use strict mode
- ✅ Share types via packages
- ❌ Don't duplicate type definitions

---

## 🔍 Troubleshooting

### Issue: "Cannot find module"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules apps/*/node_modules
pnpm install
```

### Issue: "Port already in use"

**Solution:**
- Change port in `.env` or `package.json`
- Kill the process using the port

### Issue: "Turborepo cache issues"

**Solution:**
```bash
# Clear Turborepo cache
pnpm turbo clean
```

### Issue: "TypeScript errors"

**Solution:**
- Ensure `tsconfig.json` extends base config
- Check `include` and `exclude` paths
- Restart TypeScript server in IDE

### Issue: "pnpm workspace not working"

**Solution:**
- Verify `pnpm-workspace.yaml` exists
- Check package names are unique
- Ensure `package.json` has correct `workspaces` field

---

## 📚 Additional Resources

- [pnpm Documentation](https://pnpm.io/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🎉 Next Steps

Now that you have a working monorepo:

1. **Add Authentication**: Implement JWT auth in API
2. **Create Shared Packages**: Extract common utilities
3. **Add Testing**: Set up Jest/Vitest
4. **CI/CD**: Configure GitHub Actions
5. **Deploy**: Deploy API and Web separately

---

## 📝 Summary

You've learned:
- ✅ What a monorepo is and why it's useful
- ✅ How to set up pnpm workspaces
- ✅ How to configure Turborepo
- ✅ How to structure a monorepo
- ✅ How to add new apps and packages
- ✅ Best practices and troubleshooting

**Happy coding! 🚀**

---

*This guide was created to help beginners understand and build monorepos. Feel free to customize and extend this setup for your needs!*
