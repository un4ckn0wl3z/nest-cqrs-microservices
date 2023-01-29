import { CACHE_MANAGER, Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cache } from 'cache-manager';

@Injectable()
export class LocalCacheService {
    private readonly appLog = new Logger(LocalCacheService.name)

    constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
    ){}

    async init(){
        // TODO
    }


}
