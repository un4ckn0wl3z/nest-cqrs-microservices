import { CreateUserRequestDto } from "src/users/dtos/requests/create-user-request.dto";

export class CreateUserCommand {
    constructor(public readonly user: CreateUserRequestDto) {}
  }