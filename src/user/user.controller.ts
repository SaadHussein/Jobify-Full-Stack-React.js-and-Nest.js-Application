import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/auth/schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Multer } from 'multer';
import { multerConfig } from 'src/common/config/multer.config';
import { TestUserGuard } from 'src/common/guards/test-user.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Req() req: Request) {
    const user = req.user;

    if (!user || !user.sub) {
      throw new UnauthorizedException('User not authenticated');
    }

    return await this.userService.getCurrentUser(user.sub);
  }

  @UseGuards(RolesGuard)
  @Get('app-stats')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async getApplicationStats() {
    return await this.userService.getStats();
  }

  @Patch('update-user')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  @HttpCode(HttpStatus.OK)
  @UseGuards(TestUserGuard)
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<User> {
    const user = req.user;

    if (!user || !user.sub) {
      throw new UnauthorizedException('User not authenticated');
    }

    const updatedUser = await this.userService.updateUser(
      user.sub,
      updateUserDto,
      file,
    );
    return updatedUser;
  }
}
