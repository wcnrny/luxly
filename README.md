# Luxly — Intelligent Study Assistant Platform

Luxly, öğrencilerin video, PDF, metin veya web bağlantıları üzerinden ders içeriklerini yükleyip analiz edebildiği; özet, quiz, flashcard ve konu haritası oluşturabilen bir yapay zeka destekli çalışma asistanıdır.

Bu repo, modern bir **full-stack monorepo** mimarisi kullanır.

---

## 🚀 Tech Stack

- **Frontend:** Next.js 15 (App Router, Server Actions)
- **Backend:** NestJS (modular microservice-like architecture)
- **AI:** OpenAI API (text + embeddings)
- **Database:** PostgreSQL + pg_vector
- **Cache / Queue:** Valkey
- **ORM:** Prisma
- **Storage:** S3-compatible (Supabase / R2 / Minio)
- **Build:** Bun
- **Package Manager:** Bun Workspaces
- **Reverse Proxy:** Traefik
- **Deployment:** Docker + Dokploy
- **Workers:** Valkey-based job queue

---

## 🏗️ Monorepo Structure

```
luxly/
│
├── apps/
│ ├── web/ # Next.js frontend
│ ├── api/ # NestJS backend
│ └── worker/ # Background queue worker
│
├── packages/
│ ├── ui/ # Shared UI components
│ ├── utils/ # Shared utilities
│ ├── types/ # Shared TypeScript types
│ ├── config/ # ESLint, tsconfig, tailwind config
│ └── prisma/ # Prisma schema + client
│
├── docker/
│ ├── traefik/
│ ├── api.Dockerfile
│ ├── web.Dockerfile
│ └── worker.Dockerfile
│
└── docker-compose.yml
```

---

## 📚 Features

### **1. AI Content Understanding**

- PDF/video/text extraction
- Text chunking & embeddings
- Semantic search
- Topic detection
- Study summaries (short / mid / long)
- Glossary extraction

### **2. Smart Study Tools**

- Automatic quiz generator
- Flashcard generator (CSV/Anki)
- Mindmap generator
- Difficulty scoring

### **3. Dashboard**

- Course folders
- Material archive
- Versioned notes
- Processing history

### **4. Collaboration (Later Phase)**

- Shareable note packs
- Public/private pages
- Team mode (optional)

### **5. Background Processing**

- Media → text extraction
- Embeddings creation
- AI generation tasks

---

## 🧩 Development Roadmap

### **Phase 1 — Base Infrastructure**

- [x] Bun workspace setup
- [x] Next.js + NestJS app initialization
- [x] Worker service setup
- [x]? Shared packages (ui, utils, prisma, types, config)
- [ ] Traefik reverse proxy config
- [ ] Dokploy deployment base
- [x] PostgreSQL + Valkey setup
- [x] Prisma schema + migrations
- [ ] Global logging & error handling

---

### **Phase 2 — User & Storage**

- [x] Authentication system
- [x] User profile model
- [ ] S3 file upload
- [ ] DB models:
  - User
  - Course
  - Material
  - ProcessedContent
  - NotePack
  - Quiz
  - Flashcard

---

### **Phase 3 — AI Processing Engine**

- [ ] Text extraction modules
- [ ] Audio transcription (video processing)
- [ ] Embeddings pipeline
- [ ] Semantic search engine
- [ ] Summary generator
- [ ] Quiz generator
- [ ] Flashcard generator
- [ ] Topic clustering

---

### **Phase 4 — Frontend UI**

- [ ] Dashboard layout
- [ ] File upload interface
- [ ] Course detail pages
- [ ] Notes display UI
- [ ] Quiz UI
- [ ] Flashcards UI
- [ ] Mindmap renderer
- [ ] Processing status indicator

---

### **Phase 5 — Collaboration**

- [ ] Shareable note packs
- [ ] Public notes
- [ ] Comments
- [ ] Team mode

---

### **Phase 6 — Optimization**

- [ ] Valkey caching improvements
- [ ] pg_vector tuning
- [ ] CDN integration
- [ ] OpenTelemetry logging

---

## 🧠 AI Flow Diagram

```
User Upload
│
▼
API (NestJS)
│
Extract → Chunk → Embed → Store in DB
│
▼
Worker (Background)
│
Generate:

-Summaries

-Quizzes

-Flashcards

Topics
│
▼
Database
│
▼
Frontend displays results
```

---

## ⚙️ Environment Variables

### `apps/web/.env`

```
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_API_URL=
```

### `apps/api/.env`

```
DATABASE_URL=
VALKEY_URL=
OPENAI_API_KEY=
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
JWT_SECRET=
```

### `apps/worker/.env`

```
VALKEY_URL=
OPENAI_API_KEY=
DATABASE_URL=
```

---

## 🐳 Docker Compose Example

```
docker-compose up -d --build
```

Servisler:

- traefik
- web
- api
- worker
- postgres
- valkey

---

## 📄 License

MIT License
