import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { plainToClass } from "class-transformer";
import { AuthenGuard } from "src/framework/guard/auth.guard";
import { CustomLoggerService } from "src/framework/logger/logger.service";
import { GetAllUsers, GetUserByEmail } from "./queries/impl";

@Controller('api/users')
export class UsersRestController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly logger: CustomLoggerService, 
        ) {}
        
        @Get('all')
        @UseGuards(AuthenGuard({cmd: 'getAllUsers'}))
        async getAllUsers() {
          this.logger.info('[UsersRestController] - getAllUsers() entered',{})
          return this.queryBus.execute(new GetAllUsers());
        }

        @Get('email/:email')
        @UseGuards(AuthenGuard({cmd: 'getUserByEmail'}))
        async getUserByEmail(@Param('email') email: string) {
          this.logger.info('[UsersRestController] - getUserByEmail() entered',{})
          return this.queryBus.execute(new GetUserByEmail(email));
        }


}