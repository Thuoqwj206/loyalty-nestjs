import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class RegisterStoreDTO {
    @IsString()
    name: string

    @IsPhoneNumber()
    phone: string

    @IsEmail()
    email: string

    @IsString()
    password: string
}