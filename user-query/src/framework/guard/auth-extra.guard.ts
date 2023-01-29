import { CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common";
import { AuthenExtraGuardDto } from './dtos/authen-extra.dto';
import { GLOBAL_KAFKA_LOGGER_INSTANCE } from "src/main";

export const AuthenExtraGuard = (param: AuthenExtraGuardDto): Type<CanActivate> => {
    class RoleGuardMixin implements CanActivate {
        constructor(
         ){}

      async canActivate(context: ExecutionContext) {
        
        if(context.getType() == 'rpc'){
          const data = context.switchToRpc().getData();
          GLOBAL_KAFKA_LOGGER_INSTANCE.flushKafkaRequest(param.event, {data})
        }

        return true
      }
    }
  
    const guard = mixin(RoleGuardMixin);
    return guard;
  }
  
