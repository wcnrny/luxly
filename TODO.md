# 🗺️ Luxly Roadmap & To-Do

> [!CAUTION]
> **ARCHIVED PROJECT**
> This roadmap is no longer being tracked. The project has been archived as the focus has shifted to Embedded Systems.
> For current projects, visit [wcnrny.tr/projects](https://wcnrny.tr/projects).

### Status Summary (at Archive)

- Core Infrastructure: **Completed**
- Auth & Identity: **Completed**
- Multi-tenancy Architecture: **Mostly Completed**
- Background Ingestion: **Completed**
- Real-time Backend: **Completed**
- Frontend Editor: **Incomplete**
- AI/RAG Logic: **Conceptual/Backend-only**

---


## 🚀 Phase 1: Core Infrastructure & Auth (Done)

_Building the foundation._

- [x] **Monorepo Setup:** Bun workspaces, shared packages structure.
- [x] **Docker Environment:** Postgres (pgvector), Valkey (Redis), MinIO (S3).
- [x] **Authentication:**
  - [x] JWT implementation with Refresh Token Rotation.
  - [x] NextAuth (Auth.js) v5 integration.

## 🏢 Phase 1.5: Architecture Upgrade (Multi-Tenancy) 🚧

_Moving from "Personal App" to "SaaS Platform"._

- [x] **Database Schema:**
  - [x] Add `Workspace` model (Many-to-Many with Users).
  - [x] Migrate `Document` model to belong to `Workspace`.
- [x] **API Refactoring:**
  - [x] Implement `WorkspaceGuard` for permission checks.
  - [x] Refactor `/dashboard` routes to `/workspaces`.
  - [x] Refactor upload endpoint to `POST /workspaces/:id/documents`.
- [ ] **Frontend Routing:**
  - [x] Create Workspace Switcher UI.
  - [ ] Implement Dynamic Routing (`/workspaces/[id]/...`).

## 🏭 Phase 2: Ingestion Engine & Processing

_Handling heavy files asynchronously._

- [x] **Worker Service:** Setup independent consumer app.
- [x] **PDF Processing:** Parse PDF -> Extract Text -> Store in DB.
- [x] **Job Queue:** Retry logic and error handling with BullMQ.
- [ ] **Refactor:** Ensure ingestion pipeline works with `workspaceId`.

## 🤝 Phase 3: Real-time Collaboration

_The "Google Docs" magic._

- [ ] **Collab Service:** Hocuspocus server setup.
- [ ] **Editor:** Tiptap integration on Frontend.
- [ ] **Sync:** Y.js persistence to Postgres.
- [ ] **PDF Annotation:** Allow users to highlight/comment on PDFs.

## 🧠 Phase 4: AI & Intelligence (Future)

_Adding intelligence._

- [ ] **Embeddings:** Generate vectors from document chunks (OpenAI).
- [ ] **Vector Search:** RAG endpoint implementation.
- [ ] **Video Intelligence:**
  - [ ] S3 Upload for Video/Audio.
  - [ ] Speech-to-Text (Whisper) integration.
  - [ ] Auto-summarization & Key takeaways extraction.
- [ ] **Chat UI:** Streaming AI responses to the editor.

---

### 💡 Ideas Backlog

- [ ] Export notes to PDF/Markdown.
- [ ] Guest access for specific documents (Public links).
- [ ] Usage limits & Billing integration (Stripe).
