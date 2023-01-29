import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { CustomLoggerService } from "src/framework/logger/logger.service";
import { User } from "src/users/models/user.model";
import { CreateUserCommand } from "../impl/create-user.command";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {

    constructor(
        private readonly publisher: EventPublisher,
        private readonly logger: CustomLoggerService, 
      ) {}

    async execute(command: CreateUserCommand) {
        this.logger.info('[CreateUserHandler] entered', {"command": command.user})
        const user = this.publisher.mergeObjectContext(new User());
        user.createUser(command.user)
        user.commit()
        return "Command exec!";
    }

}