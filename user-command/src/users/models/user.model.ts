import { AggregateRoot } from "@nestjs/cqrs";
import { CreateUserRequestDto } from "../dtos/requests/create-user-request.dto";
import { UserCreatedEvent } from "../events/impl/user-created.event";

export class User extends AggregateRoot {
    constructor() {
      super();
    }

    createUser(data: CreateUserRequestDto){
      this.apply(new UserCreatedEvent(data));
    }

    updateUser(){
      // TODO
    }

    deleteUser(){
      // TODO
    }
  }