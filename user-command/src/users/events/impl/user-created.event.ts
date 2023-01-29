import { CreateUserRequestDto } from "src/users/dtos/requests/create-user-request.dto";

export class UserCreatedEvent {
    constructor(public readonly data: CreateUserRequestDto) {}
  }