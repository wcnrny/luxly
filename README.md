# Luxly

![Luxly Banner](https://via.placeholder.com/1280x640.png?text=Luxly+Architecture+Overview)

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg)](https://www.docker.com/)
[![Status](https://img.shields.io/badge/Status-Archived-red.svg)]()

**AI-Powered Real-time Collaborative Study Workspace**

[Features](#-key-features) • [Architecture](#-architecture) • [Tech Stack](#-tech-stack) • [Roadmap](#-roadmap)

</div>

---

> [!IMPORTANT]
> **Project Status: Archived / Experimental Only**
>
> This project was a deep dive into distributed systems, real-time collaboration, and RAG architectures during my journey as an Electrical and Electronics Engineering student. While the backend infrastructure and core collaboration logic are functional, I have officially shifted my focus to **Embedded Systems**.
>
> Luxly will no longer receive updates or maintenance. You are free to fork this repository, explore the architecture, or repurpose the code for your own learning.
>
> 🚀 **What I'm working on now:**
> - [My Embedded Projects](https://wcnrny.tr/projects)
> - [ESP32 TWAI/CAN Bus Driver](https://github.com/wcnrny/esp32-twai-can-bus-test)
> - [INA219 Power Monitor Library](https://github.com/wcnrny/ina219_Library)


---

## 📖 About The Project

Luxly is an open-source, self-hostable platform designed to bridge the gap between static study materials and dynamic collaboration. It combines the real-time editing capabilities of modern tools like Google Docs with the power of **Retrieval-Augmented Generation (RAG)**.

Users can upload heavy PDF documents or video lectures, which are processed in the background to generate vector embeddings. These embeddings allow users to "chat" with their study materials while collaborating with peers in a shared, real-time editor environment.

Unlike simple wrapper applications, Luxly is built as a **distributed system** using a microservices-based monorepo architecture, prioritizing scalability, data sovereignty, and performance.

---

## 🏗 Architecture

Luxly operates on a modular architecture designed for high throughput and fault tolerance:

- **Ingestion Engine:** Uploaded files (PDF/Video) are stored in **MinIO (S3)**. A message is sent to a **Redis (Valkey)** queue, where a dedicated **Worker Service** picks up the job, extracts text, and generates vector embeddings using OpenAI, storing them in **PostgreSQL (pgvector)**.
- **Real-time Collaboration:** Utilizing **WebSockets** and **CRDTs (Y.js)** via a dedicated **Collab Service**, ensuring conflict-free editing even with multiple active users.
- **Secure Auth:** A custom JWT-based authentication system featuring **Refresh Token Rotation**, **HttpOnly Cookies**, and split identity management for robust security.

---

## 🚀 Tech Stack

This project uses a modern, high-performance tech stack managed within a **Bun Workspace** monorepo.

### Core & Infrastructure

- **Monorepo:** Bun Workspaces
- **Containerization:** Docker & Docker Compose
- **Reverse Proxy:** Traefik
- **Language:** TypeScript (Strict)

### Backend Services (NestJS)

- **API Service:** REST endpoints, Auth, File Uploads.
- **Worker Service:** Background job processing (PDF parsing, Embeddings).
- **Collab Service:** WebSocket server (Hocuspocus) for real-time sync.
- **Queue/Cache:** Valkey (High-performance Redis fork) & BullMQ.
- **Storage:** MinIO (S3 Compatible Object Storage).

### Data & AI

- **Database:** PostgreSQL 16 (with `pgvector` extension).
- **ORM:** Prisma (Multi-file schema structure).
- **AI/ML:** LangChain (Text Splitters), OpenAI API.

### Frontend (Next.js 15)

- **Framework:** Next.js (App Router).
- **Editor:** Tiptap (Headless) + Y.js.
- **Styling:** Tailwind CSS + shadcn/ui.
- **State:** React Query + Zustand.

---

## 🗺 Roadmap

We are currently in the active development phase.

- [x] **Phase 0:** Infrastructure Setup (Docker, Monorepo, Shared Packages)
- [x] **Phase 1:** Authentication & Identity System (JWT, Rotation)
- [x] **Phase 2:** Ingestion Engine (Upload -> Queue -> Worker)
- [x] **Phase 3:** Real-time Collaboration (WebSocket, CRDTs - Collab Service)
- [ ] **Phase 4:** Frontend Editor Implementation
- [ ] **Phase 5:** AI RAG Integration (Conceptual implementation in Worker)

> For a detailed breakdown of tasks and progress, please refer to the **[TODO.md](./TODO.md)** file.

---

## 🛠 Getting Started

### Prerequisites

- Docker & Docker Compose
- Bun Runtime (`curl -fsSL https://bun.sh/install | bash`)

### Installation

1.  **Clone the repository**

    ```bash
    git clone --depth=1 https://github.com/wcnrny/luxly.git
    cd luxly
    ```

2.  **Install dependencies**

    ```bash
    bun install
    ```

3.  **Setup Environment Variables**
    Copy the example env file and configure your secrets (DB, S3, OpenAI).

    ```bash
    cp .env.example .env
    ```

4.  **Start the Infrastructure (Docker)**

    ```bash
    docker-compose up -d
    ```

5.  **Run Development Mode**
    ```bash
    bun run dev
    ```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please read **[CONTRIBUTING.md](./CONTRIBUTING.md)** for details on our code of conduct and the process for submitting pull requests.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/wcnrny">wcnrny</a></sub>
</div>
