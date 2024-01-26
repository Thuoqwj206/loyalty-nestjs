import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateGiftDTO {
    @IsString()
    name: string

    @IsString()
    image: string

    @IsNumber()
    pointRequired: number

    @IsDate()
    expirationDate: Date

    @IsNumber()
    quantityAvailable: number
}