import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";
import { STORE_MESSAGES } from "src/constant/messages";

export class UpdateStoreDTO {
    @IsOptional() @IsString()
    name: string

    @IsOptional() @IsPhoneNumber()
    phone: string

    @IsOptional() @IsString({ message: STORE_MESSAGES.INVALID_PASSWORD })
    @IsStrongPassword()
    password: string
}