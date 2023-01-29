import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientKafka } from '@nestjs/microservices';
import { CustomLoggerService } from 'src/framework/logger/logger.service';
import { TargetEvents } from 'src/users/constants/enums/target-events.enum';
 import { UserCreatedEvent } from '../impl/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
    constructor(
        @Inject('USER_QUERY_SERVICE') private readonly querySideClient: ClientKafka,
        private readonly logger: CustomLoggerService, 
      ){
      }
  handle(event: UserCreatedEvent) {
    this.logger.info('[UserCreatedHandler] entered', {"committed": event.data})
    this.querySideClient.emit(TargetEvents.UserCreatedEvent,  event.data);
  }
}