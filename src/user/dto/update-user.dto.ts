import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsEmail({}, { message: 'invalid email format' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'location is required' })
  location: string;

  @IsString()
  @IsNotEmpty({ message: 'last name is required' })
  lastName: string;
}
