import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from "class-validator";

export class CreateOrderDTO {
    @IsNumber()
    @IsNotEmpty()

    userId: number

    @IsNotEmpty()
    @IsNumber()
    storeId: number
}