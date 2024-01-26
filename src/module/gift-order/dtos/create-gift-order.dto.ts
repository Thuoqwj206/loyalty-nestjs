import { IsEmail, IsNumber, IsPhoneNumber, IsString } from "class-validator";

export class CreateGiftOrderDTO {
    @IsNumber()
    userId: number

    @IsNumber()
    storeId: number
}