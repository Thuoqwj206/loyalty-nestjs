import { Transform, Type } from "class-transformer";
import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MinDate } from "class-validator";
import { GIFT_MESSAGES } from "src/constant/messages";

export class CreateGiftDTO {
    @IsString({ message: GIFT_MESSAGES.INVALID_NAME })
    @IsNotEmpty({ message: GIFT_MESSAGES.EMPTY_NAME })
    name: string

    @Type(() => Number)
    @IsNotEmpty({ message: GIFT_MESSAGES.EMPTY_POINT_REQUIRED })
    pointRequired: number

    @MinDate(new Date())
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: GIFT_MESSAGES.INVALID_EXPIRATION_DATE })
    expirationDate: Date

    @Type(() => Number)
    @IsNotEmpty({ message: GIFT_MESSAGES.EMPTY_QUANTITY_AVAILABLE })
    quantityAvailable: number
}