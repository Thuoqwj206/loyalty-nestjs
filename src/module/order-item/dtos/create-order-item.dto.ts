import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateOrderItemDTO {
    @IsNumber()
    @IsNotEmpty()
    itemId: number

    @IsNumber()
    @IsNotEmpty()
    quantity: number
}