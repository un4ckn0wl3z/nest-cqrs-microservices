
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MissingOrIncorrectParameterException } from './framework/exeption/application.exception';
import { LocalCacheService } from './framework/helper/local-cache.service';
import { CustomLoggerService } from './framework/logger/logger.service';
import * as yaml from 'yaml';
import * as fs from 'fs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { LogDto } from './framework/logger/dtos/log.dto';
import * as os from 'os';
let KAFKA_BROKERS = Array<string>();
let KAFKA_GROUP_ID = '';
export const GLOBAL_OS_NAME = os.hostname();
export let GLOBAL_KAFKA_LOGGER_INSTANCE: CustomLoggerService;
 


async function bootstrapEventListening() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule, 
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: KAFKA_BROKERS,
        },
        consumer: {
          groupId: KAFKA_GROUP_ID,
        }
      }
    }
  );
  
  const logger = app.get<CustomLoggerService>(CustomLoggerService);
  const configService = app.get<ConfigService>(ConfigService);
  let logDto: LogDto;
   logDto = {
      type: 'detail',
      appName: configService.get<string>('app.name') || '#############',
      instance: GLOBAL_OS_NAME,
      channel: 'KAFKA'
  }
  GLOBAL_KAFKA_LOGGER_INSTANCE = logger;
  GLOBAL_KAFKA_LOGGER_INSTANCE.init(logDto);
  await app.listen();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get<CustomLoggerService>(CustomLoggerService);
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      logger.error("ValidationError", "ValidationPipe error triggered", validationErrors)
      return new MissingOrIncorrectParameterException()
    },
  }))

  const configService = app.get<ConfigService>(ConfigService);
  KAFKA_BROKERS = configService.get<Array<string>>('kafka.client.brokers');
  KAFKA_GROUP_ID = configService.get<string>('kafka.consumer.group-id');
  const config = new DocumentBuilder()
  .setTitle(configService.get<string>('app.name'))
  .setDescription(configService.get<string>('app.description'))
  .setVersion(configService.get<string>('app.version'))
  .build();
  const document = SwaggerModule.createDocument(app, config);
  const yamlString: string = yaml.stringify(document, {});
  fs.writeFileSync( "api-spec.yaml", yamlString);
  SwaggerModule.setup(configService.get<string>('app.document-path'), app, document);
  const localCacheService = app.get<LocalCacheService>(LocalCacheService);
  await localCacheService.init()
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.enableCors();
  await app.listen(configService.get<number>('app.port'));

  bootstrapEventListening();
}

bootstrap();