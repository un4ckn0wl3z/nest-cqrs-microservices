import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CustomLoggerService } from 'src/framework/logger/logger.service';
import { UsersService } from 'src/users/users.service';
import { GetUserByEmail } from '../impl';

@QueryHandler(GetUserByEmail)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmail> {
  constructor(private readonly logger: CustomLoggerService, private readonly usersService: UsersService) {}

  async execute(query: GetUserByEmail) {
    this.logger.info('[GetAllUsersHandler] entered', {query})
    return this.usersService.findByEmail(query.email);
  }
}