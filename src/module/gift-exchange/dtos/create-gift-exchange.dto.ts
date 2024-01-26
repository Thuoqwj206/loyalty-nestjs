import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateGiftExchangeDTO {
    @IsNumber()
    @IsNotEmpty()
    giftId: number

    @IsNumber()
    @IsNotEmpty()
    quantity: number
}