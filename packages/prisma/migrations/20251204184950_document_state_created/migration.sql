-- CreateTable
CREATE TABLE "DocumentState" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentState_documentId_key" ON "DocumentState"("documentId");

-- AddForeignKey
ALTER TABLE "DocumentState" ADD CONSTRAINT "DocumentState_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
