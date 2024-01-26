import { IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";

export class UpdateStoreDTO {
    @IsString()
    @IsNotEmpty({ message: 'Please enter a valid name' })
    name: string

    @IsNotEmpty({ message: 'Please enter a valid value' })
    @IsPhoneNumber()
    phone: string

    @IsString({ message: 'Please enter a password' })
    @IsStrongPassword()
    password: string
}