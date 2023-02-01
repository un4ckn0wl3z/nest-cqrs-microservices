import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CustomLoggerService } from "src/framework/logger/logger.service";

@Injectable()
export class UsersService {
    constructor(private readonly logger: CustomLoggerService, private prisma: PrismaService){}
    
    async findAll(){
      try {
        this.logger.info(`Find all users in DB`, {condition: {}})
        return await this.prisma.user.findMany()
      } catch (error) {
        this.logger.error(`Something wrong`, error)
      }
    }

    async findByEmail(email: string){
      try {
        this.logger.info(`Find user in DB by email`, {condition: {email}})
        return await this.prisma.user.findUnique({
          where: {
            email
          }
        })
      } catch (error) {
        this.logger.error(`Something wrong`, error)
      }
    }
 
 

}