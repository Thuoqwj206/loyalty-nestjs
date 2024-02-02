import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";
import { STORE_MESSAGES } from "src/constant/messages";

export class UpdateStoreDTO {
    @IsString()
    @IsOptional()
    name?: string

    @IsPhoneNumber()
    @IsOptional()
    phone?: string

    @IsString({ message: STORE_MESSAGES.INVALID_PASSWORD })
    @IsStrongPassword()
    @IsOptional()
    password?: string
}