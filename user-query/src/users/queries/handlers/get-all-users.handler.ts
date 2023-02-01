import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CustomLoggerService } from 'src/framework/logger/logger.service';
import { UsersService } from 'src/users/users.service';
import { GetAllUsers } from '../impl';

@QueryHandler(GetAllUsers)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsers> {
  constructor(private readonly logger: CustomLoggerService, private readonly usersService: UsersService) {}

  async execute(query: GetAllUsers) {
    this.logger.info('[GetAllUsersHandler] entered', {query})
    return this.usersService.findAll();
  }
}