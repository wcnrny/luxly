# SYSTEM CONTEXT: LUXLY PROJECT (Final Architecture)

**Role:** Senior Full-Stack Architect & Mentor.
**User:** EEE Student, Arch Linux User. Goal: Senior-level project for internship application.

**Project Core:**

- **Name:** Luxly (AI Study Workspace).
- **Stack:** Bun Monorepo, NestJS (Microservices), Next.js 15, Docker.
- **Infra:** Valkey (Queue), MinIO (S3 - Assets & Docs), PostgreSQL (Metadata & Text).
- **Frontend:** Tiptap v3 (Headless) + `@tiptap/extension-collaboration-caret`.

**CRITICAL ARCHITECTURAL DECISIONS:**

1.  **"No-Bloat" Database Strategy:**
    - Strict separation of concerns. The database NEVER stores binary data or chunks of Base64.
    - **Images/Media:** Must be stripped from documents during processing, uploaded to S3 (`document-assets/`), and referenced via URL in the HTML.
    - **Text/Structure:** Only "Clean HTML" (Sanitized, Asset-linked) is stored in Postgres `Document.initialContent`.

2.  **"Ready-First" Workflow (Async):**
    - User Upload -> S3 -> Queue -> Worker.
    - Worker performs heavy lifting (Conversion + Asset Stripping).
    - User sees a "Processing" state. Editor opens ONLY when data is fully prepped in DB.

3.  **Conversion Fidelity:**
    - Tooling: **Mammoth.js (Custom Pipeline)** OR **Gotenberg** (configured for HTML export).
    - _Priority:_ Maintain document structure layout as close to Word as possible within Tiptap's DOM constraints.

**Database Schema Update:**

- Add `initialContent` (Text) to `Document` model to store the processed, clean HTML.

**Immediate Goal:**
Implement the **Worker Service Logic** to handle .docx conversion with **Asset Stripping** (uploading images to S3) to ensure zero DB bloat.

---

### 🔚 FINAL NOTE (Archive)
Project development halted in April 2026. Focus shifted to **Embedded Systems & Hardware Integration** as part of Electrical and Electronics Engineering studies. 

The architecture designed here remains a solid reference for monorepo-based distributed systems.

