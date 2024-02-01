import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { USER_MESSAGES } from "src/constant/messages";

export class OTPConfirmDTO {
    @IsString()
    @IsNotEmpty({ message: USER_MESSAGES.EMPTY_OTP })
    otp: string

    @IsEmail()
    @IsNotEmpty({ message: USER_MESSAGES.EMPTY_EMAIL })
    email: string
}