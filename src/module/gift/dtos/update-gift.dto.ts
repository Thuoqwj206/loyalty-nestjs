import { Transform } from "class-transformer"
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MinDate } from "class-validator"
import { GIFT_MESSAGES } from "src/constant/messages"
export class UpdateGiftDTO {
    @IsString({ message: GIFT_MESSAGES.INVALID_NAME })
    @IsNotEmpty({ message: GIFT_MESSAGES.EMPTY_NAME })
    @IsOptional()
    name?: string
    @IsString({ message: GIFT_MESSAGES.INVALID_IMAGE })
    @IsOptional()
    image?: string
    @IsNumber()
    @IsNotEmpty({ message: GIFT_MESSAGES.EMPTY_POINT_REQUIRED })
    @IsOptional()
    pointRequired?: number
    @MinDate(new Date())
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: GIFT_MESSAGES.INVALID_EXPIRATION_DATE })
    @IsOptional()
    expirationDate?: Date
    @IsNumber()
    @IsNotEmpty({ message: GIFT_MESSAGES.EMPTY_QUANTITY_AVAILABLE })
    @IsOptional()
    quantityAvailable?: number
}

