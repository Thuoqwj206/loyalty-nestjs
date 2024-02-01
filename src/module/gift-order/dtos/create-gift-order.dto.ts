import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class CreateGiftOrderDTO {
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string
}