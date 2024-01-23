import { IsPhoneNumber, IsString } from "class-validator";

export class UpdateStoreDTO {
    @IsString()
    name: string
    @IsPhoneNumber()
    phone: string

    password: string
}