export const QUEUE_NAME = "processing-queue";

export enum JobName {
  PROCESS_FILE = "process-file",
  SEND_EMAIL = "send-email",
  GENERATE_THUMBNAIL = "generate-thumbnail",
}

export interface ProcessFilePayload {
  documentId: string;
  fileKey: string;
  mimeType: string;
  userId: string;
}

export const SUPPORTED_MIME_TYPES = {
  MEDIA: [
    "video/mp4",
    "video/webm",
    "video/x-matroska",
    "video/quicktime",
    "audio/mpeg",
    "audio/wav",
    "audio/x-m4a",
    "audio/mp4",
    "audio/webm",
  ],
  DOCUMENT: [
    // PDF isn't included in here because we have another processor for that.
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ],
  TEXT: ["text/plain", "text/markdown", "text/csv"],
};
