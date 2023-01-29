import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersEventController } from './users.event-controller';
import { UsersRestController } from './users.rest-controller';

@Module({
    imports: [CqrsModule],
    controllers: [UsersEventController, UsersRestController],
    providers: [],
  })
export class UsersModule {}
