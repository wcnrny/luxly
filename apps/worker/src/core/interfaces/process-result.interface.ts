export interface ChunkMetadata {
  pageNumber?: number;
  startTime?: number;
  endTime?: number;
}

export interface ProcessedChunk {
  content: string;
  metadata: ChunkMetadata;
}
