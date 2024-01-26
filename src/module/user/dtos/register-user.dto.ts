import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class RegisterUserDTO {
    @IsString()
    name: string

    @IsNotEmpty({ message: 'Please enter a valid value' })
    @IsPhoneNumber()
    phone: string

    @IsEmail()
    @IsNotEmpty({ message: 'Please enter a valid value' })
    email: string

    @IsString()
    @IsNotEmpty({ message: 'Please enter a valid value' })
    password: string
}