import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { CustomLoggerService } from '../logger/logger.service';
import { RequestHelperService } from './request.service';
import { Cache } from 'cache-manager';
import * as _ from "lodash";

@Injectable()
export class AuthService {
    constructor(private readonly jwt: JwtService, 
        private logger: CustomLoggerService, 
        private readonly configService: ConfigService,
        private readonly requestHelperService: RequestHelperService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache

        ){} 
}
