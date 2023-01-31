import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from 'prisma/prisma.module';
import { CommandHandlers } from './commands/handlers';
import { UsersConsumerHandler } from './consumers/users.consumer.handler';
import { EventHandlers } from './events/handlers';
import { UsersEventController } from './users.event-controller';
import { UsersRestController } from './users.rest-controller';
import { UsersService } from './users.service';

@Module({
    imports: [PrismaModule,CqrsModule,
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
                // consumer: {
                //   groupId: config.get<string>('kafka.consumer.group-id'),
                // },
              },
            }),
          },
        ]
      ),
    ],
    controllers: [UsersEventController,UsersConsumerHandler, UsersRestController],
    providers: [
      UsersService,
      ...CommandHandlers,
      ...EventHandlers,
    ],
  })
export class UsersModule {}
