import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class CreateOrderDTO {
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string
}