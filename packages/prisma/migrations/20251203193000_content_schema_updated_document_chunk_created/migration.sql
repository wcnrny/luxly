-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "extractedTextKey" TEXT;

-- CreateTable
CREATE TABLE "document_chunks" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "page_number" INTEGER,
    "start_time" INTEGER,
    "end_time" INTEGER,
    "document_id" TEXT NOT NULL,

    CONSTRAINT "document_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "document_chunks_document_id_idx" ON "document_chunks"("document_id");

-- AddForeignKey
ALTER TABLE "document_chunks" ADD CONSTRAINT "document_chunks_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
