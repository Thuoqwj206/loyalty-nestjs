import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { ITEM_MESSAGES } from "src/constant/messages/item.message";

export class CreateItemDTO {
    @IsString({ message: ITEM_MESSAGES.INVALID_NAME })
    @IsNotEmpty({ message: ITEM_MESSAGES.EMPTY_NAME })
    name: string

    @Type(() => Number)
    @IsNotEmpty({ message: ITEM_MESSAGES.EMPTY_PRICE })
    price: number

    @Type(() => Number)
    @IsNotEmpty({ message: ITEM_MESSAGES.EMPTY_QUANTITY_AVAILABLE })
    quantityAvailable: number
}

