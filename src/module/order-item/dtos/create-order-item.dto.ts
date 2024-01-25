import { IsNumber } from "class-validator";

export class CreateOrderItemDTO {
    @IsNumber()
    itemId: number

    @IsNumber()
    quantity: number
}