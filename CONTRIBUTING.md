# Contributing to Luxly

First off, thanks for taking the time to contribute! 🎉
Luxly is built with a modern stack (NestJS, Next.js, Docker, Bun), and we love to see the community get involved.

## 🛠️ Tech Stack Overview

Before contributing, please ensure you are familiar with:

- **Package Manager:** [Bun](https://bun.sh) (Required)
- **Monorepo:** Turborepo / Bun Workspaces
- **Backend:** NestJS + Prisma + BullMQ
- **Frontend:** Next.js 15 + Tailwind + shadcn/ui
- **Infra:** Docker Compose

## 🚀 Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork:**
    ```bash
    git clone https://github.com/your-username/luxly.git
    cd luxly
    ```
3.  **Install dependencies:**
    ```bash
    bun install
    ```
4.  **Start Infrastructure:**
    ```bash
    docker-compose up -d
    ```
5.  **Run Development Mode:**
    ```bash
    bun run dev
    ```

## 📏 Code Standards

We follow strict architectural patterns to maintain scalability.

### 1. Commit Messages

We follow the **Conventional Commits** specification.

- `feat(auth): add google login`
- `fix(worker): resolve pdf parsing error`
- `chore(deps): update prisma`

### 2. Monorepo Rules

- **No Circular Dependencies:** Packages can be imported by Apps, but Apps cannot be imported by Packages.
- **Config:** Always use `packages/config` for environment variables via Zod validation.

### 3. Branching Strategy

- Create a new branch for every feature/fix: `feat/my-feature` or `fix/issue-123`.
- Never push directly to `main`. Open a Pull Request (PR).

## 🐛 Found a Bug?

Please open an issue on GitHub describing the bug, how to reproduce it, and the expected behavior.

## 💡 Feature Requests

We welcome new ideas! Open an issue tagged as `enhancement` to discuss your idea before implementing it.

---

**Happy Coding!** 🚀
