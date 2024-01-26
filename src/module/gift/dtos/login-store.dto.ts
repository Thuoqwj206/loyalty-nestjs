import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class LoginStoreDTO {
    @IsEmail()
    email: string

    @IsString()
    password: string
}