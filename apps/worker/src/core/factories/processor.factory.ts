import { Injectable, NotAcceptableException } from '@nestjs/common';

import { BaseProcessor } from '../abstract/base.processor';

import { PdfProcessor } from 'src/processors/pdf/pdf.processor';
import { MediaProcessor } from 'src/processors/media/media.processor';
import { DocxProcessor } from 'src/processors/document/docx.processor';

import { SUPPORTED_MIME_TYPES } from '@luxly/types';

@Injectable()
export class ProcessorFactory {
  constructor(
    private readonly pdfProcessor: PdfProcessor,
    private readonly mediaProcessor: MediaProcessor,
    private readonly docxProcessor: DocxProcessor,
  ) {}

  public getProcessor(mimeType: string): BaseProcessor {
    if (mimeType === 'application/pdf') {
      return this.pdfProcessor;
    }

    if (SUPPORTED_MIME_TYPES.MEDIA.includes(mimeType)) {
      return this.mediaProcessor;
    }

    if (SUPPORTED_MIME_TYPES.DOCUMENT.includes(mimeType)) {
      return this.docxProcessor;
    }

    throw new NotAcceptableException(
      `Unsupported file type received in worker: ${mimeType}`,
    );
  }
}
