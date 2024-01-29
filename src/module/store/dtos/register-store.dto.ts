import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";
import { STORE_MESSAGES } from "src/common/messages";

export class RegisterStoreDTO {
    @IsString()
    name: string

    @IsNotEmpty({ message: STORE_MESSAGES.EMPTY_PHONE })
    @IsPhoneNumber()
    phone: string

    @IsEmail()
    @IsNotEmpty({ message: STORE_MESSAGES.EMPTY_EMAIL })
    email: string

    @IsString()
    @IsNotEmpty({ message: STORE_MESSAGES.EMPTY_PASSWORD })
    @IsStrongPassword()
    password: string
}