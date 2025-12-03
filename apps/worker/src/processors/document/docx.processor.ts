import { Injectable } from '@nestjs/common';
import { BaseProcessor } from 'src/core/abstract/base.processor';

@Injectable()
export class DocxProcessor extends BaseProcessor {
  // eslint-disable-next-line @typescript-eslint/require-await
  async *process(filePath: string) {
    yield {
      content: 'Giriş bölümü metni...',
      metadata: { pageNumber: 1 },
    };

    // Parça 2'yi fırlat
    yield {
      content: filePath,
      metadata: { pageNumber: 2 },
    };

    // Parça 3'ü fırlat
    yield {
      content: 'Sonuç bölümü metni...',
      metadata: { pageNumber: 3 },
    };
  }
}
