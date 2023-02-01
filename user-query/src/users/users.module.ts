import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'prisma/prisma.module';

import { UsersRestController } from './users.rest-controller';
import { UsersService } from './users.service';
import { QueryHandlers } from './queries/handlers';

@Module({
    imports: [PrismaModule,CqrsModule],
    controllers: [UsersRestController],
    providers: [UsersService, ...QueryHandlers],
  })
export class UsersModule {}
