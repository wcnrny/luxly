import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@luxly/config'; // Paketimizden gelen tip

@Injectable()
export class AppConfigService extends ConfigService<AppConfig, true> {}
