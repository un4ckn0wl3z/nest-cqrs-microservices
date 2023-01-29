import { RequestHelperService } from 'src/framework/helper/request.service';
import { LogDto } from './dtos/log.dto';
import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { FrameworkUtilService } from '../helper/framework-util.service';


@Injectable()
export class CustomLoggerService {

    private logDto = new LogDto()

    constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private readonly requestHelperService: RequestHelperService,
    private readonly frameworkUtilService: FrameworkUtilService
    ){}

    init(data: LogDto){
        this.logDto = data
    }

    getLogDto(){
        return this.logDto
    }

    update(key: string, value: string){
        this.logDto[`${key}`] = value
    }

    info(action: string, data: any){
        this.logDto.action = action
        this.logDto.detail = data
        this.logDto.timestamp = this.frameworkUtilService.setTimestampFormat(new Date())
        this.logger.log(this.logDto)
        
    }

    debug(action: string, data: any){
        this.logDto.action = action
        this.logDto.detail = data
        this.logDto.timestamp = this.frameworkUtilService.setTimestampFormat(new Date())
        this.logger.debug(this.logDto)
    }

    error(action: string, data: any, stack?: any){
        this.logDto.action = action
        this.logDto.detail = data
        this.logDto.timestamp = this.frameworkUtilService.setTimestampFormat(new Date())
        this.logger.error(this.logDto, stack)
    }

    flushClientRequest(command: string){
        this.update('command', command)
        this.info(this.requestHelperService.getClientRequestAction(), {headers: this.requestHelperService.getHeaders(), body: this.requestHelperService.getBody()})
    }

    flushKafkaRequest(command: string, data: any){
        this.update('command', command)
        this.info(`start consuming event: ${command}`, data)
    }

}
