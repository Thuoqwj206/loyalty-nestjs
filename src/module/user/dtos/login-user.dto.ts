import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class LoginUserDTO {
    @IsEmail()
    @IsNotEmpty({ message: 'Please enter a valid value' })
    email: string

    @IsString()
    @IsNotEmpty({ message: 'Please enter a valid value' })
    password: string
}