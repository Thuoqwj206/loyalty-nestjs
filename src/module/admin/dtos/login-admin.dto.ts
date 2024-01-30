import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { USER_MESSAGES } from "src/constant/messages";

export class LoginAdminDTO {

    @IsEmail()
    @IsNotEmpty({ message: USER_MESSAGES.EMPTY_EMAIL })
    email: string

    @IsString({ message: USER_MESSAGES.EMPTY_PASSWORD })
    password: string
} 