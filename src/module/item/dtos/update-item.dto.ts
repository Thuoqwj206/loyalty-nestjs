import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { ITEM_MESSAGES } from "src/constant/messages/item.message"
export class UpdateItemDTO {
    @IsString({ message: ITEM_MESSAGES.INVALID_NAME })
    @IsNotEmpty({ message: ITEM_MESSAGES.EMPTY_NAME })
    @IsOptional()
    name?: string

    @IsString({ message: ITEM_MESSAGES.INVALID_IMAGE })
    @IsOptional()
    image?: string

    @IsNumber()
    @IsNotEmpty({ message: ITEM_MESSAGES.EMPTY_PRICE })
    @IsOptional()
    price?: number

    @IsNumber()
    @IsNotEmpty({ message: ITEM_MESSAGES.EMPTY_QUANTITY_AVAILABLE })
    @IsOptional()
    quantityAvailable?: number

}