import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'prisma/prisma.module';

import { UsersRestController } from './users.rest-controller';

@Module({
    imports: [PrismaModule,CqrsModule],
    controllers: [UsersRestController],
    providers: [],
  })
export class UsersModule {}
