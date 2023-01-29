import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as generate from "nanoid/generate"
import * as _ from "lodash";
import { keys } from 'ts-transformer-keys';


@Injectable()
export class UtilService {
    private alphanum: string;
    private len: number;
    constructor(private readonly configService: ConfigService){
        this.alphanum = this.configService.get<string>('nanoid.alphanum')
        this.len = this.configService.get<number>('nanoid.len')
    }

    randomNanoId(): string {
        return generate(this.alphanum, this.len);
    }

    sortQueryBuilder(sortFeild: any): any {
        const sort = {}
        if(!_.isArray(sortFeild)){
            sortFeild += ' '
        }
        sortFeild.split(' ').forEach(e => {
            const cending = _.includes(e, '-') ? 'desc' : 'asc';
            if(!_.isEmpty(e)){
                sort[`${e.replace('-','')}`] = cending;
            }
        })
        return sort
    }

    responseServiceApi(response){
        const {status, headers, data} = response
        return {status, headers, data}
    }

    Extract<T extends object>(arg: any): any {
        const keysOfProps = keys<T>();
        let obj = {}
        keysOfProps.forEach(i => {
            obj[`${<string>i}`] = obj[`${<string>i}`]
        })
        return obj;
    }



}
