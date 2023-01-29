import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { AuthenGuard } from "src/framework/guard/auth.guard";
import { CustomLoggerService } from "src/framework/logger/logger.service";

@Controller('api/users')
export class UsersRestController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly logger: CustomLoggerService, 
        ) {}
        
        @Get('all')
        @UseGuards(AuthenGuard({cmd: 'getAllUsers'}))
        async getAllUsers() {
          this.logger.info('[UsersRestController] entered',{})
          return "OK";
        }


}