import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { STORE_MESSAGES } from "src/constant/messages";

export class LoginStoreDTO {
    @IsEmail()
    @IsNotEmpty({ message: STORE_MESSAGES.EMPTY_EMAIL })
    email: string

    @IsString()
    @IsNotEmpty({ message: STORE_MESSAGES.EMPTY_PASSWORD })
    password: string
}