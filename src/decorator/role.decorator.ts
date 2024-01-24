import { SetMetadata } from '@nestjs/common';
import { ERole } from 'src/enum/role.enum';

export const Roles = (...roles: ERole[]) => SetMetadata('roles', roles);