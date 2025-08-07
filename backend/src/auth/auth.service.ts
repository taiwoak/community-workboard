import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async register(registerDto: RegisterDto) {
        const { email, password } = registerDto
   
        const existUser = await this.usersService.findByEmail(email);
        if (existUser) {
            throw new ConflictException('User already exists');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await this.usersService.create({ ...registerDto, password: hashedPassword});

        const userObject = user.toObject();
        const objectId = userObject._id as Types.ObjectId
        return {
            id: objectId.toString(),
            name: userObject.name,
            email: userObject.email,
            role: userObject.role
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            return this.generateToken(user);
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async generateToken(user: any) {
        const payload = { sub: user._id, role: user.role};
        const access_token = await this.jwtService.sign(payload);
        return { access_token };
    }

    async getMe(userId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) throw new NotFoundException('User not found');
        const userInfo = user.toObject() as any;
        delete userInfo.password;

        userInfo.id = (userInfo._id as Types.ObjectId).toString();
        delete userInfo._id;
        return userInfo;
    }
}
