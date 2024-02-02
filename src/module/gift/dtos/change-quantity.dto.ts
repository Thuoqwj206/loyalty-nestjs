import { IsNotEmpty, IsNumber } from "class-validator";
import { GIFT_MESSAGES } from "src/constant/messages";

export class ChangeQuantityDTO {
    @IsNumber()
    @IsNotEmpty({ message: GIFT_MESSAGES.EMPTY_QUANTITY_AVAILABLE })
    quantity: number
}