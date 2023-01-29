import { Controller, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { EventPattern } from "@nestjs/microservices";
import { AuthenExtraGuard } from "src/framework/guard/auth-extra.guard";
import { CustomLoggerService } from "src/framework/logger/logger.service";
import { ListeningEvents } from "./constants/enums/listening-events.enum";

@Controller()
export class UsersEventController  {
    constructor(private readonly commandBus: CommandBus, private readonly logger: CustomLoggerService) {}
 
        @EventPattern(ListeningEvents.TestTopic)
        @UseGuards(AuthenExtraGuard({event: ListeningEvents.TestTopic}))
        handleTestTopic(data: any){
          this.logger.info(`${this.handleTestTopic.name} entered`, {data})
        }
}