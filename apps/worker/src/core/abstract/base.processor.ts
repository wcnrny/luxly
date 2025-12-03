import { Logger } from '@nestjs/common';
import { ProcessedChunk } from '../interfaces/process-result.interface';

export abstract class BaseProcessor {
  protected readonly logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  abstract process(filePath: string): AsyncGenerator<ProcessedChunk>;

  // Ortak method: Metin temizleme
  protected sanitizeText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }
}
