import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class LoginAdminDTO {
    @IsEmail()
    email: string

    @IsString()
    password: string
}