import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { USER_MESSAGES } from "src/constant/messages";

export class LoginUserDTO {
    @IsNotEmpty({ message: USER_MESSAGES.EMPTY_PHONE })
    phone: string

    @IsString()
    @IsNotEmpty({ message: USER_MESSAGES.EMPTY_PASSWORD })
    password: string
}