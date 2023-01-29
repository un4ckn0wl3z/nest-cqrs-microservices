import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { RequestHelperService } from "src/framework/helper/request.service";
import { CustomLoggerService } from "src/framework/logger/logger.service";
import { CustomSummaryLoggerService } from "src/framework/logger/summary-logger.service";
import { Counter } from "prom-client";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import * as _ from "lodash";
import { FrameworkUtilService } from "../helper/framework-util.service";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

    constructor(private readonly loggerService: CustomLoggerService, 
        private readonly configService: ConfigService,
        private readonly summaryLoggerService: CustomSummaryLoggerService,
        private readonly requestHelperService: RequestHelperService,
        private readonly frameworkUtilService: FrameworkUtilService,
        @InjectMetric("App_Stat") public counter: Counter<string>
        ){}

    catch(exception: any, host: ArgumentsHost) {
        if(host.getType() == 'rpc'){
            return
        }
        const ctx = host.switchToHttp();
        const resposne = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let systemErrorStack: any;

        let resultCode:any;
        let developerMessage:any;
        let status:any
        if(exception instanceof HttpException){
            if(exception instanceof NotFoundException){
                this.loggerService.flushClientRequest('#############')
                resultCode = "40401"
                developerMessage = "Url not found"
                status = 404
            }
            else if(exception instanceof BadRequestException){
                this.requestHelperService.setNow(Date.now())
                this.loggerService.flushClientRequest('#############')
                resultCode = "40001"
                developerMessage = "Request incorrect format"
                status = 400
            }
            else{
                resultCode = exception.getResponse()['resultCode']
                developerMessage = exception.getResponse()['developerMessage']
                status = exception.getStatus()
            }
        }else{
            status = 500
            developerMessage = "System Error"
            resultCode = "50005"
            systemErrorStack = exception.stack
        }

        const responseBody = {
            resultCode: resultCode,
            developerMessage: `[${this.configService.get<string>('app.name').toUpperCase()}] - ${developerMessage}`
        }
        this.loggerService.info(`${this.configService.get<string>('app.name')} -> Client`, {headers: resposne.getHeaders() || {}, body: responseBody || {}} )

        this.summaryLoggerService.init(this.loggerService.getLogDto())
        this.summaryLoggerService.update('type', 'summary')
        this.summaryLoggerService.update('responseHttpStatus', status+'')
        this.summaryLoggerService.update('requestTimestamp', `${ this.frameworkUtilService.setTimestampFormat(new Date(this.requestHelperService.getNow())) }`)
        this.summaryLoggerService.update('responseTimestamp', `${ this.frameworkUtilService.setTimestampFormat(new Date()) }`)
        this.summaryLoggerService.update('transactionResult', responseBody.resultCode)
        this.summaryLoggerService.update('transactionDesc', responseBody.developerMessage)
        this.summaryLoggerService.update('processTime', `${Date.now() - this.requestHelperService.getNow()}ms`)
        this.summaryLoggerService.flushError(systemErrorStack)
        if(!_.isNil(this.loggerService.getLogDto().command) && this.loggerService.getLogDto().command !== '#############'){
            this.counter.labels(this.loggerService.getLogDto().httpMethod,
            this.loggerService.getLogDto().responseHttpStatus,
            this.loggerService.getLogDto().transactionResult,
            this.loggerService.getLogDto().command,
            this.loggerService.getLogDto().instance).inc()
        }

        resposne.status(status).json(responseBody)

        
    }
}
