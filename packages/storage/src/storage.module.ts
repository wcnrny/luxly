import { Module, Global } from "@nestjs/common";
import { S3Client } from "@aws-sdk/client-s3";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { AppConfig } from "@luxly/config";

export const S3_CLIENT_TOKEN = "S3_CLIENT";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    ConfigService,
    {
      provide: S3_CLIENT_TOKEN,
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        return new S3Client({
          region: configService.getOrThrow("S3_REGION") || "us-east-1",
          endpoint:
            configService.getOrThrow("S3_ENDPOINT") || "http://localhost:9000",
          credentials: {
            accessKeyId: configService.getOrThrow("S3_ACCESS_KEY"),
            secretAccessKey: configService.getOrThrow("S3_SECRET_KEY"),
          },
          forcePathStyle: true,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [S3_CLIENT_TOKEN],
})
export class StorageModule {}
