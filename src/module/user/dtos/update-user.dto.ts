import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator"
import { USER_MESSAGES } from "src/constant/messages"

export class UpdateUserDTO {
    @IsOptional() @IsString()
    name: string

    @IsOptional() @IsEmail()
    email: string

    @IsOptional() @IsString({ message: USER_MESSAGES.INVALID_PASSWORD })
    @IsStrongPassword()
    password: string
}