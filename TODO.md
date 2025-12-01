# 🗺️ Luxly Roadmap & To-Do

Welcome to the development roadmap for Luxly! This document tracks our progress and future plans.
We follow a **"Phase-based"** development approach.

### Legend

- [x] ✅ Completed
- [ ] 🚧 Work in Progress
- [ ] 📅 Planned

---

## 🚀 Phase 1: Core Infrastructure & Auth (Current)

_Building the foundation._

- [x] **Monorepo Setup:** Bun workspaces, shared packages structure.
- [x] **Docker Environment:** Postgres (pgvector), Valkey (Redis), MinIO (S3).
- [x] **Authentication:**
  - [x] JWT implementation with Refresh Token Rotation.
  - [x] NextAuth (Auth.js) v5 integration.
  - [ ] **Auth UI:** Login/Register pages with shadcn/ui forms.

## 🏭 Phase 2: Ingestion Engine

_Handling heavy files asynchronously._

- [x] **API Upload:** Multer & S3 integration.
- [x] **Worker Service:** Setup independent consumer app.
- [ ] **PDF Processing:** Parse PDF -> Extract Text -> Store in DB.
- [ ] **Job Queue:** Retry logic and error handling with BullMQ.

## 🤝 Phase 3: Real-time Collaboration

_The "Google Docs" magic._

- [ ] **Collab Service:** Hocuspocus server setup.
- [ ] **Editor:** Tiptap integration on Frontend.
- [ ] **Sync:** Y.js persistence to Postgres.

## 🧠 Phase 4: AI Integration (Future)

_Adding intelligence._

- [ ] **Embeddings:** Generate vectors from document chunks (OpenAI).
- [ ] **Vector Search:** RAG endpoint implementation.
- [ ] **Chat UI:** Streaming AI responses to the editor.

---

### 💡 Ideas Backlog

- [ ] Add support for YouTube video summarization.
- [ ] Team management and shared workspaces.
- [ ] Export notes to PDF/Markdown.
