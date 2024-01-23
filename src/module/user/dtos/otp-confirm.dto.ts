import { IsPhoneNumber, IsString } from "class-validator";

export class OTPConfirmDTO {
    @IsString()
    otp: string
}