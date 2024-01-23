import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class LoginUserDTO {
    @IsEmail()
    email: string

    @IsString()
    password: string
}