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
