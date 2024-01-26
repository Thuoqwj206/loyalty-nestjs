import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";

export class RegisterStoreDTO {
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
    @IsStrongPassword()
    password: string
}