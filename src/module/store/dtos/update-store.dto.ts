import { IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";
import { STORE_MESSAGES } from "src/common/messages";

export class UpdateStoreDTO {
    @IsString()
    @IsNotEmpty({ message: STORE_MESSAGES.EMPTY_NAME })
    name: string

    @IsNotEmpty({ message: STORE_MESSAGES.EMPTY_PHONE })
    @IsPhoneNumber()
    phone: string

    @IsString({ message: STORE_MESSAGES.INVALID_PASSWORD })
    @IsStrongPassword()
    password: string
}