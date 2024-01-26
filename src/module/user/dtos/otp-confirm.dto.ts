import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class OTPConfirmDTO {
    @IsString()
    otp: string

    @IsEmail()
    email: string
}