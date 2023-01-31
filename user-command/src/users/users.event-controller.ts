import { Controller, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { EventPattern } from "@nestjs/microservices";
import { AuthenExtraGuard } from "src/framework/guard/auth-extra.guard";
import { CustomLoggerService } from "src/framework/logger/logger.service";
import { CreateUserCommand } from "./commands/impl/create-user.command";
import { ListeningEvents } from "./constants/enums/listening-events.enum";
import { CreateUserRequestDto } from "./dtos/requests/create-user-request.dto";

@Controller()
export class UsersEventController  {
    constructor(private readonly commandBus: CommandBus, private readonly logger: CustomLoggerService) {}
 
        @EventPattern(ListeningEvents.CreateUserEvent)
        @UseGuards(AuthenExtraGuard({event: ListeningEvents.CreateUserEvent}))
        handleCreateUserEvent(body: CreateUserRequestDto){
          this.logger.info('[handleUserCreateEvent] entered', {"body": body})
          this.commandBus.execute(new CreateUserCommand(body));
        }
}