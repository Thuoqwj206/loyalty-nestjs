import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateGiftDTO {
    @IsString({ message: 'Please Enter Valid Name' })
    @IsNotEmpty({ message: 'Please Enter A Name' })
    name: string

    @IsString({ message: 'Please enter a valid input' })
    @IsOptional()
    image: string

    @IsNumber()
    @IsNotEmpty({ message: 'Please enter a number' })
    pointRequired: number

    @IsDate({ message: 'Please enter a valid date' })
    expirationDate: Date

    @IsNumber()
    @IsNotEmpty({ message: 'Please enter a number' })
    quantityAvailable: number
}