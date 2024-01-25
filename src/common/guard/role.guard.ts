import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ERole } from "src/enum/role.enum";
import { Store } from "src/model/store.model";
import { AdminService } from "src/module/admin/admin.service";
import { StoreService } from "src/module/store/store.service";
import { UserService } from "src/module/user/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private readonly jwt: JwtService,
        // private readonly userService: UserService,
        // private readonly adminService: AdminService,
        // private readonly storeService: StoreService
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
        if (!roles) {
            return false;
        }
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1]
        if (!token) {
            throw new UnauthorizedException();
        }
        const payload = await this.jwt.verifyAsync(
            token,
            {
                secret: 'key'
            }
        );
        const userRoles = payload.role?.split(',');
        switch (userRoles[0]) {
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
    }

    validateRoles(roles: string[], userRoles: string[]) {
        return roles.some(role => userRoles?.includes(role));
    }
}