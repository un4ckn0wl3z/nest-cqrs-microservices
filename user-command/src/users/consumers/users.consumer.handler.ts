import { Controller, UseGuards } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { PrismaService } from "prisma/prisma.service";
import { AuthenExtraGuard } from "src/framework/guard/auth-extra.guard";
import { CustomLoggerService } from "src/framework/logger/logger.service";
import { TargetEvents } from "../constants/enums/target-events.enum";
import { UserCreatedConsumeDto } from "../dtos/consumers/user-created.consume.dto";
import { UsersService } from "../users.service";

@Controller()
export class UsersConsumerHandler {
    constructor(private readonly logger: CustomLoggerService, private readonly usersService: UsersService) {}
 
        @EventPattern(TargetEvents.UserCreatedEvent)
        @UseGuards(AuthenExtraGuard({event: TargetEvents.UserCreatedEvent}))
        handleCreatedEvent(dto: UserCreatedConsumeDto){
          this.usersService.createUser(dto);
        }

}