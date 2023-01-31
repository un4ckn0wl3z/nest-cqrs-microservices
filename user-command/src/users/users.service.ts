import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CustomLoggerService } from "src/framework/logger/logger.service";
import { UserCreatedConsumeDto } from "./dtos/consumers/user-created.consume.dto";

@Injectable()
export class UsersService {
    constructor(private readonly logger: CustomLoggerService, private prisma: PrismaService){}
    
    async createUser(dto: UserCreatedConsumeDto){
        const foundUser = await this.prisma.user.findUnique({where:{
            email: dto.email
          }})
          if(foundUser){
            this.logger.error(`email already exists`, {email: dto.email})
            return;
          }
          try {
            await this.prisma.user.create({ data: {
                email: dto.email,
                firstname: dto.firstname,
                hashPassword: dto.password,
                lastname: dto.lastname,
                nickname: dto.nickname
              }})
          } catch (error) {
            this.logger.error(`something wrong`, error)

          }
          this.logger.info(`user created successful`, {email: dto.email})
    }
  
      updateUser(){
        // TODO
      }
  
      deleteUser(){
        // TODO
      }

}