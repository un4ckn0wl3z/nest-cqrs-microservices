import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from 'src/framework/logger/logger.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { CustomSummaryLoggerService } from 'src/framework/logger/summary-logger.service';
import { RequestHelperService } from 'src/framework/helper/request.service';
import { Counter } from "prom-client";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import * as _ from "lodash";
import { FrameworkUtilService } from '../helper/framework-util.service';


@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    
    constructor(private readonly loggerService: CustomLoggerService, 
        private readonly configService: ConfigService,
        private readonly summaryLoggerService: CustomSummaryLoggerService,
        private readonly requestHelperService: RequestHelperService,
        private readonly frameworkUtilService: FrameworkUtilService,
        @InjectMetric("App_Stat") public counter: Counter<string>
        ){}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        if(context.getType() == 'rpc'){
            return next.handle().pipe(tap(data => {
            }))
        }
        return next.handle().pipe(tap(data => {
            const res = context.switchToHttp().getResponse()
            res.on('finish', () => {
                this.loggerService.info(`${this.configService.get<string>('app.name')} -> Client`, {headers: res.getHeaders() || {}, body: data || {}} )
                this.summaryLoggerService.init(this.loggerService.getLogDto())
                this.summaryLoggerService.update('type', 'summary')
                this.summaryLoggerService.update('responseHttpStatus', res.statusCode+'')
                this.summaryLoggerService.update('requestTimestamp', `${ this.frameworkUtilService.setTimestampFormat(new Date(this.requestHelperService.getNow())) }`)
                this.summaryLoggerService.update('responseTimestamp', `${ this.frameworkUtilService.setTimestampFormat(new Date()) }`)
                this.summaryLoggerService.update('transactionResult', '20000')
                this.summaryLoggerService.update('transactionDesc', `[${this.configService.get<string>('app.name').toUpperCase()}] - Success`)
                this.summaryLoggerService.update('processTime', `${Date.now() - this.requestHelperService.getNow()}ms`)
                this.summaryLoggerService.flush()
                if(!_.isNil(this.loggerService.getLogDto().command) && this.loggerService.getLogDto().command !== '#############'){
                    this.counter.labels(this.loggerService.getLogDto().httpMethod,
                    this.loggerService.getLogDto().responseHttpStatus,
                    this.loggerService.getLogDto().transactionResult,
                    this.loggerService.getLogDto().command,
                    this.loggerService.getLogDto().instance).inc()
                }
            });

        }))
    }
}
