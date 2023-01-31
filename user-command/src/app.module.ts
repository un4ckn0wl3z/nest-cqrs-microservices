import { JwtModule } from '@nestjs/jwt';
import { CacheModule, Global, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './framework/config/configuration';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { CustomLoggerService } from './framework/logger/logger.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './framework/interceptor/logger.interceptor';
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';
import { CustomSummaryLoggerService } from './framework/logger/summary-logger.service';
import { HttpExceptionFilter } from './framework/filter/http-exception.filter';
import { EntryPointMiddleware } from './framework/middleware/entrypoint.middleware';
import { RequestHelperService } from './framework/helper/request.service';
import { AuthService } from './framework/helper/auth.service';
import { UtilService } from './framework/util/util.service';

import {
  PrometheusModule,
  makeCounterProvider,
} from "@willsoto/nestjs-prometheus";
import { LocalCacheService } from './framework/helper/local-cache.service';

const logger = new Logger('AppModule')
import { FrameworkUtilService } from './framework/helper/framework-util.service';
import { UpdateResponseService } from './framework/helper/update-response.service';

import * as fs from "fs";
import { HttpModule } from '@nestjs/axios';
import { CustomAxiosService } from './framework/util/custom-axios.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from 'prisma/prisma.module';
const applicationVersionFile = './APPLICATION_VERSION.txt'

fs.readFile(applicationVersionFile, function (err, data) {
  if (!err) logger.log(`Application GIT-SCM detials: \n${data.toString().trim()}`)
});
const loggerTransport = [];
loggerTransport.push(new winston.transports.Console())

if(process.env.ZONE !== "prod") {
  logger.log(`None Production ENV Detected! Program will write log to file`)
  loggerTransport.push(new winstonDailyRotateFile({
    dirname: 'logs/detail',
    filename: 'detail-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    extension: '.log',
  }))
}else{
  logger.log(`Production ENV Detected! Disable logger file transport`)
}

@Global()
@Module({
  imports: [UsersModule,HttpModule.register({}), CacheModule.register({
    ttl: 0
  }), PrometheusModule.register({
    path: '/metrics',
    defaultMetrics: {
      enabled: false,
    },
  }),
  JwtModule.register({}),
  ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true,
    ignoreEnvFile: true
  }),
  WinstonModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      level: config.get<string>('log.level'),
      format: winston.format.combine(
        winston.format.json()
      ),
      transports: loggerTransport
    }),
  }),
  ],
  providers: [CustomAxiosService, CustomLoggerService, CustomSummaryLoggerService, RequestHelperService, AuthService, UtilService, LocalCacheService, FrameworkUtilService, UpdateResponseService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    makeCounterProvider({
      name: "App_Stat",
      help: "collection of the method, status, resultCode, commandName, containerId",
      labelNames: ["method", "status", "resultCode", "commandName", "containerId"],
    })
],
exports: [CustomAxiosService, CustomLoggerService, RequestHelperService, AuthService,  UtilService, UpdateResponseService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EntryPointMiddleware).forRoutes('*')
  }
}
