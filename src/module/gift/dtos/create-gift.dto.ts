import { IsEmail, IsNumber, IsPhoneNumber, IsString } from "class-validator";

export class CreateGiftDTO {
    @IsString()
    name: string

    @IsString()
    image: string

    @IsNumber()
    price: number

    @IsNumber()
    quantityAvailable: number
}