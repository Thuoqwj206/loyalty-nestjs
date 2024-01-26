import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class LoginAdminDTO {

    @IsEmail()
    @IsNotEmpty({ message: 'Please enter a valid value' })
    email: string

    @IsString({ message: 'Please enter a password' })
    @IsStrongPassword()
    password: string
} 