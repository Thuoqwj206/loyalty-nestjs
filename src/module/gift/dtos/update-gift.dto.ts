import { Transform } from "class-transformer"
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MinDate } from "class-validator"
import { GIFT_MESSAGES } from "src/constant/messages"
export class UpdateGiftDTO {
    @IsOptional() @IsString({ message: GIFT_MESSAGES.INVALID_NAME })
    @IsOptional() @IsNotEmpty({ message: GIFT_MESSAGES.EMPTY_NAME })
    name: string
    @IsOptional() @IsString({ message: GIFT_MESSAGES.INVALID_IMAGE })
    image: string
    @IsOptional() @IsNumber()
    @IsOptional() @IsNotEmpty({ message: GIFT_MESSAGES.EMPTY_POINT_REQUIRED })
    pointRequired: number
    @IsOptional() @MinDate(new Date())
    @IsOptional() @Transform(({ value }) => new Date(value))
    @IsOptional() @IsDate({ message: GIFT_MESSAGES.INVALID_EXPIRATION_DATE })
    expirationDate: Date
    @IsOptional() @IsNumber()
    @IsOptional() @IsNotEmpty({ message: GIFT_MESSAGES.EMPTY_QUANTITY_AVAILABLE })
    quantityAvailable: number
}

