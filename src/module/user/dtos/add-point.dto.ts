import { IsNotEmpty, IsNumber } from "class-validator";
import { USER_MESSAGES } from "src/constant/messages";

export class AddUserPointDTO {
    @IsNumber()
    @IsNotEmpty({ message: USER_MESSAGES.EMPTY_POINT })
    point: number
}