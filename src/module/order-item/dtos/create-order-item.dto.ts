import { IsEmail, IsNumber, IsPhoneNumber, IsString } from "class-validator";

export class CreateOrderItemDTO {
    @IsNumber()
    itemId: number

    @IsNumber()
    quantity: number
}