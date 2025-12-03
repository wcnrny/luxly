/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { BaseProcessor } from 'src/core/abstract/base.processor';
import { readFile } from 'node:fs/promises';
// PDFJS importu (Bun/Node ortamı için 'legacy' build kullanmak en güvenlisidir)
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { join } from 'node:path';

@Injectable()
export class PdfProcessor extends BaseProcessor {
  async *process(filePath: string) {
    try {
      const buffer = await readFile(filePath);
      const uint8Array = new Uint8Array(buffer);

      const loadingTask = getDocument({
        data: uint8Array,
        disableFontFace: true,
        standardFontDataUrl: join(
          process.cwd(),
          'node_modules/pdfjs-dist/standard_fonts/',
        ),
      });

      const pdfDocument = await loadingTask.promise;

      this.logger.log(`PDF Info: Pages: ${pdfDocument.numPages}`);

      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();

        let lastY,
          text = '';
        for (const item of textContent.items as any[]) {
          if (lastY == item.transform[5] || !lastY) {
            text += item.str;
          } else {
            text += '\n' + item.str;
          }
          lastY = item.transform[5];
        }

        const cleanText = this.sanitizeText(text);

        if (!cleanText) continue;

        yield {
          content: cleanText,
          metadata: {
            pageNumber: i,
          },
        };
      }
    } catch (error) {
      this.logger.error(`PDF Processing Failed: ${error.message}`, error.stack);
      throw new Error(`PDF_PARSE_ERROR: ${error.message}`);
    }
  }
}
