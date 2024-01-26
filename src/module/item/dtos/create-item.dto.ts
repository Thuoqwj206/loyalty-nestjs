import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateItemDTO {
    @IsString({ message: 'Please Enter Valid Name' })
    @IsNotEmpty({ message: 'Please Enter A Name' })
    name: string

    @IsString({ message: 'Please enter a valid input' })
    @IsOptional()
    image: string

    @IsNumber()
    @IsNotEmpty({ message: 'Please enter a number' })
    price: number

    @IsNumber()
    @IsNotEmpty({ message: 'Please enter a number' })
    quantityAvailable: number
}

