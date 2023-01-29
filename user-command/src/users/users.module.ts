import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { UsersEventController } from './users.event-controller';
import { UsersRestController } from './users.rest-controller';

@Module({
    imports: [CqrsModule,
      ClientsModule.registerAsync(
        [
          {
            name: 'USER_QUERY_SERVICE',
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: config.get<string>('kafka.client.client-id'),
                  brokers: config.get<Array<string>>('kafka.client.brokers'),
                },
                consumer: {
                  groupId: config.get<string>('kafka.consumer.group-id'),
                },
              },
            }),
          },
        ]
      ),
    ],
    controllers: [UsersEventController, UsersRestController],
    providers: [
      ...CommandHandlers,
      ...EventHandlers,
    ],
  })
export class UsersModule {}
