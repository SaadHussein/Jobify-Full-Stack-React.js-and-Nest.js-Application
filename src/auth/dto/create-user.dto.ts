import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsEmail({}, { message: 'invalid email format' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(8, { message: 'password must be at least 8 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'location is required' })
  location: string;

  @IsString()
  @IsNotEmpty({ message: 'last name is required' })
  lastName: string;
}
