import { IsNotEmpty } from "class-validator";

export class CreateApplicationDto {
    @IsNotEmpty()
    message: string
}