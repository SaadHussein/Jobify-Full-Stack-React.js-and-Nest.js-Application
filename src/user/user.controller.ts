import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/auth/schemas/user.schema';

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
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ): Promise<User> {
    const user = req.user;

    if (!user || !user.sub) {
      throw new UnauthorizedException('User not authenticated');
    }

    const updatedUser = await this.userService.updateUser(
      user.sub,
      updateUserDto,
    );
    return updatedUser;
  }
}
