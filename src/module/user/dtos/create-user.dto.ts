import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from "class-validator";
import { USER_MESSAGES } from "src/constant/messages";

export class CreateUserDTO {
    @IsString()
    name: string

    @IsNotEmpty({ message: USER_MESSAGES.EMPTY_PHONE })
    @IsPhoneNumber()
    phone: string

    @IsEmail()
    @IsNotEmpty({ message: USER_MESSAGES.EMPTY_EMAIL })
    email: string

    @IsString()
    @IsNotEmpty({ message: USER_MESSAGES.EMPTY_PASSWORD })
    password: string

    // @IsNumber()
    // @IsNotEmpty()
    // storeId: number
}