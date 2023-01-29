import { Injectable } from "@nestjs/common";
import * as moment from 'moment';

@Injectable()
export class FrameworkUtilService {
    constructor(){}

    setTimestampFormat(date: Date): string {
        return moment(date).utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss.SSS')
    }
}
