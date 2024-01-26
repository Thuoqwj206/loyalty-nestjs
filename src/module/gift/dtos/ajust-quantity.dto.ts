import { IsNumber } from "class-validator";

export class AdjustQuantityDTO {
    @IsNumber()
    quantity: number
}