import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class OTPConfirmDTO {
    @IsString()
    @IsNotEmpty({ message: 'Please enter a valid value' })
    otp: string

    @IsEmail()
    @IsNotEmpty({ message: 'Please enter a valid value' })
    email: string
}