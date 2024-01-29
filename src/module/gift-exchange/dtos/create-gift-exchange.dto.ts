import { IsNotEmpty, IsNumber } from "class-validator";
import { GIFT_MESSAGES } from "src/common/messages";

export class CreateGiftExchangeDTO {
    @IsNumber()
    @IsNotEmpty()
    giftId: number

    @IsNumber()
    @IsNotEmpty()
    quantity: number
}