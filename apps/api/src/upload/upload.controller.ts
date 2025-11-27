import {
  Controller,
  PayloadTooLargeException,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

@Controller('upload')
@UseGuards(AuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('/')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        // Multer's file size limit (in bytes). fieldSize is for text field values, not file binary.
        fileSize: MAX_SIZE,
      },
      fileFilter: (req, file, cb) => {
        // Accept only application/pdf or video/mp4 mimetypes.
        if (!['application/pdf', 'video/mp4'].includes(file.mimetype)) {
          return cb(
            new Error('Only .pdf and .mp4 file formats are allowed.'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async HandleUpload(@UploadedFile() file: Express.Multer.File) {
    // Redundant runtime check (Multer already enforces), but kept for explicit API error response.
    if (file.size > MAX_SIZE) {
      throw new PayloadTooLargeException('File size is bigger than 50 MB.');
    }
    await this.uploadService.uploadFile(file, '123');
  }
}
