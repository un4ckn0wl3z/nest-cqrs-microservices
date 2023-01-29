import { Controller, UseGuards } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { AuthenExtraGuard } from "src/framework/guard/auth-extra.guard";
import { CustomLoggerService } from "src/framework/logger/logger.service";
import { IncomingEvents } from "./constants/enums/incoming-events.enum";
import { CreateUserEventDto } from "./dtos/consumers/user-created-event.dto";

@Controller()
export class UsersEventController  {
    constructor(private readonly logger: CustomLoggerService) {}
 
        @EventPattern(IncomingEvents.UserCreatedEvent)
        @UseGuards(AuthenExtraGuard({event: IncomingEvents.UserCreatedEvent}))
        handleUserCreatedEvent(data: CreateUserEventDto){
          this.logger.info(`${this.handleUserCreatedEvent.name} entered`, {data})
        }
}
