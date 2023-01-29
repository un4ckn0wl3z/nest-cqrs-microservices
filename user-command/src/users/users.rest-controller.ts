import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { AuthenGuard } from "src/framework/guard/auth.guard";
import { CustomLoggerService } from "src/framework/logger/logger.service";
import { CreateUserCommand } from "./commands/impl/create-user.command";
import { CreateUserRequestDto } from "./dtos/requests/create-user-request.dto";

@Controller('api/users')
export class UsersRestController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly logger: CustomLoggerService, 
        ) {}
        
        @Post('create')
        @UseGuards(AuthenGuard({cmd: 'createUser'}))
        async createUser(@Body() body: CreateUserRequestDto) {
          this.logger.info('[UsersRestController] entered', {"body": body})
          return this.commandBus.execute(new CreateUserCommand(body));
        }

        @Post('update')
        @UseGuards(AuthenGuard({cmd: 'updateUser'}))
        async updateUser() {
          // TODO
          return "Updated!";
        }

        @Post('delete')
        @UseGuards(AuthenGuard({cmd: 'deleteUser'}))
        async deleteUser() {
          // TODO
          return "Deleted!";
        }

}