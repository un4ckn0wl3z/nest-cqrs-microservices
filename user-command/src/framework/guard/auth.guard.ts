import { CustomLoggerService } from 'src/framework/logger/logger.service';
import { AuthService } from './../helper/auth.service';
import { CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common";
import { AuthenGuardDto } from './dtos/authen-guard.dto';
import { RequestHelperService } from '../helper/request.service';

export const AuthenGuard = (param: AuthenGuardDto): Type<CanActivate> => {
    class RoleGuardMixin implements CanActivate {
        constructor(){}

      async canActivate(context: ExecutionContext) {
        
        const request = context.switchToHttp().getRequest();
        const logger:CustomLoggerService = request.logger
        logger.flushClientRequest(param.cmd)
        const authService: AuthService = request.authService
        const requestHelperService:RequestHelperService = request.requestHelperService
        requestHelperService.setCommand(param.cmd)
        return true
      }
    }
  
    const guard = mixin(RoleGuardMixin);
    return guard;
  }
