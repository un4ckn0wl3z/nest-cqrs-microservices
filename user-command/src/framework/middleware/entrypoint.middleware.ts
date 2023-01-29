import { ConfigService } from '@nestjs/config';
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RequestHelperService } from "src/framework/helper/request.service";
import { CustomLoggerService } from "../logger/logger.service";
import { LogDto } from '../logger/dtos/log.dto';

import { AuthService } from '../helper/auth.service';
import { UpdateResponseService } from '../helper/update-response.service';
import { GLOBAL_OS_NAME } from 'src/main';

@Injectable()
export class EntryPointMiddleware implements NestMiddleware {
    constructor(
        private readonly configService:ConfigService,
         private readonly loggerService: CustomLoggerService, 
         private readonly requestHelperService: RequestHelperService,
         private readonly authService: AuthService,
         private readonly updateResponseService: UpdateResponseService
         ){}
    use(req: Request, res: Response, next: NextFunction) {
        this.updateResponseService.init(res)
        req['logger'] = this.loggerService;
        req['authService'] = this.authService;
        const xtid = req.get('x-transaction-id') || '#############';
        res.append('X-Transaction-Id', xtid);
        let logDto: LogDto;
        const uri: string = req.originalUrl
        logDto = {
            type: 'detail',
            tid: xtid,
            appName: this.configService.get<string>('app.name') || '#############',
            instance: GLOBAL_OS_NAME,
            httpMethod: req.method,
            uri,
            channel: 'REST'
        }


        this.loggerService.init(logDto)
        this.requestHelperService.setHeaders(req.headers || {})
        this.requestHelperService.setBody(req.body || {})
        this.requestHelperService.setNow(Date.now())
        this.requestHelperService.setTid(xtid);
        this.requestHelperService.setClientRequestAction(`Client -> ${this.configService.get<string>('app.name')}`)
        req['requestHelperService'] = this.requestHelperService;

        next()
    }
}
