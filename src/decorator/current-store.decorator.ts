import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const currentStore = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        return request.currentStore
    }
)