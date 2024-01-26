import { IsNumber } from "class-validator";

export class CreateGiftExchangeDTO {
    @IsNumber()
    giftId: number

    @IsNumber()
    quantity: number
}