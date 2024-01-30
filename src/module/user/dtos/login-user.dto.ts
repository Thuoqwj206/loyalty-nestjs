import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { USER_MESSAGES } from "src/constant/messages";

export class LoginUserDTO {
    @IsEmail()
    @IsNotEmpty({ message: USER_MESSAGES.EMPTY_EMAIL })
    email: string

    @IsString()
    @IsNotEmpty({ message: USER_MESSAGES.EMPTY_PASSWORD })
    password: string
}