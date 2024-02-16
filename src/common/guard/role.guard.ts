import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import 'dotenv/config';
import { SECRET_KEY } from "src/config";
import { ERole } from "src/enum/role.enum";
import { RedisService } from "../../services/redis/redis.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private readonly jwt: JwtService,
        private readonly redisService: RedisService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
        if (!roles) {
            throw new UnauthorizedException();
        }
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1]
        if (!token || await this.redisService.get(token)) {
            throw new UnauthorizedException();
        }
        try {

            const payload = await this.jwt.verifyAsync(token, { secret: SECRET_KEY });
            const userRoles = payload.role
            switch (userRoles) {
                case ERole.STORE:
                    request.currentStore = payload
                    break;
                case ERole.USER:
                    request.currentUser = payload
                    break;
                case ERole.ADMIN:
                    break;
            }
            return this.validateRoles(roles, userRoles);
        } catch (e) {
            if (e.message === 'jwt expired') throw new UnauthorizedException();
        }
    }

    validateRoles(roles: string[], userRoles: string[]) {
        if (!roles.some(role => userRoles?.includes(role))) {
            throw new UnauthorizedException();
        }
        return true
    }
}