import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { Types } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { UserRole } from 'src/common/enums/role.enum';

@Injectable()
export class AuthService {
    private googleClient: OAuth2Client;
    constructor(private usersService: UsersService, private jwtService: JwtService, private configService: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
    );
  }

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

    async googleAuth(dto: GoogleAuthDto) {
    const ticket = await this.googleClient.verifyIdToken({
        idToken: dto.idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token');
    }

    const email = payload.email.toLowerCase();

    // Try to find existing user
    let user = await this.usersService.findByEmail(email);

    if (!user) {
        // New user → create account
        user = await this.usersService.create({
        email,
        name: payload.name || 'No Name',        // blank / null password for Google OAuth
        password: '',
        role: UserRole.Volunteer, // Default role
        });
    }

    // Generate JWT for the user (existing or new)
    return this.generateToken(user);
    }

}
