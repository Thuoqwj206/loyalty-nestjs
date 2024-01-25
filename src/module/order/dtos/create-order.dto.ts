import { IsEmail, IsNumber, IsPhoneNumber, IsString } from "class-validator";

export class CreateOrderDTO {
    @IsNumber()
    userId: number

    @IsNumber()
    storeId: number
}