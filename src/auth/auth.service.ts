import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { comparePassword, hashPassword } from 'src/utils/passwordUtils';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(res: Response, createUserDto: CreateUserDto) {
    try {
      const exists = await this.userModel.findOne({
        email: createUserDto.email,
      });
      if (exists) {
        throw new BadRequestException('Email already in use');
      }

      const isFirstAccount = (await this.userModel.countDocuments()) === 0;
      const hashedPassword = await hashPassword(createUserDto.password);

      const user = await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
        role: isFirstAccount ? 'admin' : 'user',
      });

      return this.buildResponse(user, res);
    } catch (error) {
      console.error('Registration error:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Something went wrong during registration',
      );
    }
  }

  async login(res: Response, loginDto: LoginDto) {
    try {
      const user = await this.userModel.findOne({ email: loginDto.email });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await comparePassword(
        loginDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return this.buildResponse(user, res);
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  logout(res: Response) {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
    });

    return { message: 'Logged out successfully' };
  }

  private buildResponse(user: UserDocument, res: Response) {
    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    const oneDay = 24 * 60 * 60 * 1000;
    res.cookie('token', token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      expires: new Date(Date.now() + oneDay),
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}
