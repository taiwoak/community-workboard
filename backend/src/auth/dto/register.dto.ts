import { IsEmail, IsEnum, IsNotEmpty, Matches } from "class-validator";
import { UserRole } from "../../common/enums/role.enum";

export class RegisterDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password is too weak'})
    password: string;

    @IsEnum(UserRole, {message: 'Role must either be a contributor or volunteer'})
    role: UserRole;
}