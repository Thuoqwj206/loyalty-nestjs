import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator"
import { USER_MESSAGES } from "src/constant/messages"

export class UpdateUserDTO {
    @IsString()
    @IsOptional()
    name: string

    @IsEmail()
    @IsOptional()
    email: string

    @IsString({ message: USER_MESSAGES.INVALID_PASSWORD })
    @IsStrongPassword()
    @IsOptional()
    password: string
}