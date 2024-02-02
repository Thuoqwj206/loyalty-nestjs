import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { ITEM_MESSAGES } from "src/constant/messages/item.message"
export class UpdateItemDTO {
    @IsOptional() @IsString({ message: ITEM_MESSAGES.INVALID_NAME })
    @IsOptional() @IsNotEmpty({ message: ITEM_MESSAGES.EMPTY_NAME })
    name: string

    @IsOptional() @IsString({ message: ITEM_MESSAGES.INVALID_IMAGE })
    @IsOptional() @IsOptional()
    image: string

    @IsOptional() @IsNumber()
    @IsOptional() @IsNotEmpty({ message: ITEM_MESSAGES.EMPTY_PRICE })
    price: number

    @IsOptional() @IsNumber()
    @IsOptional() @IsNotEmpty({ message: ITEM_MESSAGES.EMPTY_QUANTITY_AVAILABLE })
    quantityAvailable: number

}